# 📄 Descriptions Textuelles des Cas d'Utilisation

Ce document détaille les principaux scénarios d'utilisation de l'application **CashCash**.

---

## 1. UC-01 : S'authentifier
**Acteur** : Tout employé (Technicien ou Gestionnaire)

1. L'utilisateur accède à la page de connexion.
2. L'utilisateur saisit son identifiant (Email ou Matricule) et son mot de passe.
3. Le système vérifie les identifiants.
4. Si correct, le système redirige l'utilisateur vers son tableau de bord spécifique (Technicien ou Gestionnaire).
**Post-condition** : Session utilisateur ouverte avec droits RBAC activés.

---

## 2. UC-02 : Consulter ses interventions (Technicien)
**Acteur** : Technicien

1. Le technicien accède à son tableau de bord.
2. Le système affiche la liste des interventions qui lui sont assignées.
3. Le technicien peut filtrer les interventions par date ou par client.
4. Le technicien sélectionne une intervention pour voir les détails (matériels à contrôler, adresse client).

---

## 3. UC-03 : Valider une intervention
**Acteur** : Technicien

1. Le technicien sélectionne une intervention en cours.
2. Pour chaque matériel listé, le technicien saisit le temps passé et ses observations.
3. Le technicien valide la saisie globale.
4. Le système enregistre les contrôles et marque l'intervention comme "Validée".
5. Le système propose le téléchargement de la fiche d'intervention PDF.

---

## 4. UC-04 : Consulter les statistiques d'agence
**Acteur** : Gestionnaire

1. Le gestionnaire accède à son espace.
2. Le système affiche les indicateurs clés (KPI) de son agence pour le mois en cours :
    - Nombre total d'interventions.
    - Distance totale parcourue par les techniciens.
    - Temps total passé en intervention.
3. Le gestionnaire peut visualiser un graphique d'activité hebdomadaire.
