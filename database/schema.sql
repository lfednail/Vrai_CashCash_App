-- schema.sql
-- Structure de base de données pour CASHCASH

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Controler;
DROP TABLE IF EXISTS Intervention;
DROP TABLE IF EXISTS Materiel;
DROP TABLE IF EXISTS ContratMaintenance;
DROP TABLE IF EXISTS Client;
DROP TABLE IF EXISTS Technicien;
DROP TABLE IF EXISTS Employe;
DROP TABLE IF EXISTS Agence;
DROP TABLE IF EXISTS TypeContrat;
DROP TABLE IF EXISTS TypeMateriel;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tables de référence
CREATE TABLE TypeMateriel (
    ReferenceInterne VARCHAR(50) PRIMARY KEY,
    LibelleTypeMateriel VARCHAR(255) NOT NULL
);

CREATE TABLE TypeContrat (
    RefTypeContrat VARCHAR(50) PRIMARY KEY,
    DelaiIntervention INT NOT NULL COMMENT 'Délai en heures',
    TauxApplicable DECIMAL(5,2) NOT NULL
);

CREATE TABLE Agence (
    NumeroAgence INT AUTO_INCREMENT PRIMARY KEY,
    NomAgence VARCHAR(100) NOT NULL,
    AdresseAgence VARCHAR(255) NOT NULL,
    TelephoneAgence VARCHAR(20) NOT NULL
);

-- 2. Employés
CREATE TABLE Employe (
    Matricule VARCHAR(50) PRIMARY KEY,
    NomEmploye VARCHAR(100) NOT NULL,
    PrenomEmploye VARCHAR(100) NOT NULL,
    AdresseEmploye VARCHAR(255) NOT NULL,
    DateEmbauche DATE NOT NULL,
    NumeroAgence INT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('TECHNICIEN', 'GESTIONNAIRE') NOT NULL DEFAULT 'TECHNICIEN',
    FOREIGN KEY (NumeroAgence) REFERENCES Agence(NumeroAgence) ON DELETE RESTRICT
);

CREATE TABLE Technicien (
    Matricule VARCHAR(50) PRIMARY KEY,
    TelephoneMobile VARCHAR(20) NOT NULL,
    Qualification VARCHAR(100) NOT NULL,
    DateObtention DATE,
    FOREIGN KEY (Matricule) REFERENCES Employe(Matricule) ON DELETE CASCADE
);

-- 3. Clients et Contrats
CREATE TABLE Client (
    NumeroClient INT AUTO_INCREMENT PRIMARY KEY,
    RaisonSociale VARCHAR(150) NOT NULL,
    Siren VARCHAR(14) UNIQUE NOT NULL,
    CodeApe VARCHAR(10) NOT NULL,
    Adresse VARCHAR(255) NOT NULL,
    TelephoneClient VARCHAR(20) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    DureeDeplacement INT NOT NULL COMMENT 'Durée en minutes',
    DistanceKM INT NOT NULL,
    NumeroAgence INT NOT NULL,
    FOREIGN KEY (NumeroAgence) REFERENCES Agence(NumeroAgence) ON DELETE RESTRICT
);

CREATE TABLE ContratMaintenance (
    NumeroContrat INT AUTO_INCREMENT PRIMARY KEY,
    DateSignature DATE NOT NULL,
    DateEcheance DATE NOT NULL,
    NumeroClient INT NOT NULL,
    RefTypeContrat VARCHAR(50) NOT NULL,
    FOREIGN KEY (NumeroClient) REFERENCES Client(NumeroClient) ON DELETE CASCADE,
    FOREIGN KEY (RefTypeContrat) REFERENCES TypeContrat(RefTypeContrat) ON DELETE RESTRICT
);

-- 4. Matériel
CREATE TABLE Materiel (
    NumeroSerie VARCHAR(100) PRIMARY KEY,
    DateVente DATE NOT NULL,
    DateInstallation DATE NOT NULL,
    PrixVente DECIMAL(10,2) NOT NULL,
    Emplacement VARCHAR(255) NOT NULL,
    ReferenceInterneTypeMateriel VARCHAR(50) NOT NULL,
    NumeroClient INT NOT NULL,
    NumeroContrat INT,
    FOREIGN KEY (ReferenceInterneTypeMateriel) REFERENCES TypeMateriel(ReferenceInterne) ON DELETE RESTRICT,
    FOREIGN KEY (NumeroClient) REFERENCES Client(NumeroClient) ON DELETE CASCADE,
    FOREIGN KEY (NumeroContrat) REFERENCES ContratMaintenance(NumeroContrat) ON DELETE SET NULL
);

-- 5. Intervention (et table associative Controler)
CREATE TABLE Intervention (
    NumeroIntervent INT AUTO_INCREMENT PRIMARY KEY,
    DateVisite DATE NOT NULL,
    HeureVisite TIME NOT NULL,
    MatriculeTechnicien VARCHAR(50) NOT NULL,
    NumeroClient INT NOT NULL,
    FOREIGN KEY (MatriculeTechnicien) REFERENCES Technicien(Matricule) ON DELETE RESTRICT,
    FOREIGN KEY (NumeroClient) REFERENCES Client(NumeroClient) ON DELETE CASCADE
);

CREATE TABLE Controler (
    NumeroIntervent INT NOT NULL,
    NumeroSerieMateriel VARCHAR(100) NOT NULL,
    TempsPasse INT COMMENT 'Temps passé en minutes',
    Commentaire TEXT,
    PRIMARY KEY (NumeroIntervent, NumeroSerieMateriel),
    FOREIGN KEY (NumeroIntervent) REFERENCES Intervention(NumeroIntervent) ON DELETE CASCADE,
    FOREIGN KEY (NumeroSerieMateriel) REFERENCES Materiel(NumeroSerie) ON DELETE CASCADE
);

-- 6. Triggers (Règles Métier)
DELIMITER //

-- Règle stricte: Un technicien ne peut intervenir que dans son agence.
CREATE TRIGGER check_technicien_agence
BEFORE INSERT ON Intervention
FOR EACH ROW
BEGIN
    DECLARE agence_tech INT;
    DECLARE agence_client INT;

    SELECT NumeroAgence INTO agence_tech FROM Employe WHERE Matricule = NEW.MatriculeTechnicien;
    SELECT NumeroAgence INTO agence_client FROM Client WHERE NumeroClient = NEW.NumeroClient;

    IF agence_tech != agence_client THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Règle stricte: Le technicien et le client doivent appartenir à la même agence.';
    END IF;
END //

-- Règle stricte: Impossible d'intervenir sur un matériel hors contrat.
CREATE TRIGGER check_intervention_contrat
BEFORE INSERT ON Controler
FOR EACH ROW
BEGIN
    DECLARE v_contrat_id INT;
    DECLARE v_date_visite DATE;
    DECLARE v_date_echeance DATE;

    SELECT NumeroContrat INTO v_contrat_id FROM Materiel WHERE NumeroSerie = NEW.NumeroSerieMateriel;
    
    IF v_contrat_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Règle stricte: Impossible d intervenir sur un matériel qui n est sous aucun contrat de maintenance.';
    ELSE
        SELECT DateVisite INTO v_date_visite FROM Intervention WHERE NumeroIntervent = NEW.NumeroIntervent;
        SELECT DateEcheance INTO v_date_echeance FROM ContratMaintenance WHERE NumeroContrat = v_contrat_id;

        IF v_date_echeance < v_date_visite THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Règle stricte: Le contrat de maintenance pour ce matériel est expiré.';
        END IF;
    END IF;
END //

DELIMITER ;

-- 7. Procédures stockées (Statistiques Gestionnaire)
DELIMITER //

CREATE PROCEDURE GetGestionnaireStats(IN p_agence_id INT, IN p_month INT, IN p_year INT)
BEGIN
    SELECT 
        COUNT(DISTINCT i.NumeroIntervent) as total_interventions,
        COALESCE(SUM(c.DistanceKM * 2), 0) as distance_parcourue_km,
        COALESCE(SUM(ct.TempsPasse), 0) as temps_total_minutes
    FROM Intervention i
    JOIN Client c ON i.NumeroClient = c.NumeroClient
    LEFT JOIN Controler ct ON i.NumeroIntervent = ct.NumeroIntervent
    WHERE c.NumeroAgence = p_agence_id
      AND MONTH(i.DateVisite) = p_month 
      AND YEAR(i.DateVisite) = p_year;
END //

DELIMITER ;
