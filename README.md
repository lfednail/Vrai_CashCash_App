# CASHCASH - Gestion des Interventions

CASHCASH est une application web professionnelle de gestion de maintenance et d'interventions techniques, conçue pour répondre aux exigences des entreprises de services numériques (ESN).

## 🚀 Fonctionnalités

### 👨‍🔧 Pour les Techniciens
- **Authentification sécurisée** : Accès restreint via Matricule/Email.
- **Gestion des missions** : Liste des interventions assignées avec tri par date et priorité.
- **Fiches de contrôle** : Saisie du temps passé et des commentaires par matériel.
- **Export PDF** : Génération immédiate de rapports d'intervention professionnels.

### 🧑‍💼 Pour les Gestionnaires
- **Tableau de bord** : Statistiques mensuelles (nombre d'interventions, kilomètres, temps total).
- **Assignation intelligente** : Attribution des missions aux techniciens de la même agence uniquement.
- **Suivi d'agence** : Vue d'ensemble des techniciens et clients rattachés.

---

## 🏗️ Architecture Technique

- **Frontend** : Next.js 16 (App Router), Tailwind CSS, Lucide React, Shadcn/ui inspiration.
- **Backend** : Next.js 16 Server Actions, Prisma ORM.
- **Base de données** : MySQL (Triggers, Procédures stockées).
- **Sécurité** : Auth.js (NextAuth), Bcrypt hashing, Next.js 16 **Proxy** RBAC.
- **PDF** : jsPDF + autoTable.


---

## 🗃️ Modèle de Données (MCD)

```mermaid
erDiagram
    AGENCE ||--o{ EMPLOYE : "Travaille"
    AGENCE ||--o{ CLIENT : "Gère"
    EMPLOYE ||--|| TECHNICIEN : "Est"
    CLIENT ||--o{ CONTRAT_MAINTENANCE : "Souscrit"
    CLIENT ||--o{ MATERIEL : "Possède"
    CONTRAT_MAINTENANCE ||--o{ MATERIEL : "Couvre"
    TYPE_CONTRAT ||--o{ CONTRAT_MAINTENANCE : "Caractérise"
    TYPE_MATERIEL ||--o{ MATERIEL : "Appartient"
    CLIENT ||--o{ INTERVENTION : "Concerne"
    TECHNICIEN ||--o{ INTERVENTION : "Réalise"
    INTERVENTION ||--o{ CONTROLER : "Détaille"
    MATERIEL ||--o{ CONTROLER : "Est contrôlé par"
```
![Le MCD](./public/images/mdc_mysql.png)

---

## 🛠️ Installation & Configuration

1. **Base de données** :
   - Exécutez `database/schema.sql` puis `database/seed.sql` sur votre serveur MySQL.
2. **Variables d'environnement** :
   - Créez un fichier `.env` à la racine :
     ```env
     DATABASE_URL="mysql://user:password@localhost:3306/cashcash_final_app"
     NEXTAUTH_SECRET="votre_secret_aleatoire"
     NEXTAUTH_URL="http://localhost:3000"
     ```
3. **Installation** :
   ```bash
   npm install
   npx prisma generate
   npm run dev
   ```

---

## ⚠️ Règles Métier Implémentées

- **Triggers MySQL** :
  - Un technicien ne peut intervenir que sur un client de sa propre agence.
  - Aucune intervention possible sur un matériel hors contrat.
- **Validation Backend** :
  - Vérification des droits et de la cohérence des agences avant toute création d'intervention.
- **Sécurité** :
  - Mots de passe hashés avec Bcrypt (Salt rounds: 10).
  - Sessions JWT sécurisées.
