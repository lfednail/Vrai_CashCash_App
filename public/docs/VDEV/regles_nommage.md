# 🔤 Règles de Nommage - CashCash

Une gestion très stricte au niveau de la couche donnée et logicielle est demandée par VDEV. Voici les règles appliquées :

## 1. Variables et Fonctions (JavaScript/TypeScript)
- **Règle** : `camelCase`
- **Exemple** : `numeroIntervention`, `getTechnicienStats()`, `isMissionValid`.
- **Interdiction** : Pas d'underscore (`_`) au début des noms de variables publiques.

## 2. Classes et Composants (React)
- **Règle** : `PascalCase`
- **Exemple** : `InterventionValidationForm`, `DashboardCard`, `ClientTable`.
- **Fichiers** : Le nom du fichier doit correspondre au nom du composant principal (ex: `Navbar.tsx`).

## 3. Fichiers et Dossiers (Système)
- **Règle** : `kebab-case`
- **Exemple** : `pdf-utils.ts`, `intervention-actions.ts`, `/gestionnaire/clients`.

## 4. Base de Données (SQL)
- **Tables** : `PascalCase` (ex: `ContratMaintenance`).
- **Colonnes** : `PascalCase` pour correspondre au modèle métier initial (ex: `NumeroSerie`).
- **Clés Primaires** : Nom explicite (ex: `NumeroClient` au lieu de `id`).

## 5. Constantes
- **Règle** : `UPPER_SNAKE_CASE`
- **Exemple** : `MAX_UPLOAD_SIZE`, `DEFAULT_PAGINATION_LIMIT`.
