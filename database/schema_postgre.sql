-- schema_postgre.sql
-- Structure de base de données pour CASHCASH (PostgreSQL / Linux)

-- Nettoyage de la base
DROP TABLE IF EXISTS "Controler" CASCADE;
DROP TABLE IF EXISTS "Intervention" CASCADE;
DROP TABLE IF EXISTS "Materiel" CASCADE;
DROP TABLE IF EXISTS "ContratMaintenance" CASCADE;
DROP TABLE IF EXISTS "Client" CASCADE;
DROP TABLE IF EXISTS "Technicien" CASCADE;
DROP TABLE IF EXISTS "Employe" CASCADE;
DROP TABLE IF EXISTS "Agence" CASCADE;
DROP TABLE IF EXISTS "TypeContrat" CASCADE;
DROP TABLE IF EXISTS "TypeMateriel" CASCADE;
DROP TABLE IF EXISTS "Famille" CASCADE;
DROP TYPE IF EXISTS role_type;

-- Types énumérés
CREATE TYPE role_type AS ENUM ('TECHNICIEN', 'GESTIONNAIRE');

-- 1. Tables de référence
CREATE TABLE "Famille" (
    "CodeFamille" VARCHAR(50) PRIMARY KEY,
    "LibelleFamille" VARCHAR(255) NOT NULL
);

CREATE TABLE "TypeMateriel" (
    "ReferenceInterne" VARCHAR(50) PRIMARY KEY,
    "LibelleTypeMateriel" VARCHAR(255) NOT NULL,
    "CodeFamille" VARCHAR(50) NOT NULL,
    CONSTRAINT fk_famille FOREIGN KEY ("CodeFamille") REFERENCES "Famille"("CodeFamille") ON DELETE RESTRICT
);

CREATE TABLE "TypeContrat" (
    "RefTypeContrat" VARCHAR(50) PRIMARY KEY,
    "DelaiIntervention" INT NOT NULL, -- Délai en heures
    "TauxApplicable" DECIMAL(5,2) NOT NULL
);

CREATE TABLE "Agence" (
    "NumeroAgence" SERIAL PRIMARY KEY,
    "NomAgence" VARCHAR(100) NOT NULL,
    "AdresseAgence" VARCHAR(255) NOT NULL,
    "TelephoneAgence" VARCHAR(20) NOT NULL
);

-- 2. Employés
CREATE TABLE "Employe" (
    "Matricule" VARCHAR(50) PRIMARY KEY,
    "NomEmploye" VARCHAR(100) NOT NULL,
    "PrenomEmploye" VARCHAR(100) NOT NULL,
    "AdresseEmploye" VARCHAR(255) NOT NULL,
    "DateEmbauche" DATE NOT NULL,
    "NumeroAgence" INT NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "role" role_type NOT NULL DEFAULT 'TECHNICIEN',
    CONSTRAINT fk_agence_employe FOREIGN KEY ("NumeroAgence") REFERENCES "Agence"("NumeroAgence") ON DELETE RESTRICT
);

CREATE TABLE "Technicien" (
    "Matricule" VARCHAR(50) PRIMARY KEY,
    "TelephoneMobile" VARCHAR(20) NOT NULL,
    "Qualification" VARCHAR(100) NOT NULL,
    "DateObtention" DATE,
    CONSTRAINT fk_employe_technicien FOREIGN KEY ("Matricule") REFERENCES "Employe"("Matricule") ON DELETE CASCADE
);

-- 3. Clients et Contrats
CREATE TABLE "Client" (
    "NumeroClient" SERIAL PRIMARY KEY,
    "RaisonSociale" VARCHAR(150) NOT NULL,
    "Siren" VARCHAR(14) UNIQUE NOT NULL,
    "CodeApe" VARCHAR(10) NOT NULL,
    "Adresse" VARCHAR(255) NOT NULL,
    "TelephoneClient" VARCHAR(20) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "DureeDeplacement" INT NOT NULL, -- Durée en minutes
    "DistanceKM" INT NOT NULL,
    "NumeroAgence" INT NOT NULL,
    CONSTRAINT fk_agence_client FOREIGN KEY ("NumeroAgence") REFERENCES "Agence"("NumeroAgence") ON DELETE RESTRICT
);

CREATE TABLE "ContratMaintenance" (
    "NumeroContrat" SERIAL PRIMARY KEY,
    "DateSignature" DATE NOT NULL,
    "DateEcheance" DATE NOT NULL,
    "NumeroClient" INT NOT NULL,
    "RefTypeContrat" VARCHAR(50) NOT NULL,
    CONSTRAINT fk_client_contrat FOREIGN KEY ("NumeroClient") REFERENCES "Client"("NumeroClient") ON DELETE CASCADE,
    CONSTRAINT fk_type_contrat FOREIGN KEY ("RefTypeContrat") REFERENCES "TypeContrat"("RefTypeContrat") ON DELETE RESTRICT
);

-- 4. Matériel
CREATE TABLE "Materiel" (
    "NumeroSerie" VARCHAR(100) PRIMARY KEY,
    "DateVente" DATE NOT NULL,
    "DateInstallation" DATE NOT NULL,
    "PrixVente" DECIMAL(10,2) NOT NULL,
    "Emplacement" VARCHAR(255) NOT NULL,
    "ReferenceInterneTypeMateriel" VARCHAR(50) NOT NULL,
    "NumeroClient" INT NOT NULL,
    "NumeroContrat" INT,
    CONSTRAINT fk_type_materiel FOREIGN KEY ("ReferenceInterneTypeMateriel") REFERENCES "TypeMateriel"("ReferenceInterne") ON DELETE RESTRICT,
    CONSTRAINT fk_client_materiel FOREIGN KEY ("NumeroClient") REFERENCES "Client"("NumeroClient") ON DELETE CASCADE,
    CONSTRAINT fk_contrat_materiel FOREIGN KEY ("NumeroContrat") REFERENCES "ContratMaintenance"("NumeroContrat") ON DELETE SET NULL
);

-- 5. Intervention (et table associative Controler)
CREATE TABLE "Intervention" (
    "NumeroIntervent" SERIAL PRIMARY KEY,
    "DateVisite" DATE NOT NULL,
    "HeureVisite" TIME NOT NULL,
    "MatriculeTechnicien" VARCHAR(50) NOT NULL,
    "NumeroClient" INT NOT NULL,
    CONSTRAINT fk_technicien_interv FOREIGN KEY ("MatriculeTechnicien") REFERENCES "Technicien"("Matricule") ON DELETE RESTRICT,
    CONSTRAINT fk_client_interv FOREIGN KEY ("NumeroClient") REFERENCES "Client"("NumeroClient") ON DELETE CASCADE
);

CREATE TABLE "Controler" (
    "NumeroIntervent" INT NOT NULL,
    "NumeroSerieMateriel" VARCHAR(100) NOT NULL,
    "TempsPasse" INT, -- Temps passé en minutes
    "Commentaire" TEXT,
    PRIMARY KEY ("NumeroIntervent", "NumeroSerieMateriel"),
    CONSTRAINT fk_interv_control FOREIGN KEY ("NumeroIntervent") REFERENCES "Intervention"("NumeroIntervent") ON DELETE CASCADE,
    CONSTRAINT fk_materiel_control FOREIGN KEY ("NumeroSerieMateriel") REFERENCES "Materiel"("NumeroSerie") ON DELETE CASCADE
);

-- 6. Triggers (PL/pgSQL)

-- Règle stricte: Un technicien ne peut intervenir que dans son agence.
CREATE OR REPLACE FUNCTION fn_check_technicien_agence()
RETURNS TRIGGER AS $$
DECLARE
    agence_tech INT;
    agence_client INT;
BEGIN
    SELECT "NumeroAgence" INTO agence_tech FROM "Employe" WHERE "Matricule" = NEW."MatriculeTechnicien";
    SELECT "NumeroAgence" INTO agence_client FROM "Client" WHERE "NumeroClient" = NEW."NumeroClient";

    IF agence_tech != agence_client THEN
        RAISE EXCEPTION 'Règle stricte: Le technicien et le client doivent appartenir à la même agence.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_technicien_agence
BEFORE INSERT ON "Intervention"
FOR EACH ROW EXECUTE FUNCTION fn_check_technicien_agence();

-- Règle stricte: Impossible d'intervenir sur un matériel hors contrat.
CREATE OR REPLACE FUNCTION fn_check_intervention_contrat()
RETURNS TRIGGER AS $$
DECLARE
    v_contrat_id INT;
    v_date_visite DATE;
    v_date_echeance DATE;
BEGIN
    SELECT "NumeroContrat" INTO v_contrat_id FROM "Materiel" WHERE "NumeroSerie" = NEW."NumeroSerieMateriel";
    
    IF v_contrat_id IS NULL THEN
        RAISE EXCEPTION 'Règle stricte: Impossible d intervenir sur un matériel qui n est sous aucun contrat de maintenance.';
    ELSE
        SELECT "DateVisite" INTO v_date_visite FROM "Intervention" WHERE "NumeroIntervent" = NEW."NumeroIntervent";
        SELECT "DateEcheance" INTO v_date_echeance FROM "ContratMaintenance" WHERE "NumeroContrat" = v_contrat_id;

        IF v_date_echeance < v_date_visite THEN
            RAISE EXCEPTION 'Règle stricte: Le contrat de maintenance pour ce matériel est expiré.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_intervention_contrat
BEFORE INSERT ON "Controler"
FOR EACH ROW EXECUTE FUNCTION fn_check_intervention_contrat();

-- 7. Procédures stockées (Statistiques Gestionnaire)
CREATE OR REPLACE PROCEDURE GetGestionnaireStats(p_agence_id INT, p_month INT, p_year INT)
AS $$
BEGIN
    -- Note: En PostgreSQL, les procédures ne retournent pas directement des jeux de résultats comme MySQL.
    -- On utilise généralement des fonctions renvoyant TABLE pour cela.
    NULL; 
END;
$$ LANGUAGE plpgsql;

-- Version fonction pour le retour de données
CREATE OR REPLACE FUNCTION GetGestionnaireStatsTable(p_agence_id INT, p_month INT, p_year INT)
RETURNS TABLE (
    total_interventions BIGINT,
    distance_parcourue_km NUMERIC,
    temps_total_minutes NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT i."NumeroIntervent")::BIGINT,
        COALESCE(SUM(c."DistanceKM" * 2), 0)::NUMERIC,
        COALESCE(SUM(ct."TempsPasse"), 0)::NUMERIC
    FROM "Intervention" i
    JOIN "Client" c ON i."NumeroClient" = c."NumeroClient"
    LEFT JOIN "Controler" ct ON i."NumeroIntervent" = ct."NumeroIntervent"
    WHERE c."NumeroAgence" = p_agence_id
      AND EXTRACT(MONTH FROM i."DateVisite") = p_month 
      AND EXTRACT(YEAR FROM i."DateVisite") = p_year;
END;
$$ LANGUAGE plpgsql;
