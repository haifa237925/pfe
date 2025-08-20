import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.books': 'Livres',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    'nav.dashboard': 'Tableau de bord',
    'nav.logout': 'Déconnexion',
    
    // Hero Section
    'hero.badge': 'Plateforme de lecture nouvelle génération',
    'hero.title.read': 'Lisez.',
    'hero.title.listen': 'Écoutez.',
    'hero.title.discover': 'Découvrez.',
    'hero.subtitle': 'Votre bibliothèque personnelle de livres numériques et audiolivres, accessible partout, à tout moment.',
    'hero.cta.explore': 'Explorer maintenant',
    'hero.cta.start': 'Commencer gratuitement',
    'hero.stats.books': 'Livres',
    'hero.stats.readers': 'Lecteurs',
    'hero.stats.rating': 'Note',
    
    // Features
    'features.title': 'Tout ce dont vous avez besoin',
    'features.subtitle': 'Une expérience de lecture complète et intuitive',
    'features.ebooks.title': 'Livres Numériques',
    'features.ebooks.desc': 'Une vaste collection de livres dans tous les genres, avec une expérience de lecture optimisée.',
    'features.audiobooks.title': 'Audiolivres',
    'features.audiobooks.desc': 'Écoutez vos histoires préférées avec notre lecteur audio avancé et ses fonctionnalités intelligentes.',
    'features.community.title': 'Communauté',
    'features.community.desc': 'Rejoignez une communauté passionnée de lecteurs et découvrez de nouvelles recommandations.',
    
    // Testimonial
    'testimonial.quote': 'LectureVerse a transformé ma façon de lire. L\'interface est magnifique et la synchronisation entre mes appareils est parfaite.',
    'testimonial.author': 'Marie Dubois',
    'testimonial.role': 'Lectrice passionnée',
    
    // Benefits
    'benefits.title': 'Pourquoi choisir LectureVerse ?',
    'benefits.sync.title': 'Synchronisation parfaite',
    'benefits.sync.desc': 'Vos livres et votre progression vous suivent sur tous vos appareils.',
    'benefits.recommendations.title': 'Recommandations intelligentes',
    'benefits.recommendations.desc': 'Découvrez de nouveaux livres adaptés à vos goûts.',
    'benefits.offline.title': 'Lecture hors ligne',
    'benefits.offline.desc': 'Téléchargez vos livres et lisez partout, même sans internet.',
    'benefits.reliability.title': 'Fiabilité garantie',
    'benefits.reliability.desc': 'Service disponible 24h/24, 7j/7 avec un support client réactif.',
    'benefits.support': 'Support',
    'benefits.secure': 'Sécurisé',
    'benefits.availability': 'Disponibilité',
    
    // CTA
    'cta.title': 'Commencez votre aventure littéraire',
    'cta.subtitle': 'Rejoignez des milliers de lecteurs qui ont déjà découvert leur nouvelle passion pour la lecture numérique.',
    'cta.signup': 'Créer mon compte gratuit',
    'cta.discover': 'Découvrir les livres',
    
    // Auth
    'auth.login.title': 'Bon retour !',
    'auth.login.subtitle': 'Connectez-vous à votre compte LectureVerse',
    'auth.register.title': 'Rejoignez-nous',
    'auth.register.subtitle': 'Créez votre compte LectureVerse',
    
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.wishlist': 'Ma Liste de souhaits',
    'dashboard.history': 'Historique de lecture',
    'dashboard.catalog': 'Catalogue de livres',
    'dashboard.become_publisher': 'Devenir Publisher?',
    
    // Publisher Request
    'publisher.title': 'Demande pour devenir Publisher',
    'publisher.subtitle': 'Rejoignez notre communauté d\'auteurs et publiez vos œuvres',
    'publisher.personal_info': 'Informations personnelles',
    'publisher.contact_info': 'Informations de contact',
    'publisher.professional_info': 'Informations professionnelles',
    'publisher.motivation': 'Motivation et projets',
    'publisher.submit': 'Envoyer la demande',
    'publisher.success': 'Demande envoyée avec succès !',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.submit': 'Soumettre',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier'
  } as const,
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.books': 'Books',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.badge': 'Next-generation reading platform',
    'hero.title.read': 'Read.',
    'hero.title.listen': 'Listen.',
    'hero.title.discover': 'Discover.',
    'hero.subtitle': 'Your personal library of digital books and audiobooks, accessible everywhere, anytime.',
    'hero.cta.explore': 'Explore now',
    'hero.cta.start': 'Start for free',
    'hero.stats.books': 'Books',
    'hero.stats.readers': 'Readers',
    'hero.stats.rating': 'Rating',
    
    // Features
    'features.title': 'Everything you need',
    'features.subtitle': 'A complete and intuitive reading experience',
    'features.ebooks.title': 'Digital Books',
    'features.ebooks.desc': 'A vast collection of books in all genres, with an optimized reading experience.',
    'features.audiobooks.title': 'Audiobooks',
    'features.audiobooks.desc': 'Listen to your favorite stories with our advanced audio player and smart features.',
    'features.community.title': 'Community',
    'features.community.desc': 'Join a passionate community of readers and discover new recommendations.',
    
    // Testimonial
    'testimonial.quote': 'LectureVerse has transformed the way I read. The interface is beautiful and synchronization between my devices is perfect.',
    'testimonial.author': 'Marie Dubois',
    'testimonial.role': 'Passionate Reader',
    
    // Benefits
    'benefits.title': 'Why choose LectureVerse?',
    'benefits.sync.title': 'Perfect synchronization',
    'benefits.sync.desc': 'Your books and progress follow you on all your devices.',
    'benefits.recommendations.title': 'Smart recommendations',
    'benefits.recommendations.desc': 'Discover new books tailored to your tastes.',
    'benefits.offline.title': 'Offline reading',
    'benefits.offline.desc': 'Download your books and read anywhere, even without internet.',
    'benefits.reliability.title': 'Guaranteed reliability',
    'benefits.reliability.desc': '24/7 service availability with responsive customer support.',
    'benefits.support': 'Support',
    'benefits.secure': 'Secure',
    'benefits.availability': 'Availability',
    
    // CTA
    'cta.title': 'Start your literary adventure',
    'cta.subtitle': 'Join thousands of readers who have already discovered their new passion for digital reading.',
    'cta.signup': 'Create my free account',
    'cta.discover': 'Discover books',
    
    // Auth
    'auth.login.title': 'Welcome back!',
    'auth.login.subtitle': 'Sign in to your LectureVerse account',
    'auth.register.title': 'Join us',
    'auth.register.subtitle': 'Create your LectureVerse account',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.wishlist': 'My Wishlist',
    'dashboard.history': 'Reading History',
    'dashboard.catalog': 'Book Catalog',
    'dashboard.become_publisher': 'Become Publisher?',
    
    // Publisher Request
    'publisher.title': 'Become a Publisher',
    'publisher.subtitle': 'Join our community of authors and publish your works',
    'publisher.personal_info': 'Personal Information',
    'publisher.contact_info': 'Contact Information',
    'publisher.professional_info': 'Professional Information',
    'publisher.motivation': 'Motivation and Projects',
    'publisher.submit': 'Submit Request',
    'publisher.success': 'Request submitted successfully!',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort'
  } as const,
  
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.books': 'الكتب',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',
    
    // Hero Section
    'hero.badge': 'منصة قراءة الجيل الجديد',
    'hero.title.read': 'اقرأ.',
    'hero.title.listen': 'استمع.',
    'hero.title.discover': 'اكتشف.',
    'hero.subtitle': 'مكتبتك الشخصية من الكتب الرقمية والكتب الصوتية، متاحة في كل مكان وفي أي وقت.',
    'hero.cta.explore': 'استكشف الآن',
    'hero.cta.start': 'ابدأ مجاناً',
    'hero.stats.books': 'كتاب',
    'hero.stats.readers': 'قارئ',
    'hero.stats.rating': 'التقييم',
    
    // Features
    'features.title': 'كل ما تحتاجه',
    'features.subtitle': 'تجربة قراءة شاملة وبديهية',
    'features.ebooks.title': 'الكتب الرقمية',
    'features.ebooks.desc': 'مجموعة واسعة من الكتب في جميع الأنواع، مع تجربة قراءة محسّنة.',
    'features.audiobooks.title': 'الكتب الصوتية',
    'features.audiobooks.desc': 'استمع إلى قصصك المفضلة مع مشغل الصوت المتقدم والميزات الذكية.',
    'features.community.title': 'المجتمع',
    'features.community.desc': 'انضم إلى مجتمع شغوف من القراء واكتشف توصيات جديدة.',
    
    // Testimonial
    'testimonial.quote': 'لقد غيّرت منصة LectureVerse طريقة قراءتي. الواجهة جميلة والمزامنة بين أجهزتي مثالية.',
    'testimonial.author': 'ماري دوبوا',
    'testimonial.role': 'قارئة شغوفة',
    
    // Benefits
    'benefits.title': 'لماذا تختار LectureVerse؟',
    'benefits.sync.title': 'مزامنة مثالية',
    'benefits.sync.desc': 'كتبك وتقدمك يتبعانك على جميع أجهزتك.',
    'benefits.recommendations.title': 'توصيات ذكية',
    'benefits.recommendations.desc': 'اكتشف كتباً جديدة مناسبة لأذواقك.',
    'benefits.offline.title': 'قراءة بدون إنترنت',
    'benefits.offline.desc': 'حمّل كتبك واقرأ في أي مكان، حتى بدون إنترنت.',
    'benefits.reliability.title': 'موثوقية مضمونة',
    'benefits.reliability.desc': 'خدمة متاحة 24/7 مع دعم عملاء سريع الاستجابة.',
    'benefits.support': 'الدعم',
    'benefits.secure': 'آمن',
    'benefits.availability': 'التوفر',
    
    // CTA
    'cta.title': 'ابدأ مغامرتك الأدبية',
    'cta.subtitle': 'انضم إلى آلاف القراء الذين اكتشفوا بالفعل شغفهم الجديد للقراءة الرقمية.',
    'cta.signup': 'إنشاء حسابي المجاني',
    'cta.discover': 'اكتشف الكتب',
    
    // Auth
    'auth.login.title': 'أهلاً بعودتك!',
    'auth.login.subtitle': 'سجل دخولك إلى حساب LectureVerse',
    'auth.register.title': 'انضم إلينا',
    'auth.register.subtitle': 'أنشئ حساب LectureVerse الخاص بك',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.wishlist': 'قائمة الرغبات',
    'dashboard.history': 'سجل القراءة',
    'dashboard.catalog': 'كتالوج الكتب',
    'dashboard.become_publisher': 'أصبح ناشر؟',
    
    // Publisher Request
    'publisher.title': 'طلب أن تصبح ناشر',
    'publisher.subtitle': 'انضم إلى مجتمع الكتاب واكتب أعمالك',
    'publisher.personal_info': 'المعلومات الشخصية',
    'publisher.contact_info': 'معلومات الاتصال',
    'publisher.professional_info': 'المعلومات المهنية',
    'publisher.motivation': 'الدافع والمشاريع',
    'publisher.submit': 'إرسال الطلب',
    'publisher.success': 'تم إرسال الطلب بنجاح!',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.save': 'حفظ',
    'common.edit': 'تحرير',
    'common.delete': 'حذف',
    'common.search': 'بحث',
    'common.filter': 'فلتر',
    'common.sort': 'ترتيب'
  } as const
};

// Type helper for translation keys
type TranslationKey = keyof typeof translations.fr;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['fr', 'en', 'ar'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key as TranslationKey];
    if (!translation) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
      }
      // Fallback: anglais → français → clé originale
      return translations.en?.[key as TranslationKey] || 
             translations.fr?.[key as TranslationKey] || 
             key;
    }
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};