# Guide de Déploiement : GitHub & Vercel

Ce guide détaille les étapes et commandes pour héberger votre code sur GitHub et déployer votre application sur Vercel.

## Partie 1 : Envoyer le code sur GitHub

L'objectif est de créer un "repository" (dépôt) distant sur GitHub et d'y envoyer votre code local.

### Prérequis
- Avoir un compte [GitHub](https://github.com).
- Avoir `git` installé sur votre machine (c'est généralement le cas).

### Étapes et Commandes

1.  **Initialiser Git (si ce n'est pas déjà fait)**
    Si votre projet n'est pas encore suivi par git, lancez cette commande à la racine du projet :
    ```bash
    git init
    ```
    *Cela crée un dossier caché `.git` qui va suivre les changements de vos fichiers.*

2.  **Ajouter les fichiers**
    Préparez tous vos fichiers pour être "commit" (enregistrés) :
    ```bash
    git add .
    ```
    *Le `.` signifie "tous les fichiers du dossier courant".*

3.  **Créer le premier commit**
    Enregistrez l'état actuel de vos fichiers :
    ```bash
    git commit -m "Initial commit: Finance Tracker App"
    ```
    *`-m` permet d'ajouter un message décrivant les changements.*

4.  **Créer le repository sur GitHub**
    - Allez sur [github.com/new](https://github.com/new).
    - Donnez un nom à votre repository (ex: `finance-tracker`).
    - Laissez-le en "Public" ou "Private" selon votre choix.
    - **Ne cochez pas** "Add a README file" ou ".gitignore" (vous avez déjà votre code local).
    - Cliquez sur **Create repository**.

5.  **Lier votre code local au repository GitHub**
    GitHub vous affichera des commandes. Copiez celle qui ressemble à ceci (remplacez l'URL par la vôtre) :
    ```bash
    git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/finance-tracker.git
    ```
    *Cela dit à votre git local : "Quand je parle de 'origin', je parle de cette adresse sur GitHub".*

6.  **Envoyer le code (Push)**
    ```bash
    git push -u origin main
    ```
    *Envoie votre code vers la branche `main` du repository `origin`. Vous devrez peut-être vous authentifier.*

---

## Partie 2 : Déployer sur Vercel

Vercel est la plateforme recommandée pour Next.js. La méthode la plus robuste est de connecter Vercel à votre repository GitHub. Ainsi, chaque fois que vous ferez un `git push`, Vercel mettra à jour votre site automatiquement.

### Prérequis
- Avoir un compte [Vercel](https://vercel.com).

### Méthode Recommandée (Via le Dashboard Web)

1.  Allez sur le [Dashboard Vercel](https://vercel.com/dashboard).
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Sélectionnez **"Continue with GitHub"**.
4.  Trouvez votre repository `finance-tracker` dans la liste et cliquez sur **"Import"**.
5.  **Configuration du projet** :
    - **Framework Preset** : Next.js (détecté automatiquement).
    - **Root Directory** : `./` (par défaut).
    - **Environment Variables** : **C'est ici qu'il faut être vigilant !**
      Vous devez ajouter les variables de votre fichier `.env.local` :
      - `NEXT_PUBLIC_SUPABASE_URL` : (Votre URL Supabase)
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : (Votre clé Anon Supabase)
6.  Cliquez sur **"Deploy"**.

Vercel va construire votre application. Si tout se passe bien, vous aurez une URL du type `finance-tracker.vercel.app`.

### Méthode Alternative (Via Ligne de Commande)

Si vous préférez tout faire depuis le terminal sans passer par GitHub (moins recommandé pour la maintenance) :

1.  **Installer Vercel CLI**
    ```bash
    npm i -g vercel
    ```

2.  **Déployer**
    ```bash
    vercel
    ```
    - Il vous demandera de vous connecter.
    - Répondez aux questions (Y/N) pour configurer le projet.
    - Pour déployer en production (pas juste un test), utilisez :
    ```bash
    vercel --prod
    ```

### Résumé du flux de travail idéal

1.  Vous faites des modifications de code localement.
2.  Vous testez (`npm run dev`).
3.  Vous validez :
    ```bash
    git add .
    git commit -m "Description des changements"
    git push
    ```
4.  Vercel détecte le `push` sur GitHub et redéploie automatiquement votre site.
