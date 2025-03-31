
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('fr')}
        className={language === 'fr' ? 'bg-sala7li-primary/20' : ''}
      >
        FR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'bg-sala7li-primary/20' : ''}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
