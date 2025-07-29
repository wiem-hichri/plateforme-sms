#  Plateforme SMS

Plateforme web complète de **gestion et d’envoi de SMS professionnels**, développée dans le cadre de mon projet de fin d’études.

##  Fonctionnalités principales

-  Gestion des contacts et des groupes
-  Envoi de SMS individuels et groupés
-  Création de modèles de messages avec variables dynamiques
-  Historique des envois et exportation en Excel
-  Gestion des utilisateurs avec rôles (admin, employé, etc.)
-  Gestion des cartes SIM avec routage intelligent des SMS 
-  Authentification sécurisée (sessions)
-  Statistiques en temps réel (dashboard)
-  Génération automatique de messages via IA (optionnelle)
-  Protection des SMS sensibles (notamment les notifications salariales)

##  Technologies utilisées

###  Frontend
- Angular
- TypeScript
- HTML / CSS
- Tailwind CSS

###  Backend
- Node.js
- Express.js
- MySQL

###  Autres outils
- Postman (tests API)
- Git / GitHub
- XAMPP / phpMyAdmin
- Méthode Agile (Scrum)

##  Installation locale

### 1. Prérequis

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [MySQL](https://www.mysql.com/) (via XAMPP ou autre)
- Git

### 2. Clonage du projet

```bash
git clone https://github.com/wiem-hichri/plateforme-sms.git
cd plateforme-sms

### 3. Configuration de la base de données

- Crée une base de données nommée `sms_platform` dans MySQL.
- Crée un fichier `.env` dans le dossier `/backend` en te basant sur ces variables(Exemples) :

      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=sms_platform
      DB_PORT=3308
      JWT_SECRET=3a877dd7af38943cbe0eae3a9c7f51746419bfbdb75e46d70682cd2fb9da6454b18126faa61183d68fec338f00bc92dcb134c101f45290b1fe054e9b2eb69kl0
      OPENROUTER_API_KEY=sk-or-v1-95ae1y45c7ba92ec25df0515c701d08ab70b53ce29b163f71677ca245ju5-8+r


### 4. Lancer le backend

```bash
cd backend
npm install
npm start

### 4. Lancer le frontend

```bash
cd frontend
npm install
ng serve
