# 🏆 Podium - Plateforme de Gamification

## 📋 Description

Podium est une application de gamification complète permettant de gérer des équipes, des membres, des tâches et un système de classement en temps réel. L'application utilise un système de points pour motiver les équipes et suivre leurs performances.

## 🚀 Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Gestion des rôles (admin/membre)
- Authentification par JWT (JSON Web Token)
- Sessions de 30 jours

### 👥 Gestion des Équipes
- Création et modification d'équipes
- Attribution de couleurs personnalisées
- Visualisation des membres et scores
- Suppression d'équipes

### 👤 Gestion des Membres
- Ajout de membres aux équipes
- Modification des profils
- Attribution de rôles au sein des équipes
- Avatars personnalisés

### ✅ Gestion des Tâches
- Création de tâches avec niveaux de difficulté
- Statuts : À faire, En cours, Terminé, Validé
- Système de preuves (upload de fichiers)
- Dates limites et priorités
- Points attribués selon la difficulté

### 🎯 Système de Points
- Attribution automatique de points
- Bonus pour tâches terminées avant la deadline (+20%)
- Badges de série (3 tâches/jour = 50 points bonus)
- Historique complet des points

### 🏅 Classement en Temps Réel
- Classement quotidien, hebdomadaire et global
- Mise à jour en temps réel via WebSocket
- Statistiques détaillées par équipe

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données relationnelle
- **WebSocket (ws)** - Communication en temps réel
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hachage des mots de passe
- **Multer** - Gestion des uploads de fichiers

### Sécurité
- **Helmet** - Protection des en-têtes HTTP
- **CORS** - Gestion des origines croisées
- **express-validator** - Validation des données

### Outils de Développement
- **Nodemon** - Rechargement automatique
- **dotenv** - Gestion des variables d'environnement
- **Morgan** - Logging des requêtes HTTP

## 📦 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/tahaely/podium.git
cd podium
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
PORT=5000
NODE_ENV=development

# Frontend URL (pour CORS)
FRONTEND_URL=https://poduim-front-end.vercel.app

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gamification_db

# Secret JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Chemin des uploads
UPLOAD_PATH=src/uploads
```

4. **Initialiser la base de données**
```bash
npm run db:init
```

5. **Démarrer le serveur**

**Mode développement** (avec rechargement automatique) :
```bash
npm run dev
```

**Mode production** :
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## 📁 Structure du Projet

```
podium/
├── src/
│   ├── config/
│   │   ├── db.js              # Configuration de la base de données
│   │   ├── schema.sql         # Schéma de la base de données
│   │   └── socket.js          # Configuration WebSocket
│   ├── controllers/
│   │   ├── authController.js  # Contrôleur d'authentification
│   │   ├── teamController.js  # Contrôleur des équipes
│   │   ├── memberController.js # Contrôleur des membres
│   │   ├── taskController.js  # Contrôleur des tâches
│   │   └── leaderboardController.js # Contrôleur du classement
│   ├── services/
│   │   ├── authService.js     # Logique métier authentification
│   │   ├── teamService.js     # Logique métier équipes
│   │   ├── memberService.js   # Logique métier membres
│   │   ├── taskService.js     # Logique métier tâches
│   │   ├── scoringService.js  # Logique métier points
│   │   └── leaderboardService.js # Logique métier classement
│   ├── routes/
│   │   ├── authRoutes.js      # Routes d'authentification
│   │   ├── teamRoutes.js      # Routes des équipes
│   │   ├── memberRoutes.js    # Routes des membres
│   │   ├── taskRoutes.js      # Routes des tâches
│   │   └── leaderboardRoutes.js # Routes du classement
│   ├── middleware/
│   │   └── authMiddleware.js  # Middleware d'authentification
│   ├── scripts/
│   │   └── initDb.js          # Script d'initialisation DB
│   ├── uploads/               # Dossier des fichiers uploadés
│   ├── app.js                 # Configuration de l'application
│   └── index.js               # Point d'entrée du serveur
├── .env                       # Variables d'environnement
├── package.json               # Dépendances et scripts
└── README.md                  # Documentation

```

## 🔌 API Endpoints

### Authentification (`/api/auth`)
- `POST /register` - Inscription d'un nouvel utilisateur
- `POST /login` - Connexion d'un utilisateur
- `GET /users` - Liste de tous les utilisateurs (protégé)

### Équipes (`/api/teams`)
- `GET /` - Obtenir toutes les équipes
- `GET /:id` - Obtenir une équipe par ID
- `POST /` - Créer une nouvelle équipe (protégé)
- `PUT /:id` - Modifier une équipe (protégé)
- `DELETE /:id` - Supprimer une équipe (protégé)

### Membres (`/api/members`)
- `GET /` - Obtenir tous les membres
- `GET /:id` - Obtenir un membre par ID
- `POST /` - Ajouter un membre (protégé)
- `PUT /:id` - Modifier un membre (protégé)
- `DELETE /:id` - Supprimer un membre (protégé)

### Tâches (`/api/tasks`)
- `GET /` - Obtenir toutes les tâches (avec filtres)
- `POST /` - Créer une nouvelle tâche (protégé)
- `PUT /:id` - Modifier une tâche (protégé)
- `POST /:id/proof` - Uploader une preuve (protégé)
- `POST /:id/validate` - Valider une tâche (protégé)

### Classement (`/api/leaderboard`)
- `GET /` - Obtenir le classement
- `GET /?period=daily` - Classement quotidien
- `GET /?period=weekly` - Classement hebdomadaire

## 🔒 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Pour accéder aux routes protégées :

1. Connectez-vous via `/api/auth/login`
2. Récupérez le token dans la réponse
3. Incluez le token dans l'en-tête de vos requêtes :

```
Authorization: Bearer <votre_token>
```

## 🌐 WebSocket

Le serveur WebSocket diffuse les mises à jour en temps réel :

- Validation de tâches
- Mise à jour des scores
- Badges de série

Connexion WebSocket : `ws://localhost:5000`

## 🗄️ Base de Données

### Tables Principales

#### `users`
- Gestion des utilisateurs et authentification
- Rôles : admin, member

#### `teams`
- Informations sur les équipes
- Nom, couleur, date de création

#### `members`
- Membres des équipes
- Lien avec les utilisateurs
- Rôles au sein de l'équipe

#### `tasks`
- Tâches assignées aux équipes/membres
- Statuts, difficultés, priorités
- Points et preuves

#### `points_log`
- Historique complet des points
- Raisons d'attribution
- Lien avec tâches et membres

## 🚀 Déploiement

### Déploiement sur Railway

1. Créer un compte sur [Railway](https://railway.app)
2. Créer un nouveau projet
3. Ajouter une base de données MySQL
4. Configurer les variables d'environnement
5. Déployer depuis GitHub

### Déploiement sur Render

1. Créer un compte sur [Render](https://render.com)
2. Créer un nouveau Web Service
3. Connecter votre dépôt GitHub
4. Configurer les variables d'environnement
5. Déployer

## 🧪 Tests

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer le serveur en développement
- `npm run db:init` - Initialiser la base de données
- `npm test` - Lancer les tests

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 👨‍💻 Auteur

**Taha Ely**

## 🙏 Remerciements

- Express.js pour le framework web
- MySQL pour la base de données
- La communauté Node.js

---

**Note** : Ce projet est en développement actif. N'hésitez pas à signaler les bugs ou à proposer des améliorations !
