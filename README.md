# Student Management System

Une application complète de gestion des étudiants construite avec [Next.js](https://nextjs.org/), [React](https://react.dev/), et [Tailwind CSS](https://tailwindcss.com/).

## Fonctionnalités

- ✅ **Gestion des étudiants** : Créer, lire, mettre à jour et supprimer des étudiants
- ✅ **API REST complète** : GET, POST, PUT, DELETE pour les opérations CRUD
- ✅ **Interface utilisateur réactive** : Construite avec React et Tailwind CSS
- ✅ **Stockage des données** : Système de fichiers JSON pour la persistance des données
- ✅ **Authentification** : Support NextAuth pour la gestion des sessions (prêt pour intégration)

## Structure du Projet

```
student-management/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── students/    # API routes pour les étudiants
│   │   │   └── auth/        # Routes d'authentification
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Page d'accueil
│   │   └── globals.css      # Styles globaux
│   ├── components/
│   │   ├── StudentForm.tsx  # Formulaire d'ajout d'étudiant
│   │   └── StudentList.tsx  # Liste des étudiants
│   └── lib/
│       ├── db.ts           # Gestion de la base de données
│       └── types.ts        # Types TypeScript
├── public/                  # Fichiers statiques
├── data/                    # Données persistées (JSON)
├── package.json
└── tsconfig.json
```

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/atbatou-sketch/sm.git
cd student-management

# Installer les dépendances
npm install

# Compiler le projet
npm run build

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible à `http://localhost:3000`

## Utilisation de l'API

### Créer un étudiant
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "date_of_birth": "2000-01-01"
  }'
```

### Obtenir tous les étudiants
```bash
curl http://localhost:3000/api/students
```

### Obtenir un étudiant spécifique
```bash
curl http://localhost:3000/api/students?id=1
```

### Mettre à jour un étudiant
```bash
curl -X PUT http://localhost:3000/api/students?id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "status": "inactive"
  }'
```

### Supprimer un étudiant
```bash
curl -X DELETE http://localhost:3000/api/students?id=1
```

## Déploiement sur Vercel

### Méthode 1 : Interface Vercel (Recommandée)

1. Allez sur [Vercel](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez ce repo GitHub : `https://github.com/atbatou-sketch/sm.git`
4. Vercel détectera automatiquement les paramètres Next.js
5. Cliquez sur "Deploy"

### Méthode 2 : CLI Vercel

```bash
npm install -g vercel
vercel
```

### Notes Importantes

- ⚠️ **Stockage des données** : En développement, les données sont stockées dans `data/students.json`. Sur Vercel (serverless), les données persistent uniquement en mémoire pendant l'exécution de chaque fonction. Pour une persistance permanente en production, intégrez une base de données cloud (Supabase PostgreSQL, MongoDB, FaunaDB, etc.)

- **Configuration recommandée pour production** :
  - Remplacez le système de fichiers par une API de base de données
  - Utilisez des variables d'environnement pour les credentials
  - Implémentez NextAuth avec OAuth pour l'authentification

## Technologies Utilisées

- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **TypeScript** - Type-safety
- **Tailwind CSS** - Styles utility-first
- **Axios** - Client HTTP
- **NextAuth** - Authentification (prêt pour intégration)

## Licence

MIT

## Auteur

- **Email** : a.tbatou@esisa.ac.ma
- **GitHub** : [atbatou-sketch](https://github.com/atbatou-sketch)
