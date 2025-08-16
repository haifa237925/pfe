import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Users, Star, ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors">
      {/* Hero section - Minimaliste et élégant */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
        {/* Fond animé avec formes géométriques */}
        <div className="absolute inset-0">
          {/* Livres flottants */}
          <div className="absolute top-20 left-10 w-16 h-20 bg-gradient-to-br from-primary-400/30 to-primary-600/30 rounded-sm shadow-lg transform rotate-12 animate-float-book"></div>
          <div className="absolute top-32 right-20 w-12 h-16 bg-gradient-to-br from-secondary-400/25 to-secondary-600/25 rounded-sm shadow-md transform -rotate-6 animate-float-book-delayed"></div>
          <div className="absolute bottom-40 left-1/4 w-14 h-18 bg-gradient-to-br from-accent-400/30 to-accent-600/30 rounded-sm shadow-lg transform rotate-45 animate-float-book-slow"></div>
          <div className="absolute top-1/3 right-1/3 w-10 h-14 bg-gradient-to-br from-purple-400/25 to-purple-600/25 rounded-sm shadow-md transform -rotate-12 animate-float-book"></div>
          <div className="absolute bottom-1/4 right-16 w-18 h-24 bg-gradient-to-br from-indigo-400/30 to-indigo-600/30 rounded-sm shadow-lg transform rotate-6 animate-float-book-delayed"></div>
          
          {/* Pages volantes */}
          <div className="absolute top-1/4 left-1/3 w-8 h-10 bg-white/40 dark:bg-white/20 rounded-sm shadow-sm transform rotate-45 animate-page-float"></div>
          <div className="absolute top-2/3 right-1/4 w-6 h-8 bg-white/30 dark:bg-white/15 rounded-sm shadow-sm transform -rotate-30 animate-page-float-delayed"></div>
          <div className="absolute bottom-1/3 left-1/5 w-7 h-9 bg-white/35 dark:bg-white/18 rounded-sm shadow-sm transform rotate-60 animate-page-float-slow"></div>
          
          {/* Lettres flottantes */}
          <div className="absolute top-1/5 right-1/5 text-4xl font-serif text-primary-300/30 dark:text-primary-400/20 animate-letter-float">A</div>
          <div className="absolute bottom-1/5 left-1/6 text-3xl font-serif text-secondary-300/25 dark:text-secondary-400/15 animate-letter-float-delayed">B</div>
          <div className="absolute top-2/5 left-2/3 text-5xl font-serif text-accent-300/30 dark:text-accent-400/20 animate-letter-float-slow">C</div>
          <div className="absolute bottom-2/5 right-1/6 text-2xl font-serif text-purple-300/25 dark:text-purple-400/15 animate-letter-float">α</div>
          <div className="absolute top-3/5 left-1/8 text-3xl font-serif text-indigo-300/30 dark:text-indigo-400/20 animate-letter-float-delayed">ع</div>
          
          {/* Particules de lecture */}
          <div className="absolute inset-0">
            <div className="absolute top-1/6 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-reading-particle"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-secondary-400/35 rounded-full animate-reading-particle-delayed"></div>
            <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-accent-400/40 rounded-full animate-reading-particle-slow"></div>
            <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-purple-400/30 rounded-full animate-reading-particle"></div>
          </div>
          
          {/* Overlay pour adoucir */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 dark:to-slate-900/40"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge minimaliste */}
            <div className="inline-flex items-center bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-neutral-900 dark:text-white">{t('hero.title.read')}</span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">{t('hero.title.listen')}</span>
              <br />
              <span className="text-neutral-900 dark:text-white">{t('hero.title.discover')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-light">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                to="/books" 
                className="group bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {t('hero.cta.explore')}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/register" 
                className="group bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-300 border-2 border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                {t('hero.cta.start')}
              </Link>
            </div>
            
            {/* Stats minimalistes */}
            <div className="flex justify-center items-center space-x-8 text-neutral-500 dark:text-neutral-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">10K+</div>
                <div className="text-sm">{t('hero.stats.books')}</div>
              </div>
              <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">5K+</div>
                <div className="text-sm">{t('hero.stats.readers')}</div>
              </div>
              <div className="w-px h-8 bg-neutral-300 dark:bg-neutral-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900 dark:text-white">4.9</div>
                <div className="text-sm flex items-center">
                  <Star className="h-3 w-3 text-amber-400 fill-current mr-1" />
                  {t('hero.stats.rating')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features - Design épuré */}
      <section className="py-24 bg-white dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-light">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">{t('features.ebooks.title')}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                {t('features.ebooks.desc')}
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">{t('features.audiobooks.title')}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                {t('features.audiobooks.desc')}
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">{t('features.community.title')}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                {t('features.community.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Simple et efficace */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-800 transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-amber-400 fill-current mx-1" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-light text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed">
              "{t('testimonial.quote')}"
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">MD</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-neutral-900 dark:text-white">{t('testimonial.author')}</div>
                <div className="text-neutral-500 dark:text-neutral-400">{t('testimonial.role')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Minimaliste */}
      <section className="py-24 bg-white dark:bg-neutral-900 transition-colors">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">
                  {t('benefits.title')}
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{t('benefits.sync.title')}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 font-light">{t('benefits.sync.desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{t('benefits.recommendations.title')}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 font-light">{t('benefits.recommendations.desc')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{t('benefits.offline.title')}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400 font-light">{t('benefits.offline.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <BookOpen className="h-12 w-12" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">99.9%</div>
                      <div className="text-primary-100">{t('benefits.availability')}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{t('benefits.reliability.title')}</h3>
                  <p className="text-primary-100 mb-6">
                    {t('benefits.reliability.desc')}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm text-primary-100">{t('benefits.support')}</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-2xl font-bold">SSL</div>
                      <div className="text-sm text-primary-100">{t('benefits.secure')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action - Épuré et impactant */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
        {/* Décoration subtile */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-12 text-primary-100 max-w-2xl mx-auto font-light">
            {t('cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="group bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {t('cta.signup')}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/books" 
              className="group bg-transparent text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center"
            >
              {t('cta.discover')}
              <BookOpen className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;