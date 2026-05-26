# IFT3225 - Infrastructure de collecte d’ambiance

API Express/MongoDB permettant de collecter, authentifier, persister et consulter des données d’ambiance en quasi temps réel à partir de capteurs et d’observations environnementales.

---

## Équipe

Projet réalisé par :

- Wendkuni Reine Rosine Guinguiere
- Meriem Ghaoui
- Samah Tanisha Islam

---

## Description

Ce projet implémente une infrastructure de collecte de données d’ambiance basée sur :

- un serveur Express.js ;
- une base de données MongoDB Atlas ;
- des données collectées via Phyphox ;
- des observations environnementales ajoutées automatiquement ou manuellement.

L’objectif est de rendre les données interrogeables via une API REST et de produire des endpoints sémantiques permettant d’analyser l’ambiance d’un lieu en quasi temps réel.

---

## Technologies utilisées

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Phyphox
- Postman

---

## Structure du projet

```txt
ift3225-livrable1-ambiance-api/
│
├── README.md
├── .env.example
├── package.json
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed/
│   ├── app.js
│   └── server.js
│
├── bridge/
│   └── phyphoxBridge.js
│
├── postman/
│   └── collection.json
│
└── docs/
    └── protocole.md
```

---

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir :

- Node.js installé
- un cluster MongoDB Atlas configuré
- l’application Phyphox
- Postman

---

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/VOTRE-ORGANISATION/ift3225-livrable1-ambiance-api.git
cd ift3225-livrable1-ambiance-api
```

### Installer les dépendances

```bash
npm install
```

### Créer le fichier `.env`

```bash
cp .env.example .env
```

### Variables d’environnement

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

### Lancer le serveur

```bash
npm run dev
```

---

# Variables d’environnement

Créer un fichier `.env` à partir du fichier `.env.example`.

Exemple :

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

---

## Endpoints principaux

### Devices

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/devices` | Créer un device et générer une clé API | Non |
| GET | `/devices` | Lister les devices enregistrés | Non |

### Measurements

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/measurements` | Ajouter une mesure capteur | Oui |

### Observations

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/observations` | Ajouter une observation environnementale | Oui |

### Ambiance

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/ambiance/:location/history` | Consulter l’historique d’ambiance | Non |
| GET | `/ambiance/:location/quiet-hours` | Identifier les heures calmes | Non |
| GET | `/ambiance/:location/summary` | Obtenir un résumé global d’ambiance | Non |

---

## Authentification

Les endpoints d’écriture (`POST`) sont protégés par une clé API.

Le client doit envoyer un header :

```http
x-api-key: YOUR_API_KEY
```

### Réponses possibles

| Code | Signification |
|---|---|
| 401 | Clé API absente |
| 403 | Clé API invalide |
| 200/201 | Requête autorisée |

---

## Pipeline de collecte

Le pipeline suit l’architecture suivante :

```txt
Phyphox → Bridge de collecte → API Express → MongoDB Atlas
```

Le bridge interroge périodiquement les capteurs puis envoie les données au serveur via des requêtes HTTP POST.

---

# Données collectées

## Données capteurs

- amplitude audio ;
- niveau sonore ambiant ;
- timestamp de mesure.

## Données environnementales

- humeur/vibe générale ;
- proximité de la source de bruit ;
- notes contextuelles ;
- jour et heure.

---

## Données de démonstration (Seed)

Le projet inclut des données de démonstration afin de tester rapidement les endpoints sans effectuer une collecte complète.

Exécuter :

```bash
npm run seed
```

---

## Tests avec Postman

Une collection Postman est disponible dans :

```txt
/postman/collection.json
```

Elle permet de tester rapidement tous les endpoints du projet.

---

## Sécurité

Les endpoints de lecture (`GET`) sont publics.

Les endpoints d’écriture (`POST`) nécessitent une clé API associée à un device enregistré.

En phase 1, l’endpoint `POST /devices` n’est volontairement pas protégé. Cette vulnérabilité est documentée dans le rapport.

---

## Auteurs

Projet réalisé dans le cadre du cours IFT3225.
