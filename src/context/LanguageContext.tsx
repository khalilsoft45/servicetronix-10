
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the available languages
export type Language = 'fr' | 'en';

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Create a translations object
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Common
    "app.name": "Sala7li",
    "app.tagline": "Services de réparation professionnels",
    "app.logout": "Déconnexion",
    "app.back.home": "Retour à l'accueil",
    
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.repairs": "Réparations",
    "nav.users": "Utilisateurs",
    "nav.pickups": "Demandes de ramassage",
    "nav.requests": "Demandes de service",
    "nav.profile": "Profil",
    
    // Auth
    "auth.signin": "Connexion",
    "auth.signup": "Créer un compte",
    "auth.signin.title": "Connectez-vous à votre compte",
    "auth.signup.title": "Créer un compte client",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.confirm.password": "Confirmer le mot de passe",
    "auth.forgot.password": "Mot de passe oublié?",
    "auth.name": "Nom complet",
    "auth.phone": "Numéro de téléphone",
    "auth.signin.button": "Se connecter",
    "auth.signup.button": "Créer un compte client",
    "auth.google": "Continuer avec Google",
    "auth.or": "ou continuer avec",
    "auth.already.account": "Vous avez déjà un compte?",
    "auth.new.customer": "Nouveau client?",
    "auth.create.account": "Créer un compte client",
    "auth.signin.as": "Se connecter en tant que",
    "auth.role.customer": "Client",
    "auth.role.admin": "Administrateur",
    "auth.role.fixer": "Réparateur/Technicien",
    "auth.role.operator": "Opérateur téléphonique",
    "auth.role.collector": "Collecteur",
    "auth.staff.note": "Personnel: Utilisez les identifiants fournis par votre administrateur.",
    "auth.staff.register.note": "Les membres du personnel (Réparateurs, Opérateurs, Collecteurs) ne peuvent pas s'inscrire ici. Veuillez contacter votre administrateur pour obtenir vos identifiants de connexion.",
    "auth.terms": "En vous inscrivant, vous acceptez nos",
    "auth.terms.service": "Conditions d'utilisation",
    "auth.privacy.policy": "Politique de confidentialité",
    "auth.and": "et",
    
    // Dashboard - Collector
    "collector.dashboard": "Tableau de bord du collecteur",
    "collector.pickup.requests": "Demandes de ramassage",
    "collector.collected.devices": "Appareils collectés",
    "collector.waiting.collection": "Appareils en attente de collecte",
    "collector.history": "Historique des appareils collectés",
    "collector.display.here": "Vos demandes de ramassage assignées seront affichées ici.",
    "collector.history.display": "Votre historique des appareils collectés sera affiché ici.",
    
    // Dashboard - Fixer
    "fixer.dashboard": "Tableau de bord du réparateur",
    "fixer.assigned.repairs": "Réparations assignées",
    "fixer.completed.repairs": "Réparations terminées",
    "fixer.assigned.devices": "Appareils assignés pour réparation",
    "fixer.completed.history": "Historique des réparations terminées",
    "fixer.display.here": "Vos demandes de réparation assignées seront affichées ici.",
    "fixer.history.display": "Votre historique des réparations terminées sera affiché ici.",
    
    // Dashboard - Operator
    "operator.dashboard": "Tableau de bord de l'opérateur",
    "operator.new.requests": "Nouvelles demandes",
    "operator.confirmed.requests": "Demandes confirmées",
    "operator.waiting.confirmation": "Demandes en attente de confirmation",
    "operator.history": "Historique des demandes confirmées",
    "operator.display.here": "Les nouvelles demandes de service seront affichées ici.",
    "operator.history.display": "Votre historique des demandes confirmées sera affiché ici.",
    
    // Language 
    "language.switch": "Changer de langue",
    "language.french": "Français",
    "language.english": "Anglais",
  },
  en: {
    // Common
    "app.name": "Sala7li",
    "app.tagline": "Professional Repair Services",
    "app.logout": "Logout",
    "app.back.home": "Back to Home",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.repairs": "Repairs",
    "nav.users": "Users",
    "nav.pickups": "Pickup Requests",
    "nav.requests": "Service Requests",
    "nav.profile": "Profile",
    
    // Auth
    "auth.signin": "Sign in",
    "auth.signup": "Sign up",
    "auth.signin.title": "Sign in to your account",
    "auth.signup.title": "Create a customer account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirm.password": "Confirm Password",
    "auth.forgot.password": "Forgot password?",
    "auth.name": "Full Name",
    "auth.phone": "Phone Number",
    "auth.signin.button": "Sign in",
    "auth.signup.button": "Create customer account",
    "auth.google": "Sign in with Google",
    "auth.or": "or continue with",
    "auth.already.account": "Already have an account?",
    "auth.new.customer": "New customer?",
    "auth.create.account": "Create a customer account",
    "auth.signin.as": "Sign in as",
    "auth.role.customer": "Customer",
    "auth.role.admin": "Administrator",
    "auth.role.fixer": "Fixer/Technician",
    "auth.role.operator": "Phone Operator",
    "auth.role.collector": "Collector",
    "auth.staff.note": "Staff members: Use the credentials provided by your administrator.",
    "auth.staff.register.note": "Staff members (Fixers, Operators, Collectors) cannot register here. Please contact your administrator for login credentials.",
    "auth.terms": "By signing up, you agree to our",
    "auth.terms.service": "Terms of Service",
    "auth.privacy.policy": "Privacy Policy",
    "auth.and": "and",
    
    // Dashboard - Collector
    "collector.dashboard": "Collector Dashboard",
    "collector.pickup.requests": "Pickup Requests",
    "collector.collected.devices": "Collected Devices",
    "collector.waiting.collection": "Devices waiting for collection",
    "collector.history": "History of devices you've collected",
    "collector.display.here": "Your assigned pickup requests will be displayed here.",
    "collector.history.display": "Your collected device history will be displayed here.",
    
    // Dashboard - Fixer
    "fixer.dashboard": "Fixer Dashboard",
    "fixer.assigned.repairs": "Assigned Repairs",
    "fixer.completed.repairs": "Completed Repairs",
    "fixer.assigned.devices": "Devices assigned to you for repair",
    "fixer.completed.history": "History of repairs you've completed",
    "fixer.display.here": "Your assigned repair requests will be displayed here.",
    "fixer.history.display": "Your completed repair history will be displayed here.",
    
    // Dashboard - Operator
    "operator.dashboard": "Operator Dashboard",
    "operator.new.requests": "New Requests",
    "operator.confirmed.requests": "Confirmed Requests",
    "operator.waiting.confirmation": "Requests waiting for your confirmation",
    "operator.history": "History of requests you've confirmed",
    "operator.display.here": "New service requests will be displayed here.",
    "operator.history.display": "Your confirmed request history will be displayed here.",
    
    // Language 
    "language.switch": "Switch language",
    "language.french": "French",
    "language.english": "English",
  }
};

// Create the provider component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Translate function
  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
