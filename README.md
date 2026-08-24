# Guide d'installation — Exam Hub

Ce guide décrit les étapes nécessaires pour installer et lancer le projet en local.

## Prérequis

- Node.js et npm installés
- PostgreSQL installé et accessible (utilisateur `postgres`)
- Un terminal ouvert à la **racine du projet**

## 1. Configuration de l'environnement

Copiez le fichier d'exemple et complétez les variables nécessaires :

```bash
cp .env.example .env
```

Ouvrez ensuite `.env` et remplissez tous les champs requis (base de données, port, secrets, etc.).

### Générer le `JWT_SECRET`

Dans le terminal, exécutez :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez la valeur générée et collez-la comme valeur de `JWT_SECRET` dans `.env`.

## 2. Installation des dépendances

À la racine du projet :

```bash
npm install
```

## 3. Création de la base de données

Toujours à la racine du projet, exécutez le script de migration :

```bash
psql -U postgres -d exam_hub -f database/migrations/001_init_schema.sql
```

> Assurez-vous que la base `exam_hub` existe déjà dans PostgreSQL avant de lancer cette commande, sinon créez-la au préalable.

## 4. Seed de la base de données

```bash
npm run seed
```

Un message de confirmation doit s'afficher, du type : *« Admin créé »* avec l'email et le mot de passe de l'administrateur généré. Notez ces identifiants.

## 5. Lancement du serveur

```bash
npm run dev
```

Le serveur doit démarrer sans erreur.

## 6. Vérification

Dans un **second terminal** (ou via Postman / navigateur), testez la route de santé :

```bash
curl http://localhost:3000/health
```

Vous devriez obtenir une réponse avec un code de statut **200**.

### En cas de problème

Si le statut n'est pas 200 :

1. Vérifiez que votre projet est à jour :
   ```bash
   git pull
   ```
2. Relancez `npm install` si des dépendances ont changé.
3. Vérifiez que toutes les variables du `.env` sont correctement renseignées.

---

*Une installation fonctionnelle a déjà été testée avec succès par l'auteur de ce projet.*