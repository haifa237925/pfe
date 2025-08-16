import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Headphones, ShieldCheck, Star, Users, TrendingUp, ArrowRight, Play, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Star className="h-4 w-4 text-amber-400 mr-2" />
              <span className="text-sm font-medium">Plateforme #1 pour les livres numériques</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Découvrez, Lisez et 
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Écoutez</span>
              <br />des Livres Extraordinaires
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Votre passerelle vers un monde de livres numériques et audiolivres. 
              Rejoignez une communauté passionnée de lecteurs et d'auteurs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link 
                to="/books" 
                className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Explorer les Livres
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/register" 
                className="group bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 border-2 border-primary-500 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer Gratuitement
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                <div className="text-primary-200 text-sm">Livres disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">5K+</div>
                <div className="text-primary-200 text-sm">Lecteurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-primary-200 text-sm">Auteurs publiés</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-20">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Pourquoi Choisir LectureVerse ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Une plateforme complète conçue pour offrir la meilleure expérience de lecture numérique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Livres Numériques</h3>
              <p className="text-neutral-600 leading-relaxed">
                Accédez à une vaste bibliothèque de livres numériques dans différents formats, avec une expérience de lecture optimisée et sécurisée.
              </p>
              <div className="mt-6 flex items-center text-primary-600 font-medium">
                <span>En savoir plus</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Audiolivres</h3>
              <p className="text-neutral-600 leading-relaxed">
                Écoutez vos livres préférés avec notre lecteur audio avancé, contrôles de vitesse et suivi de progression intelligent.
              </p>
              <div className="mt-6 flex items-center text-secondary-600 font-medium">
                <span>Découvrir</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Pour les Auteurs</h3>
              <p className="text-neutral-600 leading-relaxed">
                Publiez et vendez vos œuvres facilement avec des outils d'analyse détaillés et un système de revenus transparent.
              </p>
              <div className="mt-6 flex items-center text-accent-600 font-medium">
                <span>Publier maintenant</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-neutral-100">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-neutral-600 to-neutral-700 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Sécurité Avancée</h3>
              <p className="text-neutral-600 leading-relaxed">
                Protection anti-piratage de pointe et transactions sécurisées pour protéger les créateurs et les lecteurs.
              </p>
              <div className="mt-6 flex items-center text-neutral-600 font-medium">
                <span>Sécurité</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-neutral-600">
              Rejoignez des milliers d'auteurs et lecteurs satisfaits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-neutral-50">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4 italic">
                "Une plateforme exceptionnelle pour découvrir de nouveaux auteurs. L'interface est intuitive et la qualité audio est parfaite."
              </p>
              <div className="font-semibold text-neutral-900">Marie Dubois</div>
              <div className="text-sm text-neutral-500">Lectrice passionnée</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-neutral-50">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4 italic">
                "Grâce à LectureVerse, j'ai pu publier mon premier roman et atteindre des milliers de lecteurs. Les outils d'analyse sont formidables."
              </p>
              <div className="font-semibold text-neutral-900">Jean Martin</div>
              <div className="text-sm text-neutral-500">Auteur indépendant</div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-neutral-50">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-700 mb-4 italic">
                "La synchronisation entre mes appareils est parfaite. Je peux commencer un livre sur mon téléphone et le finir sur ma tablette."
              </p>
              <div className="font-semibold text-neutral-900">Sophie Laurent</div>
              <div className="text-sm text-neutral-500">Étudiante</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                  Une Expérience de Lecture Révolutionnaire
                </h2>
                <p className="text-xl text-neutral-600 mb-8">
                  Découvrez pourquoi des milliers de lecteurs choisissent LectureVerse pour leur passion littéraire.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Synchronisation Multi-Appareils</h3>
                      <p className="text-neutral-600">Vos livres et votre progression vous suivent partout, sur tous vos appareils.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Recommandations Personnalisées</h3>
                      <p className="text-neutral-600">Notre IA vous suggère des livres basés sur vos goûts et habitudes de lecture.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-2">Mode Hors Ligne</h3>
                      <p className="text-neutral-600">Téléchargez vos livres et lisez même sans connexion internet.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <BookOpen className="h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold">4.9/5</div>
                        <div className="text-primary-200 text-sm">Note moyenne</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Expérience Utilisateur</h3>
                    <p className="text-primary-100">Interface intuitive et fonctionnalités avancées</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-1">99.9%</div>
                      <div className="text-sm text-neutral-600">Disponibilité</div>
                    </div>
                    <div className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary-600 mb-1">24/7</div>
                      <div className="text-sm text-neutral-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Prêt à Commencer Votre Aventure Littéraire ?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Rejoignez notre communauté de passionnés et découvrez un monde infini de connaissances et d'histoires captivantes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link 
              to="/register" 
              className="group bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Inscription Gratuite
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/books" 
              className="group bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/30 hover:border-white/50 flex items-center justify-center"
            >
              Explorer le Catalogue
              <BookOpen className="h-5 w-5 ml-2" />
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-primary-200">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              <span className="text-sm">5000+ lecteurs actifs</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-sm">Croissance de 200% cette année</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-amber-400" />
              <span className="text-sm">4.9/5 étoiles</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;