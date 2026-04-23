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
  'security_note_bold': { en: 'We do not store your images.', kn: 'ನಾಮ ನಿಮ್ಮ ಫೋಟೋಗಳನ್ನು ಉಳಿಸಿಕೊಳ್ಳುವುದಿಲ್ಲ.' },
  'auth_signup_btn': { en: 'Join as Farmer', kn: 'ರೈತರಾಗಿ ಸೇರಿ' },

  // Home - QuickActions
  'quick_title': { en: 'Start Your Farming Journey', kn: 'ನಿಮ್ಮ ಕೃಷಿ ಪಯಣ ಆರಂಭಿಸಿ' },
  'quick_subtitle': { en: 'Try KrushiX tools now. Log in and see the results.', kn: 'ಈಗಲೇ ಕೃಷಿಎಕ್ಸ್ ಬಳಸಿ ನೋಡಿ.' },
  'quick_upload': { en: 'Upload Crop Image', kn: 'ಬೆಳೆ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ' },
  'quick_upload_desc': { en: 'Drag and drop or click to scan leaf photo', kn: 'ಎಲೆಯ ಫೋಟೋ ಇಲ್ಲಿ ಹಾಕಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ' },
  'quick_voice': { en: 'Voice Assistant', kn: 'ಧ್ವನಿ ಸಹಾಯಕ' },
  'quick_voice_desc': { en: 'Ask any farming question out loud', kn: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ' },

  // Home - FeaturesGrid
  'features_title': { en: 'Smart Tools for Your Farm', kn: 'ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಚತುರ ಸಾಧನಗಳು' },
  'features_subtitle': { en: 'Simple AI tools to help you grow better crops.', kn: 'ಉತ್ತಮ ಬೆಳೆ ಬೆಳೆಯಲು ಸರಳ ಸಾಧನಗಳು.' },
  'feat_disease': { en: 'Crop Disease Detection', kn: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ' },
  'feat_disease_desc': { en: 'Instant visual diagnosis', kn: 'ತಕ್ಷಣದ ಫೋಟೋ ಪರೀಕ್ಷೆ' },
  'feat_weather': { en: 'Weather Alerts', kn: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ' },
  'feat_weather_desc': { en: 'Local weather updates', kn: 'ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮಾಹಿತಿ' },
  'feat_crop_rec': { en: 'Crop Recommendation', kn: 'ಬೆಳೆ ಶಿಫಾರಸು' },
  'feat_crop_rec_desc': { en: 'Best crop advice for your soil', kn: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಸೂಕ್ತ ಬೆಳೆ ಸಲಹೆ' },
  'feat_ai': { en: 'AI Assistant', kn: 'ಕೃಷಿ ಸಹಾಯಕ' },
  'feat_ai_desc': { en: '24/7 expert farm support', kn: '24/7 ಕೃಷಿ ತಜ್ಞರ ಸಹಾಯ' },
  'feat_knowledge': { en: 'Knowledge Hub', kn: 'ಮಾಹಿತಿ ಕೇಂದ್ರ' },
  'feat_knowledge_desc': { en: 'Learn farming simply', kn: 'ಸುಲಭವಾಗಿ ಕೃಷಿ ಕಲಿಯಿರಿ' },

  // Home - DashboardPreview
  'preview_title': { en: 'Live Farm Status', kn: 'ನಿಮ್ಮ ಹೊಲದ ಸ್ಥಿತಿ' },
  'preview_subtitle': { en: 'Monitor your farm health and weather in real-time.', kn: 'ನಿಮ್ಮ ಹೊಲದ ಆರೋಗ್ಯ ಮತ್ತು ಹವಾಮಾನ ನೋಡಿ.' },
  'stat_weather': { en: 'Current Weather', kn: 'ಈಗಿನ ಹವಾಮಾನ' },
  'stat_health': { en: 'Crop Health', kn: 'ಬೆಳೆ ಆರೋಗ್ಯ' },
  'stat_alerts': { en: 'Critical Alerts', kn: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ' },
  'btn_scan_crop': { en: 'Scan Your Crop Now', kn: 'ಈಗ ನಿಮ್ಮ ಬೆಳೆ ಪರೀಕ್ಷಿಸಿ' },

  // Home - VoiceCTA
  'voice_title': { en: 'Talk to Your Farming Expert.', kn: 'ನಿಮ್ಮ ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಮಾತನಾಡಿ.' },
  'voice_subtitle': { en: 'Ask questions about soil, pests, or crops and get instant help.', kn: 'ಮಣ್ಣು, ಕೀಟ ಅಥವಾ ಬೆಳೆ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ, ತಕ್ಷಣ ಉತ್ತರ ಪಡೆಯಿರಿ.' },
  'btn_start_voice': { en: 'Start Voice Assistant', kn: 'ಧ್ವನಿ ಸಹಾಯಕ ಆರಂಭಿಸಿ' },

  // Home - Footer
  'footer_tagline': { en: 'Simple tools to help you grow healthy crops.', kn: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ ಬೆಳೆಯಲು ಸರಳ ಸಾಧನಗಳು.' },
  'footer_product': { en: 'Product', kn: 'ಉತ್ಪನ್ನ' },
  'footer_portal': { en: 'Portal', kn: 'ಪೋರ್ಟಲ್' },
  'footer_connect': { en: 'Connect', kn: 'ಸಂಪರ್ಕ' },
  'footer_disease': { en: 'Disease Detection', kn: 'ರೋಗ ಪತ್ತೆ' },
  'footer_weather_alerts': { en: 'Weather Alerts', kn: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ' },
  'footer_crop_rec': { en: 'Crop Recommendations', kn: 'ಬೆಳೆ ಶಿಫಾರಸು' },
  'footer_voice': { en: 'AI Voice Expert', kn: 'AI ಧ್ವನಿ ತಜ್ಞ' },
  'footer_scanner': { en: 'Crop Scanner', kn: 'ಬೆಳೆ ಸ್ಕ್ಯಾನರ್' },
  'footer_contact': { en: 'Contact Support', kn: 'ಸಹಾಯ ಸಂಪರ್ಕ' },
  'footer_community': { en: 'Community Forum', kn: 'ಸಮುದಾಯ ವೇದಿಕೆ' },

  // Weather Page
  'weather_title': { en: 'Weather & Recommendations', kn: 'ಹವಾಮಾನ ಮತ್ತು ಶಿಫಾರಸು' },
  'weather_forecast': { en: '7-Day Forecast', kn: '7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ' },
  'weather_ai_insight': { en: 'AI Insight', kn: 'AI ಸಲಹೆ' },
  'weather_crop_rec': { en: 'Crop Recommendations', kn: 'ಬೆಳೆ ಶಿಫಾರಸು' },
  'weather_based': { en: 'Based on your local weather', kn: 'ನಿಮ್ಮ ಸ್ಥಳೀಯ ಹವಾಮಾನ ಆಧಾರಿತ' },
  'weather_view_advice': { en: 'View Advice', kn: 'ಸಲಹೆ ನೋಡಿ' },
  'weather_plan_irrigation': { en: 'Plan Irrigation', kn: 'ನೀರಾವರಿ ಯೋಜನೆ' },
  'weather_sowing': { en: 'Sowing Time', kn: 'ಬಿತ್ತನೆ ಸಮಯ' },
  'weather_water': { en: 'Water Req.', kn: 'ನೀರಿನ ಅಗತ್ಯ' },
  'weather_fertilizer': { en: 'Fertilizer', kn: 'ಗೊಬ್ಬರ' },
  'weather_view_details': { en: 'View Details', kn: 'ವಿವರ ನೋಡಿ' },
  'weather_humidity': { en: 'Humidity', kn: 'ತೇವಾಂಶ' },
  'weather_wind': { en: 'Wind', kn: 'ಗಾಳಿ' },
  'weather_rain': { en: 'Rain', kn: 'ಮಳೆ' },

  // Voice Assistant
  'assistant_title': { en: 'KrushiX Assistant', kn: 'ಕೃಷಿಎಕ್ಸ್ ಸಹಾಯಕ' },
  'assistant_greeting': { en: 'Namaste! I am KrushiX. How can I help with your farming today?', kn: 'ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿಎಕ್ಸ್. ಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' },
  'assistant_placeholder': { en: 'Type your farming question...', kn: 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ...' },
  'assistant_listening': { en: 'Listening...', kn: 'ಕೇಳಿಸುತ್ತಿದೆ...' },

  // Dashboard
  'dash_welcome': { en: 'Welcome back', kn: 'ಮರಳಿ ಸ್ವಾಗತ' },
  'dash_subtitle': { en: 'Your farm at a glance.', kn: 'ನಿಮ್ಮ ಹೊಲದ ಸ್ಥಿತಿ.' },
  'dash_quick_actions': { en: 'Quick Actions', kn: 'ತ್ವರಿತ ಕ್ರಮಗಳು' },
  'dash_quick_stats': { en: 'Quick Stats', kn: 'ತ್ವರಿತ ಮಾಹಿತಿ' },
  'dash_explore_knowledge': { en: 'Explore Knowledge Hub', kn: 'ಮಾಹಿತಿ ಕೇಂದ್ರ ನೋಡಿ' },
  'dash_profile': { en: 'Farmer Profile', kn: 'ರೈತ ಪ್ರೊಫೈಲ್' }
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
