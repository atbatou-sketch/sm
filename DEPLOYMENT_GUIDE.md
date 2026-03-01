# Deployment Guide - Vercel

## Pre-Deployment Checklist

- [x] Code compilé sans erreurs
- [x] APIs testées localement
- [x] Configuration vercel.json créée
- [x] Code poussé vers GitHub main branch
- [x] vercel.json configuré pour serverless

## Étapes de Déploiement sur Vercel

### 1. Préparation

Le projet est prêt pour Vercel. La structure suivante a été configurée:

```
vercel.json
├── buildCommand: "npm run build"
├── devCommand: "npm run dev"
├── installCommand: "npm install"
└── framework: "nextjs"
```

### 2. Déploiement via Web UI (Recommandé)

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur "Add New..." → "Project"
3. Importer le repository: `https://github.com/atbatou-sketch/sm.git`
4. Vercel auto-détectera les paramètres Next.js
5. Cliquer "Deploy"

### 3. Déploiement via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Naviguer vers le projet
cd student-management

# Déployer
vercel
```

### 4. Configuration Environment Variables (si nécessaire)

Dans Vercel Dashboard → Project Settings → Environment Variables, ajouter:
- `NODE_ENV=production` (optionnel)

## Notes Importantes sur Vercel Serverless

⚠️ **Limitation Importante**: Sur Vercel (architecture serverless), les données JSON stockées dans `/data` ne persisteront que pendant l'exécution d'une fonction. Les données disparaîtront après quelques secondes d'inactivité.

### Solutions pour Persistent Storage en Production:

#### Option 1: Supabase PostgreSQL (Recommandé)
```bash
npm install @supabase/supabase-js
```

#### Option 2: MongoDB Atlas
```bash
npm install mongodb
```

#### Option 3: FaunaDB
```bash
npm install faunadb
```

#### Option 4: Firebase Firestore
```bash
npm install firebase
```

## API Endpoints en Production

Une fois déployé sur Vercel, les endpoints seront accessibles via:

```
https://votre-projet.vercel.app/api/students
https://votre-projet.vercel.app/api/auth
```

## Testing POST-DEPLOYMENT

```bash
# Créer un étudiant
curl -X POST https://votre-projet.vercel.app/api/students \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@vercel.test"}'

# Lister les étudiants
curl https://votre-projet.vercel.app/api/students
```

## Monitoring et Debugging

- Vercel Logs: Dashboard → Project → Deployments → Logs
- Function Logs: Dashboard → Functions
- Real-time monitoring: Dashboard → Analytics

## Rollback

```bash
# Rédeployer une version précédente
vercel rollback
```

## Références

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
