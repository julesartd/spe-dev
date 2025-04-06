# 🛒 E-Commerce App

Ce projet est une application web e-commerce développée avec **Express.js** pour le backend et **JavaScript Vanilla avec Vite** pour le frontend. Elle inclut un système d'authentification, la gestion des produits, un panier interactif et un tableau de bord utilisateur.

## 🚀 Fonctionnalités

### Frontend
- Navigation SPA via `router.js`
- Authentification JWT (connexion, inscription)
- Ajout, édition et affichage de produits
- Vue détaillée des produits
- Panier client local interactif
- Système de sécurité CSP avec rapport automatique
- Tableau de bord utilisateur (routes protégées)
- Synchronisation du panier à la connexion

### Backend
- API RESTful avec Express
- Authentification JWT
- Gestion des produits (CRUD)
- Gestion du panier
- Récupération des statistiques de produits
- Enregistrement des rapports de violation CSP
- Middleware CSRF personnalisé
- Middleware de gestion d’erreurs JSON

## 🔧 Installation & Initialisation

1. Cloner le dépôt :

```bash
git clone https://github.com/julesartd/spe-dev.git
```

2. Lancer le backend :

```bash
cd api-backend
npm install
npm start
node faker.js
```

Le fichier faker.js permet d'insérer des données dans la base de donnée.

3. Lancer le frontend :

```bash
cd front-end
npm install
npm run dev
```

## ⚙️ Configuration des fichiers `.env`

### Pour le frontend (`front-end/.env`)
```env
VITE_API_URL=http://localhost:5000
```

### Pour le backend (`api-backend/.env`)
```env
JWT_SECRET_KEY=votre_clé_secrète
```

## 📡 API

- `POST /api/auth/register` – Enregistrement utilisateur
- `POST /api/auth/login` – Connexion utilisateur
- `GET /api/products` – Liste des produits
- `GET /api/products/:id` – Détail d’un produit
- `GET /api/products/byUser/:id` – Liste des produits par utilisateur
- `POST /api/products` – Ajout d’un produit
- `PUT /api/products/:id` – Modification d’un produit
- `DELETE /api/products/:id` – Suppression d’un produit
- `POST /api/cart` – Ajouter un produit au panier
- `GET /api/cart` – Récupérer le panier
- `GET /api/stats` – Statistiques produits par catégorie
- `POST /api/csp-violation-report` – Enregistrement d’un rapport CSP
- `GET /api/csrf-token` – Récupération du token CSRF

## 🔐 Sécurité

- Jetons JWT stockés côté client (dans `localStorage`)
- Middleware CSRF avec récupération de token via `/api/csrf-token`
- Middleware CORS
- Rapport automatique de violation de politique CSP via l'API


## Test Backend
### Lancer les tests

```bash
cd api-backend
npm run test
```

## Test Frontend
### Lancer les tests

```bash
cd front-end
npm run test:e2e
```


## 📦 Dépendances principales

### Backend
- `express`
- `sequelize`
- `jsonwebtoken`
- `cookie-parser`
- `dotenv`

### Frontend
- `vite`
- JavaScript Vanilla avec modules ES
- Gestion d’état via `localStorage` pour le panier et le token

---

## 👨‍💻 Auteurs

Projet développé par ARTAUD Jules et LEVASSEUR Kilian

---

## 📝 Licence

Ce projet est sous licence MIT.
