import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BookOpen, 
  User, 
  Mail, 
  FileText,
  Building, 
  AlertCircle,
  CheckCircle,
  Send
} from 'lucide-react';

const PublisherRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    companyName: '',
    website: '',
    experience: '',
    motivation: '',
    publicationPlan: '', // Changed from publishingPlan to match backend
    agreesToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    if (!formData.phone.trim()) newErrors.phone = 'Numéro de téléphone requis';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation requise';
    if (!formData.publicationPlan.trim()) newErrors.publicationPlan = 'Plan de publication requis';
    if (!formData.agreesToTerms) newErrors.agreesToTerms = 'Vous devez accepter les conditions';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:5000';
      
      // Create FormData for the request
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        website: formData.website,
        experience: formData.experience,
        motivation: formData.motivation,
        publicationPlan: formData.publicationPlan
      };

      // Make the API call with credentials
      const response = await axios.post(
        `${backendUrl}/api/publisher/submit-request`,
        requestData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        console.log('Publisher request submitted successfully:', response.data);
        setIsSubmitted(true);
      }
    } catch (error: unknown) {
      console.error('Error submitting publisher request:', error);
      
      // Handle specific error cases
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('Vous devez être connecté pour soumettre une demande.');
        } else if (error.response?.status === 400) {
          alert(error.response.data.message || 'Données invalides. Veuillez vérifier vos informations.');
        } else {
          alert('Erreur lors de la soumission. Veuillez réessayer.');
        }
      } else {
        alert('Erreur lors de la soumission. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Demande envoyée avec succès !
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Votre demande pour devenir publisher a été soumise. Notre équipe l'examinera dans les plus brefs délais 
            et vous contactera par email avec la décision.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retour au Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Demande pour devenir Publisher
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Rejoignez notre communauté d'auteurs et publiez vos œuvres
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Informations importantes :</p>
                <ul className="space-y-1 list-disc list-inside text-blue-700 dark:text-blue-300">
                  <li>Votre demande sera examinée par notre équipe</li>
                  <li>Le processus peut prendre 3-5 jours ouvrables</li>
                  <li>Vous recevrez une notification par email</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.firstName 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="Votre prénom"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.lastName 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Informations de contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.phone 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Informations professionnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Nom de l'entreprise (optionnel)
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  placeholder="Votre maison d'édition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Site web (optionnel)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  placeholder="https://votre-site.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Expérience en édition (optionnel)
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                placeholder="Décrivez votre expérience dans le domaine de l'édition..."
              />
            </div>
          </div>

          {/* Motivation & Plans */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Motivation et projets
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Pourquoi souhaitez-vous devenir publisher ? *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.motivation 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="Expliquez vos motivations et objectifs..."
                />
                {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Quel est votre plan de publication ? *
                </label>
                <textarea
                  name="publicationPlan"
                  value={formData.publicationPlan}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.publicationPlan 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-neutral-300 dark:border-neutral-600'
                  } bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white`}
                  placeholder="Décrivez les types de livres que vous souhaitez publier, la fréquence, vos stratégies..."
                />
                {errors.publicationPlan && <p className="text-red-500 text-sm mt-1">{errors.publicationPlan}</p>}
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreesToTerms"
                checked={formData.agreesToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 rounded focus:ring-primary-500 mt-1"
              />
              <label className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                J'accepte les{' '}
                <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  politique de confidentialité
                </a>{' '}
                de LectureVerse *
              </label>
            </div>
            {errors.agreesToTerms && <p className="text-red-500 text-sm mt-1 ml-7">{errors.agreesToTerms}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublisherRequestPage;