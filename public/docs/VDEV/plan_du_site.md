# 🗺️ Plan du Site & Architecture Technique - CashCash

Ce document constitue la référence officielle du squelette applicatif et de la structure de données pour le projet **CashCash**.

---

## 🏗️ 1. Squelette de l'Application (Arborescence)

L'application est structurée pour offrir une expérience fluide selon le profil utilisateur. Le diagramme ci-dessous illustre la navigation et l'interaction avec la base de données.

```mermaid
---
config:
  theme: base
  themeVariables:
    primaryColor: '#e1f5fe'
    edgeLabelBackground: '#ffffff'
    tertiaryColor: '#f1f8e9'
  layout: elk
---
flowchart TB
 subgraph GESTION["👑 ESPACE GESTIONNAIRE"]
        G_Clients["👥 Clients<br><i>/gestionnaire/clients</i>"]
        GestDash["📊 Dashboard Gestionnaire<br><i>/gestionnaire</i>"]
        G_Techs["👷 Techniciens<br><i>/gestionnaire/techniciens</i>"]
        G_Assign["📅 Assigner<br><i>/gestionnaire/assigner</i>"]
        G_Agence["🏢 Agence<br><i>/gestionnaire/agence</i>"]
        G_Client_New["➕ Nouveau Client"]
        G_Client_Det["🔍 Détails Client"]
  end
 subgraph DATA["💾 COUCHE DE DONNÉES"]
        Prisma[["💎 Prisma ORM"]]
        DB[("🗄️ MySQL Database")]
  end
 subgraph TECH["🔧 ESPACE TECHNICIEN"]
        T_Inter["📋 Mes Interventions<br><i>/technicien/interventions</i>"]
        TechDash["🛠️ Dashboard Technicien<br><i>/technicien</i>"]
        T_Search["🔍 Recherche Matériel<br><i>/technicien/recherche</i>"]
        T_Report@{ label: "📝 Rapports d'activité<br><i>/technicien/reports</i>" }
        T_Valid["✅ Validation<br><i>/technicien/valider</i>"]
  end
    Start(("🏠 Accueil")) --> Login["🔐 Connexion<br><i>/login</i>"]
    Login --> Auth{Role:}
    Auth -->|Gestionnaire| GestDash
    Auth -->|Technicien| TechDash
    GestDash --> G_Clients & G_Techs & G_Assign & G_Agence
    G_Clients --> G_Client_New & G_Client_Det
    Prisma <--> DB
    TechDash --> T_Inter & T_Search & T_Report & T_Valid
    GESTION -.-> Prisma
    TECH -.-> Prisma

    T_Report@{ shape: rect}
    style GESTION fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style TECH fill:#f1f8e9,stroke:#388e3c,stroke-width:2px
    style DATA fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

---

## 🗃️ 2. Architecture de la Base de Données (MySQL)

Le modèle de données est optimisé pour la traçabilité des interventions et la gestion du parc matériel.

```mermaid
erDiagram
    %% Thème et Style
    AGENCE ||--o{ EMPLOYE : "emploie"
    EMPLOYE ||--o| TECHNICIEN : "spécialise"
    AGENCE ||--o{ CLIENT : "gère"
    CLIENT ||--o{ CONTRAT_MAINTENANCE : "souscrit"
    CLIENT ||--o{ INTERVENTION : "reçoit"
    TECHNICIEN ||--o{ INTERVENTION : "réalise"
    CLIENT ||--o{ MATERIEL : "détient"
    MATERIEL }o--|| TYPE_MATERIEL : "est de type"
    TYPE_MATERIEL }o--|| FAMILLE : "appartient à"
    INTERVENTION ||--o{ CONTROLER : "vérifie"
    MATERIEL ||--o{ CONTROLER : "est contrôlé"

    AGENCE {
        int numeroAgence PK
        string nomAgence
        string telephone
    }
    CLIENT {
        int numeroClient PK
        string raisonSociale
        string adresse
    }
    INTERVENTION {
        int numeroIntervent PK
        date dateVisite
        time heureVisite
    }
```

---

## 🛣️ 3. Répertoire des Routes & Fonctionnalités

| Type | Route | Icône | Description | Accès |
| :--- | :--- | :---: | :--- | :--- |
| **Public** | `/` | 🏠 | Page d'atterrissage et présentation. | Libre |
| **Public** | `/login` | 🔐 | Portail d'accès sécurisé. | Libre |
| **Admin** | `/gestionnaire` | 📊 | Vue d'ensemble et statistiques de maintenance. | Gestionnaire |
| **Admin** | `/gestionnaire/clients` | 👥 | Gestion du portefeuille clients et contrats. | Gestionnaire |
| **Field** | `/technicien` | 🛠️ | Planning quotidien des interventions. | Technicien |
| **Field** | `/technicien/interventions` | 📅 | Détails techniques et historique client. | Technicien |
| **Système**| `/api/*` | ⚙️ | Couche de service pour les échanges MySQL. | Système |

---

## 🛠️ 4. Stack Technique & Skeleton
> [!NOTE]
> L'architecture repose sur un modèle **Client-Serveur** moderne utilisant Next.js.

- **Frontend** : React.js, Next.js avec **Tailwind CSS** pour une interface responsive et moderne.
- **Backend** : API Routes (Next.js) agissant comme middleware entre l'UI et la DB.
- **Persistance** : **MySQL 8.0** hébergé, avec **Prisma** pour la sécurité des types et la performance des requêtes.
- **Navigation** : Système de Layouts imbriqués permettant une persistence des menus (Sidebar) sans rechargement.

---

## 🎨 Légende du Diagramme
| Symbole | Signification |
| :---: | :--- |
| `🏠` | Point d'entrée public |
| `👑` | Accès restreint aux Gestionnaires |
| `🔧` | Accès restreint aux Techniciens |
| `💾` | Persistance des données (MySQL) |
| `-.->` | Flux de données asynchrone (API) |
