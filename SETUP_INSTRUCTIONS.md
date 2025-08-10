# 🚀 Instructions de Configuration - LectureVerse

## ⚠️ ÉTAPES CRITIQUES À SUIVRE

### 1. 📝 Configuration Supabase (OBLIGATOIRE)

#### A. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Cliquez sur "New Project"
4. Nommez votre projet : `lectureverse`
5. Créez un mot de passe fort
6. Choisissez une région proche
7. Cliquez sur "Create new project"

#### B. Récupérer les clés API
1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez ces informations :
   - **Project URL** (commence par https://...)
   - **anon public key** (commence par eyJ...)

#### C. Configurer les variables d'environnement
1. Ouvrez le fichier `.env` créé
2. Remplacez les valeurs par vos vraies clés :
```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-vraie-anon-key
```

### 2. 🗄️ Créer la base de données

#### A. Exécuter le script SQL
1. Dans Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu du fichier `supabase/migrations/create_initial_schema.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur "Run" pour exécuter

#### B. Configurer l'authentification
1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Dans **Site URL**, mettez : `http://localhost:5173`
3. Dans **Redirect URLs**, ajoutez : `http://localhost:5173/**`
4. **IMPORTANT** : Désactivez "Enable email confirmations" pour le développement

### 3. 📁 Configurer le stockage (Storage)

#### A. Créer les buckets
1. Dans Supabase, allez dans **Storage**
2. Créez ces buckets :
   - `book-covers` (public)
   - `book-files` (privé)
   - `audio-files` (privé)

#### B. Configurer les politiques de stockage
Exécutez ce SQL dans l'éditeur :

```sql
-- Policies pour book-covers (public)
CREATE POLICY "Anyone can view book covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can upload covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'book-covers' AND auth.role() = 'authenticated');

-- Policies pour book-files (privé)
CREATE POLICY "Users can view purchased books" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'book-files' AND
    EXISTS (
      SELECT 1 FROM public.purchases p
      JOIN public.books b ON p.book_id = b.id
      WHERE p.user_id = auth.uid()
      AND storage.filename(name) LIKE b.id || '%'
    )
  );

CREATE POLICY "Writers can upload book files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'book-files' AND auth.role() = 'authenticated');

-- Policies pour audio-files
CREATE POLICY "Users can view purchased audio" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-files' AND
    EXISTS (
      SELECT 1 FROM public.purchases p
      JOIN public.books b ON p.book_id = b.id
      WHERE p.user_id = auth.uid()
      AND storage.filename(name) LIKE b.id || '%'
    )
  );

CREATE POLICY "Writers can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');
```

### 4. 🧪 Tester la configuration

#### A. Démarrer l'application
```bash
npm run dev
```

#### B. Tests à effectuer
1. **Inscription** : Créez un compte
2. **Connexion** : Connectez-vous
3. **Navigation** : Testez les différentes pages
4. **Catalogue** : Vérifiez que les livres s'affichent (vide au début)

### 5. 🎯 Prochaines étapes

Une fois la configuration de base terminée :

1. **Ajouter des livres de test** via l'interface d'upload
2. **Tester les fonctionnalités** (wishlist, lecture, etc.)
3. **Configurer Stripe** pour les paiements réels
4. **Optimiser les performances**

## 🆘 Dépannage

### Erreurs communes

#### "Supabase not configured"
- Vérifiez que le fichier `.env` contient les bonnes valeurs
- Redémarrez le serveur de développement

#### "relation does not exist"
- Assurez-vous d'avoir exécuté le script SQL complet
- Vérifiez dans Supabase > Table Editor que les tables sont créées

#### Erreurs d'authentification
- Vérifiez les URLs de redirection dans Supabase
- Assurez-vous que l'email confirmation est désactivée

### Logs utiles
- Console du navigateur (F12)
- Onglet Network pour voir les requêtes API
- Logs Supabase dans le dashboard

## ✅ Checklist de validation

- [ ] Projet Supabase créé
- [ ] Variables d'environnement configurées
- [ ] Script SQL exécuté avec succès
- [ ] Tables visibles dans Supabase
- [ ] Buckets de stockage créés
- [ ] Application démarre sans erreur
- [ ] Inscription/connexion fonctionne
- [ ] Navigation entre les pages OK

Une fois cette checklist complète, votre application sera fonctionnelle !