import React, { useState } from 'react';
import { Save, AlertTriangle, CheckCircle, Settings, Database, Mail, Shield, Globe } from 'lucide-react';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    siteName: 'LectureVerse',
    siteDescription: 'Plateforme de livres numériques',
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Paramètres de contenu
    maxFileSize: 50, // MB
    allowedFormats: ['pdf', 'epub', 'mp3', 'wav'],
    autoModeration: true,
    requireApproval: false,
    
    // Paramètres de paiement
    commissionRate: 15, // %
    minimumPrice: 0.99,
    maximumPrice: 999.99,
    
    // Paramètres d'email
    emailNotifications: true,
    welcomeEmails: true,
    marketingEmails: false,
    
    // Paramètres de sécurité
    passwordMinLength: 8,
    requireEmailVerification: false,
    sessionTimeout: 24, // heures
    maxLoginAttempts: 5
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulation de sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Paramètres sauvegardés avec succès');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Paramètres Système</h1>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {saveMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{saveMessage}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Paramètres généraux */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-neutral-600 mr-2" />
            <h2 className="text-lg font-semibold text-neutral-900">Paramètres Généraux</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description du site
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-sm text-neutral-700">
                Mode maintenance
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="registrationEnabled"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.registrationEnabled}
                onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
              />
              <label htmlFor="registrationEnabled" className="ml-2 text-sm text-neutral-700">
                Inscription activée
              </label>
            </div>
          </div>
        </div>

        {/* Paramètres de contenu */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 text-neutral-600 mr-2" />
            <h2 className="text-lg font-semibold text-neutral-900">Gestion du Contenu</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Taille max des fichiers (MB)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.maxFileSize}
                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.commissionRate}
                onChange={(e) => handleSettingChange('commissionRate', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoModeration"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.autoModeration}
                onChange={(e) => handleSettingChange('autoModeration', e.target.checked)}
              />
              <label htmlFor="autoModeration" className="ml-2 text-sm text-neutral-700">
                Modération automatique
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireApproval"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.requireApproval}
                onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
              />
              <label htmlFor="requireApproval" className="ml-2 text-sm text-neutral-700">
                Approbation requise
              </label>
            </div>
          </div>
        </div>

        {/* Paramètres de sécurité */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-neutral-600 mr-2" />
            <h2 className="text-lg font-semibold text-neutral-900">Sécurité</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Longueur min. mot de passe
              </label>
              <input
                type="number"
                min="6"
                max="20"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.passwordMinLength}
                onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Timeout session (heures)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Max tentatives de connexion
              </label>
              <input
                type="number"
                min="3"
                max="10"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireEmailVerification"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
              />
              <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-neutral-700">
                Vérification email requise
              </label>
            </div>
          </div>
        </div>

        {/* Paramètres d'email */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-5 w-5 text-neutral-600 mr-2" />
            <h2 className="text-lg font-semibold text-neutral-900">Notifications Email</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <label htmlFor="emailNotifications" className="ml-2 text-sm text-neutral-700">
                Notifications email activées
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="welcomeEmails"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.welcomeEmails}
                onChange={(e) => handleSettingChange('welcomeEmails', e.target.checked)}
              />
              <label htmlFor="welcomeEmails" className="ml-2 text-sm text-neutral-700">
                Emails de bienvenue
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketingEmails"
                className="rounded border-neutral-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                checked={settings.marketingEmails}
                onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
              />
              <label htmlFor="marketingEmails" className="ml-2 text-sm text-neutral-700">
                Emails marketing
              </label>
            </div>
          </div>
        </div>

        {/* Zone de danger */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Zone de Danger</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-red-900 mb-2">Réinitialiser les paramètres</h3>
              <p className="text-sm text-red-700 mb-3">
                Cette action restaurera tous les paramètres à leurs valeurs par défaut.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Réinitialiser
              </button>
            </div>
            
            <div>
              <h3 className="font-medium text-red-900 mb-2">Maintenance système</h3>
              <p className="text-sm text-red-700 mb-3">
                Effectuer une maintenance complète du système (nettoyage cache, optimisation DB).
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Lancer la maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;