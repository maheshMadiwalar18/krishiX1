import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'kn';

interface Translations {
  [key: string]: {
    en: string;
    kn: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav_disease': { en: 'Disease', kn: 'ರೋಗ ಪತ್ತೆ' },
  'nav_weather': { en: 'Weather', kn: 'ಹವಾಮಾನ' },
  'nav_analytics': { en: 'Analytics', kn: 'ವರದಿಗಳು' },
  'nav_knowledge': { en: 'Knowledge', kn: 'ಮಾಹಿತಿ' },
  'nav_my_account': { en: 'My Account', kn: 'ನನ್ನ ಖಾತೆ' },
  'nav_logout': { en: 'Logout', kn: 'ಹೊರಹೋಗಿ' },

  // Home Page
  'home_hero_title': { en: 'Cultivating the Future of Bharat. One Yield at a Time.', kn: 'ಭಾರತದ ಕೃಷಿಯ ಭವಿಷ್ಯ. ಸಮೃದ್ಧ ಇಳುವರಿ ನಮ್ಮ ಗುರಿ.' },
  'home_hero_subtitle': { en: 'Better farming starts with the right guidance.', kn: 'ಸರಿಯಾದ ಮಾರ್ಗದರ್ಶನದಿಂದ ಉತ್ತಮ ಕೃಷಿ ಆರಂಭವಾಗುತ್ತದೆ.' },
  'btn_scan_now': { en: 'Scan Crop Now', kn: 'ಈಗಲೇ ಪರೀಕ್ಷಿಸಿ' },
  'btn_ask_ai': { en: 'Ask AI', kn: 'ಸಲಹೆ ಕೇಳಿ' },

  // Auth Page
  'auth_title': { en: 'Join KrushiX', kn: 'ಕೃಷಿಎಕ್ಸ್ ಜೊತೆ ಸೇರಿ' },
  'auth_demo_btn': { en: 'Try Demo Login', kn: 'ನೋಂದಣಿ ಇಲ್ಲದೆ ಪರೀಕ್ಷಿಸಿ' },
  'auth_email_label': { en: 'Email Address', kn: 'ಇಮೇಲ್ ವಿಳಾಸ' },
  'auth_password_label': { en: 'Password', kn: 'ಪಾಸ್‌ವರ್ಡ್' },
  'auth_login_btn': { en: 'Login to Farm', kn: 'ಒಳಗೆ ಹೋಗಿ' },
  'auth_signup_link': { en: "Don't have an account? Sign up", kn: 'ಖಾತೆ ಇಲ್ಲವೇ? ಹೊಸದಾಗಿ ಸೇರಿ' },

  // Disease Detection
  'disease_title': { en: 'Crop Disease Detection', kn: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ' },
  'disease_subtitle': { en: 'Upload a photo of your crop to get simple help.', kn: 'ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ, ಸುಲಭ ಪರಿಹಾರ ಪಡೆಯಿರಿ.' },
  'tip_label': { en: 'Tip:', kn: 'ಸಲಹೆ:' },
  'tip_content': { en: 'Clear leaf images give better results', kn: 'ಎಲೆಯ ಫೋಟೋ ಸ್ಪಷ್ಟವಾಗಿದ್ದರೆ ನಿಖರ ಮಾಹಿತಿ ಸಿಗುತ್ತದೆ' },
  'btn_choose_file': { en: 'Choose File', kn: 'ಫೋಟೋ ಆರಿಸಿ' },
  'btn_use_camera': { en: 'Use Camera', kn: 'ಕ್ಯಾಮೆರಾ ಬಳಸಿ' },
  'btn_start_ai': { en: 'Start AI Analysis', kn: 'ಪರೀಕ್ಷೆ ಆರಂಭಿಸಿ' },
  'scanning_text': { en: 'Analyzing Image...', kn: 'ಫೋಟೋ ಪರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ...' },
  'no_results_title': { en: 'No Results Yet', kn: 'ಯಾವುದೇ ಫಲಿತಾಂಶವಿಲ್ಲ' },
  'no_results_desc': { en: 'Upload a crop image and our AI will help you.', kn: 'ಬೆಳೆಯ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ, ನಮ್ಮ ಚತುರ ಉಪಕರಣ ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.' },
  'what_get_title': { en: "What you'll get:", kn: 'ನಿಮಗೆ ಏನು ಸಿಗುತ್ತದೆ:' },
  'get_item_1': { en: 'Disease name', kn: 'ರೋಗದ ಹೆಸರು' },
  'get_item_2': { en: 'Severity level', kn: 'ರೋಗದ ತೀವ್ರತೆ' },
  'get_item_3': { en: 'Medicine advice', kn: 'ಔಷಧದ ಸಲಹೆ' },
  'get_item_4': { en: 'Prevention tips', kn: 'ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು' },

  // Results
  'result_label': { en: 'Disease Result', kn: 'ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶ' },
  'result_action_level': { en: 'Action Level', kn: 'ತುರ್ತು ಕ್ರಮ' },
  'result_confidence': { en: 'Confidence', kn: 'ನಿಖರತೆ' },
  'medicine_title': { en: 'Medicine Recommendation', kn: 'ಔಷಧದ ಶಿಫಾರಸು' },
  'med_name': { en: 'Name', kn: 'ಹೆಸರು' },
  'med_dosage': { en: 'Dosage', kn: 'ಪ್ರಮಾಣ' },
  'med_method': { en: 'Method', kn: 'ವಿಧಾನ' },
  'med_frequency': { en: 'Frequency', kn: 'ಬಳಕೆಯ ಸಮಯ' },
  'prevention_title': { en: 'Prevention Tips', kn: 'ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು' },
  'btn_export': { en: 'Export Report', kn: 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
  'btn_save_log': { en: 'Save to Farm Log', kn: 'ದಾಖಲೆಯಲ್ಲಿ ಉಳಿಸಿ' },

  // General
  'or_separator': { en: 'OR', kn: 'ಅಥವಾ' },
  'supported_crops': { en: 'Supported crops:', kn: 'ಪತ್ತೆ ಮಾಡಬಹುದಾದ ಬೆಳೆಗಳು:' },
  'security_note': { en: 'Your data is secure and used only for analysis.', kn: 'ನಿಮ್ಮ ಮಾಹಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ ಮತ್ತು ಕೇವಲ ಪರೀಕ್ಷೆಗಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ.' },
  'security_note_bold': { en: 'We do not store your images.', kn: 'ನಾವು ನಿಮ್ಮ ಫೋಟೋಗಳನ್ನು ಉಳಿಸಿಕೊಳ್ಳುವುದಿಲ್ಲ.' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('krushix_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('krushix_lang', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
