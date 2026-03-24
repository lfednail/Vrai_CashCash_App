-- seed.sql
-- Jeu de données de test

-- Agences
INSERT INTO Agence (NomAgence, AdresseAgence, TelephoneAgence) VALUES 
('Agence Paris Nord', '12 rue de la Paix 75001 Paris', '0123456789'),
('Agence Lyon Centre', '45 rue de la République 69002 Lyon', '0456789123');

-- Employés (Mots de passe : 'password123' bcrypté)
INSERT INTO Employe (Matricule, NomEmploye, PrenomEmploye, AdresseEmploye, DateEmbauche, NumeroAgence, email, mot_de_passe, role) VALUES ('GEST001', 'Dupont', 'Jean', '1 rue de Paris', '2020-01-15', 1, 'jean.dupont@cashcash.fr', '$2y$10$EP0TqQeXl5a5tN/.NfEaJuI.P35N3.A79vD63G6W/O/T9J60yD.E2', 'GESTIONNAIRE'),('TECH001', 'Martin', 'Luc', '12 rue Victor Hugo', '2021-03-10', 1, 'luc.martin@cashcash.fr', '$2y$10$EP0TqQeXl5a5tN/.NfEaJuI.P35N3.A79vD63G6W/O/T9J60yD.E2', 'TECHNICIEN'),('TECH002', 'Lefebvre', 'Sophie', '8 avenue Jean Jaurès', '2022-05-20', 2, 'sophie.lefebvre@cashcash.fr', '$2y$10$EP0TqQeXl5a5tN/.NfEaJuI.P35N3.A79vD63G6W/O/T9J60yD.E2', 'TECHNICIEN'),('GEST002', 'Lecorp', 'Bastion', '112 rue Paul Bertant', '2024-02-17', 2, 'bastion.lecorp@cashcash.fr', '$2y$10$EP0TqQeXl5a5tN/.NfEaJuI.P35N3.A79vD63G6W/O/T9J60yD.E2', 'GESTIONNAIRE');


-- Technicien (héritage de Employé)
INSERT INTO Technicien (Matricule, TelephoneMobile, Qualification, DateObtention) VALUES 
('TECH001', '0612345678', 'Expert Réseaux', '2019-06-15'),
('TECH002', '0698765432', 'Technicien Support', '2021-12-01');

-- Clients
INSERT INTO Client (RaisonSociale, Siren, CodeApe, Adresse, TelephoneClient, Email, DureeDeplacement, DistanceKM, NumeroAgence) VALUES 
('Entreprise XYZ', '12345678901234', '6201Z', '100 rue de Bercy 75012 Paris', '0198765432', 'contact@xyz.fr', 30, 15, 1),
('Boutique ABC', '98765432109876', '4711D', '5 place Bellecour 69002 Lyon', '0412345678', 'hello@abc.com', 15, 5, 2);

-- Types de Matériel
INSERT INTO TypeMateriel (ReferenceInterne, LibelleTypeMateriel) VALUES 
('TM-CAISSE', 'Caisse Enregistreuse Tactile'),
('TM-TPE', 'Terminal de Paiement Électronique');

-- Types de Contrat
INSERT INTO TypeContrat (RefTypeContrat, DelaiIntervention, TauxApplicable) VALUES 
('PREMIUM', 4, 1.50),
('STANDARD', 24, 1.00),
('GOLD', 2, 2.00);

-- Contrats de Maintenance
INSERT INTO ContratMaintenance (DateSignature, DateEcheance, NumeroClient, RefTypeContrat) VALUES 
('2024-01-01', '2026-01-01', 1, 'PREMIUM'),
('2024-01-01', '2026-01-13', 1, 'GOLD'),
('2024-05-01', '2024-11-01', 2, 'STANDARD'); -- Contrat de test expiré

-- Matériels associés
INSERT INTO Materiel (NumeroSerie, DateVente, DateInstallation, PrixVente, Emplacement, ReferenceInterneTypeMateriel, NumeroClient, NumeroContrat) VALUES 
('SN-CAISSE-001', '2023-12-15', '2024-01-02', 1500.00, 'Accueil Magasin', 'TM-CAISSE', 1, 1),
('SN-TPE-002', '2023-12-15', '2024-01-02', 300.00, 'Comptoir principal', 'TM-TPE', 1, 1),
('SN-CAISSE-003', '2024-04-20', '2024-05-05', 1200.00, 'Caisse 1', 'TM-CAISSE', 2, 2);
