# Guide de Configuration Supabase - Simplifié

## C'est quoi RLS et les Policies ?

**RLS (Row Level Security)** = Système de sécurité qui contrôle qui peut lire/modifier quelles lignes dans votre base de données.

**Pour votre projet** : Comme vous êtes seul à utiliser l'application (pas de système de login), **vous n'avez PAS besoin de RLS** ! On va le désactiver pour simplifier.

---

## Configuration Supabase - Étape par Étape

### Étape 1 : Accéder à l'éditeur SQL

1. Allez sur https://supabase.com/dashboard/project/dbimynqqxevwptciyuly
2. Dans le menu de gauche, cliquez sur **"SQL Editor"**
3. Cliquez sur **"New Query"**

### Étape 2 : Copier-Coller le Script

1. Ouvrez le fichier `supabase-schema.sql` (celui dans votre projet)
2. **Copiez TOUT le contenu** (Ctrl+A puis Ctrl+C)
3. **Collez** dans l'éditeur SQL de Supabase (Ctrl+V)
4. Cliquez sur le bouton **"Run"** (en bas à droite)

### Étape 3 : Désactiver RLS (important !)

Après avoir exécuté le script, vous devez désactiver RLS sur toutes les tables :

1. Restez dans **"SQL Editor"**
2. Créez une **nouvelle query**
3. Copiez-collez ce code :

```sql
-- Désactiver RLS sur toutes les tables
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE expense_budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
```

4. Cliquez sur **"Run"**

### Étape 4 : Vérifier que ça marche

1. Dans le menu de gauche, cliquez sur **"Table Editor"**
2. Vous devriez voir vos tables : `transactions`, `budget_goals`, etc.
3. Cliquez sur `transactions` → vous devriez voir 6 transactions d'exemple

---

## Créer le fichier .env.local

1. Dans Visual Studio Code, à la **racine du projet**, créez un nouveau fichier
2. Appelez-le exactement : `.env.local`
3. Collez ce contenu :

```
NEXT_PUBLIC_SUPABASE_URL=https://dbimynqqxevwptciyuly.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_wuVvedXRpF3Ws7dMWmqvxQ_IgjhWAcU
SUPABASE_SERVICE_ROLE_KEY=sb_secret_pIHPBbdOoQjXbB_Rcixuxw_nxuiUHfG
```

4. Sauvegardez le fichier (Ctrl+S)

---

## Redémarrer l'Application

Dans le terminal où tourne `npm run dev` :

1. Appuyez sur **Ctrl+C** pour arrêter le serveur
2. Tapez : `npm run dev` et appuyez sur Entrée
3. Attendez que ça compile
4. Ouvrez http://localhost:3000

---

## ✅ Comment savoir si ça marche ?

Quand vous ouvrez l'application :
- Le Dashboard devrait afficher vos transactions
- Les "Monthly Targets" devraient être visibles
- Cliquez sur "Add Income" → remplissez le formulaire → Submit
- La nouvelle transaction devrait apparaître dans la liste !

---

## ❌ Si ça ne marche pas

**Erreur "Invalid API key"** :
- Vérifiez que `.env.local` est bien à la racine du projet
- Vérifiez qu'il n'y a pas d'espace avant/après les valeurs
- Redémarrez le serveur (`Ctrl+C` puis `npm run dev`)

**Erreur "Failed to fetch"** :
- Vérifiez que vous avez bien désactivé RLS (Étape 3)
- Vérifiez que les tables existent dans Supabase (Table Editor)

**Rien ne s'affiche** :
- Ouvrez la console du navigateur (F12)
- Regardez s'il y a des erreurs en rouge
- Envoyez-moi le message d'erreur

---

## 🎯 Besoin d'aide supplémentaire ?

Si vous êtes bloqué à une étape, dites-moi exactement où et je vous aiderai !
