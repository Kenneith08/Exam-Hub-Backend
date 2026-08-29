# Guide d'installation — Exam Hub (Backend)

Ce guide décrit les étapes nécessaires pour installer et lancer l'API en local.

## Prérequis

- Node.js et npm installés
- Docker et Docker Compose installés (méthode recommandée pour la base de données)
- Un terminal ouvert à la **racine de ce dépôt**

> Vous n'avez pas Docker ? Voir la section [Alternative sans Docker](#alternative-sans-docker) plus bas.

## 1. Configuration de l'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Les valeurs par défaut de `.env.example` correspondent déjà à `docker-compose.yml` (utilisateur `exam_hub_user`, base `exam_hub`) : vous n'avez rien à changer pour la base de données si vous utilisez Docker.

### Générer le `JWT_SECRET`

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez la valeur générée dans `.env`, à la place de `change_me` pour `JWT_SECRET`.

## 2. Installation des dépendances

```bash
npm install
```

## 3. Démarrer la base de données (Docker)

```bash
docker compose up -d
```

Ça démarre un conteneur PostgreSQL et **crée automatiquement la base `exam_hub`** (grâce à `POSTGRES_DB` dans `docker-compose.yml`) — vous n'avez rien d'autre à faire à cette étape.

## 4. Exécuter le schéma (les tables)

```bash
docker compose exec -T db psql -U exam_hub_user -d exam_hub -f - < database/migrations/001_init_schema.sql

## On peut aussi faire : 
npm run seed    #(Si on veut juste avoir l'admin de base)
npm run seed:demo  #(Si on veut aussi des etudiants fictifs)
```

Vous devez voir une série de `CREATE TABLE`, `CREATE INDEX`, etc. sans erreur.

## 5. Seed de la base de données

```bash
npm run seed
```

Un message doit s'afficher avec l'email et le mot de passe de l'administrateur généré. **Notez ces identifiants**, vous en aurez besoin pour vous connecter.

## 6. Lancement du serveur

```bash
npm run dev
```

Le serveur doit démarrer sans erreur, sur `http://localhost:3000` (ou le `PORT` que vous avez défini dans `.env`).

## 7. Vérification

Dans un **second terminal** :

```bash
curl http://localhost:3000/health
```

Vous devriez obtenir `{"status":"ok"}`.

### En cas de problème

1. Vérifiez que le conteneur tourne : `docker compose ps` (statut `healthy`).
2. Vérifiez que toutes les variables du `.env` sont renseignées, en particulier `JWT_SECRET`.
3. Si `npm run seed` échoue avec une erreur `3D0000` / "database does not exist", l'étape 3 (Docker) n'a pas été faite ou a échoué — relancez `docker compose up -d` et vérifiez les logs avec `docker compose logs db`.

---

## Alternative sans Docker

Si vous préférez utiliser un PostgreSQL déjà installé sur votre machine :

1. Dans `.env`, adaptez `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` pour qu'ils correspondent à **votre** installation locale (souvent l'utilisateur `postgres`).
2. Créez la base vous-même, elle n'existe pas par défaut :
   ```bash
   psql -U postgres -c "CREATE DATABASE exam_hub;"
   ```
3. Exécutez le schéma :
   ```bash
   psql -U postgres -d exam_hub -f database/migrations/001_init_schema.sql
   ```
4. Reprenez à l'étape 5 (seed) ci-dessus.
