# 🚀 Guide de Configuration Supabase pour LectureVerse

## 📋 Étapes à suivre maintenant

### 1. 🔑 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Cliquez sur "New Project"
4. Donnez un nom à votre projet : `lectureverse`
5. Créez un mot de passe pour la base de données
6. Choisissez une région proche de vous
7. Cliquez sur "Create new project"

### 2. 📝 Configurer les variables d'environnement

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez ces informations :
   - **Project URL** (commence par https://...)
   - **anon public key** (commence par eyJ...)

3. Créez un fichier `.env` à la racine du projet avec :

```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

### 3. 🗄️ Créer la base de données

Dans Supabase, allez dans **SQL Editor** et exécutez ce script :

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
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

### 4. 🔐 Configurer l'authentification

1. Dans Supabase, allez dans **Authentication** > **Settings**
2. Dans **Site URL**, mettez : `http://localhost:5173`
3. Dans **Redirect URLs**, ajoutez : `http://localhost:5173/**`
4. Désactivez "Enable email confirmations" pour le développement

### 5. 📁 Configurer le stockage (Storage)

Dans Supabase, allez dans **Storage** et créez ces buckets :

1. **book-covers** (public) - pour les couvertures
2. **book-files** (privé) - pour les fichiers e-books
3. **audio-files** (privé) - pour les fichiers audio

### 6. 🚀 Redémarrer l'application

```bash
npm run dev
```

## ✅ Résultat attendu

Après ces étapes, votre application aura :

- ✅ **Authentification réelle** avec Supabase
- ✅ **Base de données PostgreSQL** 
- ✅ **Sécurité Row Level Security**
- ✅ **Stockage de fichiers**
- ✅ **Gestion des utilisateurs**

## 🔧 Dépannage

Si vous avez des erreurs :

1. Vérifiez que les variables d'environnement sont correctes
2. Assurez-vous que les tables sont créées
3. Vérifiez que RLS est activé
4. Consultez les logs dans la console du navigateur

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
- Les variables d'environnement dans `.env`
- La console du navigateur pour les erreurs
- L'onglet Network pour les requêtes API