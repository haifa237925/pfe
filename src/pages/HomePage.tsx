import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Users, Star, ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero section - Minimaliste et élégant */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30 overflow-hidden">
        {/* Décoration subtile */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Badge minimaliste */}
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-neutral-200/50 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-neutral-700">Plateforme de lecture nouvelle génération</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-neutral-900">Lisez.</span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Écoutez.</span>
              <br />
              <span className="text-neutral-900">Découvrez.</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-neutral-600 max-w-2xl mx-auto font-light">
              Votre bibliothèque personnelle de livres numériques et audiolivres, 
              accessible partout, à tout moment.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                to="/books" 
                className="group bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Explorer maintenant
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/register" 
                className="group bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-neutral-50 transition-all duration-300 border-2 border-primary-200 hover:border-primary-300 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer gratuitement
              </Link>
            </div>
            
            {/* Stats minimalistes */}
            <div className="flex justify-center items-center space-x-8 text-neutral-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">10K+</div>
                <div className="text-sm">Livres</div>
              </div>
              <div className="w-px h-8 bg-neutral-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">5K+</div>
                <div className="text-sm">Lecteurs</div>
              </div>
              <div className="w-px h-8 bg-neutral-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-900">4.9</div>
                <div className="text-sm flex items-center">
                  <Star className="h-3 w-3 text-amber-400 fill-current mr-1" />
                  Note
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features - Design épuré */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
              Une expérience de lecture complète et intuitive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-primary-100 text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Livres Numériques</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Une vaste collection de livres dans tous les genres, 
                avec une expérience de lecture optimisée.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-secondary-100 text-secondary-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Audiolivres</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Écoutez vos histoires préférées avec notre lecteur 
                audio avancé et ses fonctionnalités intelligentes.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-accent-100 text-accent-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">Communauté</h3>
              <p className="text-neutral-600 leading-relaxed font-light">
                Rejoignez une communauté passionnée de lecteurs 
                et découvrez de nouvelles recommandations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Simple et efficace */}
      <section className="py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-amber-400 fill-current mx-1" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-light text-neutral-700 mb-8 leading-relaxed">
              "LectureVerse a transformé ma façon de lire. L'interface est magnifique 
              et la synchronisation entre mes appareils est parfaite."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 font-semibold">MD</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-neutral-900">Marie Dubois</div>
                <div className="text-neutral-500">Lectrice passionnée</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Minimaliste */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-8">
                  Pourquoi choisir LectureVerse ?
                </h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Synchronisation parfaite</h3>
                      <p className="text-neutral-600 font-light">Vos livres et votre progression vous suivent sur tous vos appareils.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Recommandations intelligentes</h3>
                      <p className="text-neutral-600 font-light">Découvrez de nouveaux livres adaptés à vos goûts.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <CheckCircle className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Lecture hors ligne</h3>
                      <p className="text-neutral-600 font-light">Téléchargez vos livres et lisez partout, même sans internet.</p>
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
                      <div className="text-primary-100">Disponibilité</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Fiabilité garantie</h3>
                  <p className="text-primary-100 mb-6">
                    Service disponible 24h/24, 7j/7 avec un support client réactif.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-sm text-primary-100">Support</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <div className="text-2xl font-bold">SSL</div>
                      <div className="text-sm text-primary-100">Sécurisé</div>
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
            Commencez votre aventure littéraire
          </h2>
          <p className="text-xl mb-12 text-primary-100 max-w-2xl mx-auto font-light">
            Rejoignez des milliers de lecteurs qui ont déjà découvert 
            leur nouvelle passion pour la lecture numérique.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/register" 
              className="group bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Créer mon compte gratuit
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/books" 
              className="group bg-transparent text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center"
            >
              Découvrir les livres
              <BookOpen className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;