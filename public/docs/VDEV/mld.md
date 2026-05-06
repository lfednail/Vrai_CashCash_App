# 🗄️ Modèle Relationnel (MLD) - CashCash

Ce document présente la structure logique de la base de données. Les clés primaires sont soulignées (ou préfixées par PK) et les clés étrangères sont suivies d'un astérisque (ou préfixées par FK).

---

## 1. Tables de Référence
- **Famille** (#<u>CodeFamille</u>, LibelleFamille)
- **TypeMateriel** (#<u>ReferenceInterne</u>, LibelleTypeMateriel, CodeFamille*)
- **TypeContrat** (#<u>RefTypeContrat</u>, DelaiIntervention, TauxApplicable)
- **Agence** (#<u>NumeroAgence</u>, NomAgence, AdresseAgence, TelephoneAgence)

## 2. Employés
- **Employe** (#<u>Matricule</u>, NomEmploye, PrenomEmploye, AdresseEmploye, DateEmbauche, NumeroAgence*, Email, MotDePasse, Role)
- **Technicien** (#<u>Matricule*</u>, TelephoneMobile, Qualification, DateObtention)

## 3. Parc Client
- **Client** (#<u>NumeroClient</u>, RaisonSociale, Siren, CodeApe, Adresse, TelephoneClient, Email, DureeDeplacement, DistanceKM, NumeroAgence*)
- **ContratMaintenance** (#<u>NumeroContrat</u>, DateSignature, DateEcheance, NumeroClient*, RefTypeContrat*)
- **Materiel** (#<u>NumeroSerie</u>, DateVente, DateInstallation, PrixVente, Emplacement, ReferenceInterneTypeMateriel*, NumeroClient*, NumeroContrat*)

## 4. Suivi d'Intervention
- **Intervention** (#<u>NumeroIntervent</u>, DateVisite, HeureVisite, MatriculeTechnicien*, NumeroClient*)
- **Controler** (#<u>NumeroIntervent*</u>, #<u>NumeroSerieMateriel*</u>, TempsPasse, Commentaire)

---

## 5. Intégrité Référentielle
- **ON DELETE CASCADE** : Appliqué sur `Client -> ContratMaintenance`, `Intervention -> Controler`, `Materiel -> Controler`.
- **ON DELETE RESTRICT** : Appliqué sur les tables de référence (`Famille`, `TypeMateriel`, `Agence`).
- **ON DELETE SET NULL** : Appliqué sur `ContratMaintenance -> Materiel` pour conserver l'historique du matériel même si le contrat est rompu.
