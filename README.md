# LectureVerse - Guide d'installation locale

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Un compte Supabase (gratuit)

## 🚀 Installation

### 1. Cloner et installer les dépendances

```bash
# Cloner le projet
git clone <votre-repo-url>
cd digital-book-platform

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd backend
npm install
cd ..
```

### 2. Configuration Supabase

#### A. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez votre organisation
5. Donnez un nom à votre projet (ex: "lectureverse")
6. Créez un mot de passe pour la base de données
7. Choisissez une région proche de vous
8. Cliquez sur "Create new project"

#### B. Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez ces informations :
   - **Project URL** (commence par https://...)
   - **anon public key** (commence par eyJ...)
   - **service_role key** (commence par eyJ...)

### 3. Configuration des variables d'environnement

#### Frontend (.env)
```bash
# Créer le fichier .env à la racine du projet
cp .env.example .env
```

Modifier le fichier `.env` :
```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

#### Backend (backend/.env)
```bash
# Créer le fichier backend/.env
cp backend/.env.example backend/.env
```

Modifier le fichier `backend/.env` :
```env
# Server settings
PORT=5000
NODE_ENV=development

# Supabase settings
SUPABASE_URL=https://votre-project-id.supabase.co
SUPABASE_ANON_KEY=votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key

# JWT settings (utiliser la même clé que Supabase)
JWT_SECRET=votre-jwt-secret-supabase

# File storage settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50000000

# API URL for client
CLIENT_URL=http://localhost:3000
```

### 4. Créer la base de données

#### A. Schéma de base de données

Dans Supabase, allez dans **SQL Editor** et exécutez ce script :

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('reader', 'writer', 'admin')) DEFAULT 'reader',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('ebook', 'audio', 'both')) NOT NULL,
  cover TEXT,
  file_url TEXT,
  audio_url TEXT,
  sample_url TEXT,
  audio_sample_url TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book_categories junction table
CREATE TABLE IF NOT EXISTS public.book_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(book_id, category_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  book_id UUID REFERENCES public.books(id) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_intent_id TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Create reading_progress table
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  book_id UUID REFERENCES public.books(id) NOT NULL,
  last_position INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Insert default categories
INSERT INTO public.categories (name) VALUES 
  ('Fiction'),
  ('Non-Fiction'),
  ('Science Fiction'),
  ('Fantasy'),
  ('Mystery'),
  ('Thriller'),
  ('Romance'),
  ('Horror'),
  ('Biography'),
  ('History'),
  ('Self-Help'),
  ('Business'),
  ('Computer Science'),
  ('Programming'),
  ('Science'),
  ('Philosophy'),
  ('Psychology'),
  ('Art'),
  ('Cooking'),
  ('Travel')
ON CONFLICT (name) DO NOTHING;
```

#### B. Configurer Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Books policies
CREATE POLICY "Anyone can view published books" ON public.books
  FOR SELECT USING (true);

CREATE POLICY "Writers can insert own books" ON public.books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Writers can update own books" ON public.books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Writers can delete own books" ON public.books
  FOR DELETE USING (auth.uid() = user_id);

-- Categories policies (read-only for most users)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Book categories policies
CREATE POLICY "Anyone can view book categories" ON public.book_categories
  FOR SELECT USING (true);

CREATE POLICY "Book owners can manage categories" ON public.book_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.books 
      WHERE books.id = book_categories.book_id 
      AND books.user_id = auth.uid()
    )
  );

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases" ON public.purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can manage own reading progress" ON public.reading_progress
  FOR ALL USING (auth.uid() = user_id);
```

#### C. Configurer l'authentification

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Désactivez "Enable email confirmations" pour le développement
3. Dans **URL Configuration**, ajoutez :
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/**`

### 5. Configuration du stockage (Storage)

```sql
-- Créer les buckets pour les fichiers
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('book-covers', 'book-covers', true),
  ('book-files', 'book-files', false),
  ('audio-files', 'audio-files', false);

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

-- Policies similaires pour audio-files
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

### 6. Lancer l'application

#### Terminal 1 - Frontend
```bash
npm run dev
```

#### Terminal 2 - Backend (optionnel si vous utilisez Supabase)
```bash
cd backend
npm run dev
```

L'application sera accessible sur :
- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (si utilisé)

### 7. Test de l'application

1. Créez un compte sur http://localhost:5173/register
2. Connectez-vous
3. Testez les fonctionnalités selon votre rôle

### 8. Données de test (optionnel)

Pour ajouter des livres de test :

```sql
-- Insérer un utilisateur test (après création via l'interface)
-- Remplacez 'user-uuid' par l'UUID réel de votre utilisateur

INSERT INTO public.books (title, description, author, price, type, cover, user_id) VALUES 
  (
    'Guide de Programmation',
    'Un guide complet pour apprendre la programmation moderne',
    'Jean Dupont',
    19.99,
    'ebook',
    'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
    'user-uuid'
  );
```

## 🔧 Dépannage

### Erreurs communes

1. **Erreur de connexion Supabase** : Vérifiez vos variables d'environnement
2. **Erreur RLS** : Assurez-vous que les policies sont bien créées
3. **Erreur d'upload** : Vérifiez la configuration des buckets Storage

### Logs utiles

```bash
# Voir les logs du frontend
npm run dev

# Voir les logs Supabase dans la console du navigateur
# Ouvrir les DevTools > Console
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console
2. Consultez la documentation Supabase
3. Vérifiez que toutes les variables d'environnement sont correctes