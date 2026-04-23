import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Bug, Droplets, Leaf, 
  Wind, Beaker, Sprout, Bird, ChevronLeft, 
  Volume2, Square, Bookmark, MessageSquare,
  Languages, Lightbulb, Play, ArrowRight, Sparkles,
  Zap, Heart, TrendingUp, HelpCircle, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- DATA STRUCTURES ---

type Language = 'EN' | 'HI' | 'KN';
type ViewState = 'grid' | 'category' | 'topic';

const CATEGORIES = [
  { 
    id: 'soil', 
    title: { EN: 'Soil Health', HI: 'मृदा स्वास्थ्य', KN: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ' }, 
    icon: Beaker, 
    accent: '#5D4037', 
    bg: 'bg-[#efebe9]',
    border: 'border-[#d7ccc8]',
    desc: { EN: 'Keep your soil rich and fertile.', HI: 'अपनी मिट्टी को उपजाऊ रखें।', KN: 'ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಫಲವತ್ತಾಗಿಡಿ.' } 
  },
  { 
    id: 'crop', 
    title: { EN: 'Crop Management', HI: 'फसल प्रबंधन', KN: 'ಬೆಳೆ ನಿರ್ವಹಣೆ' }, 
    icon: Sprout, 
    accent: '#2E7D32', 
    bg: 'bg-[#e8f5e9]',
    border: 'border-[#c8e6c9]',
    desc: { EN: 'Best practices for healthy crops.', HI: 'स्वस्थ फसलों के लिए सर्वोत्तम अभ्यास।', KN: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳಿಗೆ ಉತ್ತಮ ಅಭ್ಯಾಸಗಳು.' } 
  },
  { 
    id: 'pest', 
    title: { EN: 'Pest Control', HI: 'कीट नियंत्रण', KN: 'ಕೀಟ ನಿಯಂತ್ರಣ' }, 
    icon: Bug, 
    accent: '#C62828', 
    bg: 'bg-[#ffebee]',
    border: 'border-[#ffcdd2]',
    desc: { EN: 'Protect your farm from insects.', HI: 'अपने खेत को कीड़ों से बचाएं।', KN: 'ಕೀಟಗಳಿಂದ ನಿಮ್ಮ ಜಮೀನನ್ನು ರಕ್ಷಿಸಿ.' } 
  },
  { 
    id: 'irrigation', 
    title: { EN: 'Irrigation', HI: 'सिंचाई', KN: 'ನೀರಾವರಿ' }, 
    icon: Droplets, 
    accent: '#1565C0', 
    bg: 'bg-[#e3f2fd]',
    border: 'border-[#bbdefb]',
    desc: { EN: 'Smart watering techniques.', HI: 'स्मार्ट सिंचाई तकनीकें।', KN: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ತಂತ್ರಗಳು.' } 
  },
  { 
    id: 'fertilizer', 
    title: { EN: 'Fertilizer Guide', HI: 'उर्वरक गाइड', KN: 'ರಸಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ' }, 
    icon: Leaf, 
    accent: '#00796B', 
    bg: 'bg-[#e0f2f1]',
    border: 'border-[#b2dfdb]',
    desc: { EN: 'Right nutrients for your soil.', HI: 'आपकी मिट्टी के लिए सही पोषक तत्व।', KN: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಸರಿಯಾದ ಪೋಷಕಾಂಶಗಳು.' } 
  },
  { 
    id: 'animal', 
    title: { EN: 'Animal Husbandry', HI: 'पशुपालन', KN: 'ಪಶುಸಂಗೋಪನೆ' }, 
    icon: Bird, 
    accent: '#EF6C00', 
    bg: 'bg-[#fff3e0]',
    border: 'border-[#ffe0b2]',
    desc: { EN: 'Care for farm animals.', HI: 'खेत के जानवरों की देखभाल।', KN: 'ಕೃಷಿ ಪ್ರಾಣಿಗಳ ಆರೈಕೆ.' } 
  },
  { 
    id: 'weather', 
    title: { EN: 'Weather Farming', HI: 'मौसम आधारित खेती', KN: 'ಹವಾಮಾನ ಕೃಷಿ' }, 
    icon: Wind, 
    accent: '#455A64', 
    bg: 'bg-[#eceff1]',
    border: 'border-[#cfd8dc]',
    desc: { EN: 'Farming in different climates.', HI: 'विभिन्न जलवायु में खेती।', KN: 'ವಿವಿಧ ಹವಾಮಾನಗಳಲ್ಲಿ ಕೃಷಿ.' } 
  },
  { 
    id: 'seeds', 
    title: { EN: 'Seed Selection', HI: 'बीज चयन', KN: 'ಬೀಜ ಆಯ್ಕೆ' }, 
    icon: BookOpen, 
    accent: '#303F9F', 
    bg: 'bg-[#e8eaf6]',
    border: 'border-[#c5cae9]',
    desc: { EN: 'Choosing the best seeds.', HI: 'सर्वोत्तम बीजों का चुनाव।', KN: 'ಉತ್ತಮ ಬೀಜಗಳ ಆಯ್ಕೆ.' } 
  },
];

const TOPICS: Record<string, any[]> = {
  soil: [
    { id: 'ph-levels', title: { EN: 'Understanding Soil pH', HI: 'मिट्टी के पीएच को समझना', KN: 'ಮಣ್ಣಿನ pH ಅನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು' }, desc: { EN: 'Learn why soil pH matters for crop growth.', HI: 'जानें कि फसल वृद्धि के लिए मिट्टी का पीएच क्यों मायने रखता है।', KN: 'ಬೆಳೆ ಬೆಳವಣಿಗೆಗೆ ಮಣ್ಣಿನ pH ಏಕೆ ಮುಖ್ಯ ಎಂದು ತಿಳಿಯಿರಿ.' } },
    { id: 'composting', title: { EN: 'Making Organic Compost', HI: 'जैविक खाद बनाना', KN: 'ಸಾವಯವ ಗೊಬ್ಬರ ತಯಾರಿಕೆ' }, desc: { EN: 'Turn farm waste into rich fertilizer.', HI: 'खेत के कचरे को समृद्ध उर्वरक में बदलें।', KN: 'ಕೃಷಿ ತ್ಯಾಜ್ಯವನ್ನು ಉತ್ತಮ ಗೊಬ್ಬರವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ.' } },
    { id: 'soil-testing', title: { EN: 'Soil Testing Guide', HI: 'मिट्टी परीक्षण गाइड', KN: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾರ್ಗದರ್ಶಿ' }, desc: { EN: 'How to collect soil samples correctly.', HI: 'मिट्टी के नमूने सही तरीके से कैसे एकत्र करें।', KN: 'ಮಣ್ಣಿನ ಮಾದರಿಗಳನ್ನು ಸರಿಯಾಗಿ ಸಂಗ್ರಹಿಸುವುದು ಹೇಗೆ.' } },
    { id: 'mulching', title: { EN: 'Benefits of Mulching', HI: 'मल्चिंग के लाभ', KN: 'ಮಲ್ಚಿಂಗ್‌ನ ಪ್ರಯೋಜನಗಳು' }, desc: { EN: 'Conserve moisture and suppress weeds.', HI: 'नमी का संरक्षण करें और खरपतवारों को दबाएं।', KN: 'ತೇವಾಂಶವನ್ನು ಉಳಿಸಿ ಮತ್ತು ಕಳೆಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ.' } },
    { id: 'crop-rotation', title: { EN: 'Soil-Friendly Crop Rotation', HI: 'मृदा-अनुकूल फसल चक्र', KN: 'ಮಣ್ಣಿನ ಸ್ನೇಹಿ ಬೆಳೆ ಸರದಿ' }, desc: { EN: 'Prevent soil exhaustion through rotation.', HI: 'चक्र के माध्यम से मिट्टी की थकावट को रोकें।', KN: 'ಬೆಳೆ ಸರದಿಯ ಮೂಲಕ ಮಣ್ಣಿನ ಸತ್ವವನ್ನು ಉಳಿಸಿ.' } }
  ],
  crop: [
    { id: 'nursery-mgmt', title: { EN: 'Nursery Management', HI: 'नर्सरी प्रबंधन', KN: 'ಸಸಿಮಡಿ ನಿರ್ವಹಣೆ' }, desc: { EN: 'Raising healthy seedlings for transplanting.', HI: 'प्रत्यारोपण के लिए स्वस्थ पौधे तैयार करना।', KN: 'ನಾಟಿ ಮಾಡಲು ಆರೋಗ್ಯಕರ ಸಸಿಗಳನ್ನು ಬೆಳೆಸುವುದು.' } },
    { id: 'spacing', title: { EN: 'Optimal Plant Spacing', HI: 'इष्टतम पौधों की दूरी', KN: 'ಸೂಕ್ತ ಸಸ್ಯಗಳ ಅಂತರ' }, desc: { EN: 'Maximize yield with correct spacing.', HI: 'सही दूरी के साथ पैदावार को अधिकतम करें।', KN: 'ಸರಿಯಾದ ಅಂತರದೊಂದಿಗೆ ಇಳುವರಿಯನ್ನು ಹೆಚ್ಚಿಸಿ.' } },
    { id: 'pruning', title: { EN: 'Pruning Techniques', HI: 'छंटाई तकनीक', KN: 'ಸವರುವ ತಂತ್ರಗಳು' }, desc: { EN: 'Improving fruit quality through pruning.', HI: 'छंटाई के माध्यम से फलों की गुणवत्ता में सुधार।', KN: 'ಸವರುವಿಕೆಯ ಮೂಲಕ ಹಣ್ಣಿನ ಗುಣಮಟ್ಟವನ್ನು ಸುಧಾರಿಸುವುದು.' } },
    { id: 'post-harvest', title: { EN: 'Post-Harvest Handling', HI: 'कटाई के बाद प्रबंधन', KN: 'ಕೊಯ್ಲಿನ ನಂತರದ ನಿರ್ವಹಣೆ' }, desc: { EN: 'Reduce losses after harvesting crops.', HI: 'फसल काटने के बाद होने वाले नुकसान को कम करें।', KN: 'ಬೆಳೆ ಕೊಯ್ಲಿನ ನಂತರದ ನಷ್ಟವನ್ನು ಕಡಿಮೆ ಮಾಡಿ.' } },
    { id: 'inter-cropping', title: { EN: 'Intercropping Benefits', HI: 'अंतःफसल के लाभ', KN: 'ಮಿಶ್ರ ಬೆಳೆಯ ಪ್ರಯೋಜನಗಳು' }, desc: { EN: 'Growing two crops together for more profit.', HI: 'अधिक लाभ के लिए दो फसलें एक साथ उगाना।', KN: 'ಹೆಚ್ಚಿನ ಲಾಭಕ್ಕಾಗಿ ಎರಡು ಬೆಳೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಬೆಳೆಸುವುದು.' } }
  ],
  pest: [
    { id: 'biological-control', title: { EN: 'Biological Pest Control', HI: 'जैविक कीट नियंत्रण', KN: 'ಜೈವಿಕ ಕೀಟ ನಿಯಂತ್ರಣ' }, desc: { EN: 'Using nature to fight harmful pests.', HI: 'हानिकारक कीटों से लड़ने के लिए प्रकृति का उपयोग करना।', KN: 'ಹಾನಿಕಾರಕ ಕೀಟಗಳ ವಿರುದ್ಧ ಹೋರಾಡಲು ಪ್ರಕೃತಿಯನ್ನು ಬಳಸುವುದು.' } },
    { id: 'neem-spray', title: { EN: 'Homemade Neem Spray', HI: 'घर का बना नीम स्प्रे', KN: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ಬೇವಿನ ಸಿಂಪಡಣೆ' }, desc: { EN: 'Natural pesticide from neem seeds/leaves.', HI: 'नीम के बीज/पत्तियों से प्राकृतिक कीटनाशक।', KN: 'ಬೇವಿನ ಬೀಜ/ಎಲೆಗಳಿಂದ ನೈಸರ್ಗಿಕ ಕೀಟನಾಶಕ.' } },
    { id: 'trap-crops', title: { EN: 'Setting Trap Crops', HI: 'ट्रैप फसलें लगाना', KN: 'ಟ್ರ್ಯಾಪ್ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಸುವುದು' }, desc: { EN: 'Using secondary crops to attract pests.', HI: 'कीटों को आकर्षित करने के लिए माध्यमिक फसलों का उपयोग करना।', KN: 'ಕೀಟಗಳನ್ನು ಆಕರ್ಷಿಸಲು ಪರ್ಯಾಯ ಬೆಳೆಗಳನ್ನು ಬಳಸುವುದು.' } },
    { id: 'pheromones', title: { EN: 'Pheromone Traps', HI: 'फेरोमोन ट्रैप', KN: 'ಫೆರೋಮೋನ್ ಟ್ರ್ಯಾಪ್‌ಗಳು' }, desc: { EN: 'Eco-friendly way to trap male insects.', HI: 'नर कीड़ों को फँसाने का पर्यावरण अनुकूल तरीका।', KN: 'ಗಂಡು ಕೀಟಗಳನ್ನು ಹಿಡಿಯಲು ಪರಿಸರ ಸ್ನೇಹಿ ಮಾರ್ಗ.' } },
    { id: 'light-traps', title: { EN: 'Solar Light Traps', HI: 'सोलर लाइट ट्रैप', KN: 'ಸೌರ ಬೆಳಕಿನ ಟ್ರ್ಯಾಪ್‌ಗಳು' }, desc: { EN: 'Attracting nocturnal pests with light.', HI: 'प्रकाश से रात के कीटों को आकर्षित करना।', KN: 'ಬೆಳಕಿನೊಂದಿಗೆ ರಾತ್ರಿ ಕೀಟಗಳನ್ನು ಆಕರ್ಷಿಸುವುದು.' } }
  ],
  irrigation: [
    { id: 'drip-irrigation', title: { EN: 'Drip Irrigation', HI: 'ड्रिप सिंचाई', KN: 'ಹನಿ ನೀರಾವರಿ' }, desc: { EN: 'Precise water delivery to roots.', HI: 'जड़ों तक सटीक पानी पहुंचाना।', KN: 'ಬೇರುಗಳಿಗೆ ನಿಖರವಾದ ನೀರು ಸರಬರಾಜು.' } },
    { id: 'sprinkler-mgmt', title: { EN: 'Sprinkler Systems', HI: 'छिड़काव प्रणाली', KN: 'ತುಂತುರು ನೀರಾವರಿ' }, desc: { EN: 'Effective overhead watering.', HI: 'प्रभावी ओवरहेด सिंचाई।', KN: 'ಪರಿಣಾಮಕಾರಿ ಮೇಲಿನಿಂದ ನೀರು ಹರಿಸುವ ವಿಧಾನ.' } },
    { id: 'mulch-water', title: { EN: 'Watering with Mulch', HI: 'मल्च के साथ सिंचाई', KN: 'ಮಲ್ಚ್‌ನೊಂದಿಗೆ ನೀರುಣಿಸುವುದು' }, desc: { EN: 'How mulching saves 50% water.', HI: 'मल्चिंग कैसे 50% पानी बचाता है।', KN: 'ಮಲ್ಚಿಂಗ್ ಹೇಗೆ ಶೇ.50 ರಷ್ಟು ನೀರನ್ನು ಉಳಿಸುತ್ತದೆ.' } },
    { id: 'rainwater-harvest', title: { EN: 'Rainwater Harvesting', HI: 'वर्षा जल संचयन', KN: 'ಮಳೆನೀರು ಕೊಯ್ಲು' }, desc: { EN: 'Collecting rain for dry seasons.', HI: 'शुष्क मौसम के लिए बारिश का पानी इकट्ठा करना।', KN: 'ಬರಗಾಲಕ್ಕಾಗಿ ಮಳೆನೀರನ್ನು ಸಂಗ್ರಹಿಸುವುದು.' } },
    { id: 'deficit-irrigation', title: { EN: 'Deficit Irrigation', HI: 'न्यूनतम सिंचाई', KN: 'ಕೊರತೆ ನೀರಾವರಿ' }, desc: { EN: 'Saving water during critical stages.', HI: 'महत्वपूर्ण चरणों के दौरान पानी बचाना।', KN: 'ನಿರ್ಣಾಯಕ ಹಂತಗಳಲ್ಲಿ ನೀರನ್ನು ಉಳಿಸುವುದು.' } }
  ],
  fertilizer: [
    { id: 'organic-fertilizers', title: { EN: 'Organic Fertilizers', HI: 'जैविक उर्वरक', KN: 'ಸಾವಯವ ಗೊಬ್ಬರಗಳು' }, desc: { EN: 'Natural ways to feed your soil.', HI: 'मिट्टी को पोषण देने के प्राकृतिक तरीके।', KN: 'ಮಣ್ಣಿಗೆ ಪೋಷಕಾಂಶ ನೀಡುವ ನೈಸರ್ಗಿಕ ವಿಧಾನಗಳು.' } },
    { id: 'foliar-feeding', title: { EN: 'Foliar Feeding', HI: 'पर्णीय पोषण', KN: 'ಎಲೆಗಳಿಗೆ ಪೋಷಕಾಂಶ ನೀಡುವುದು' }, desc: { EN: 'Applying nutrients directly to leaves.', HI: 'पोषक तत्वों को सीधे पत्तियों पर लगाना।', KN: 'ಎಲೆಗಳಿಗೆ ನೇರವಾಗಿ ಪೋಷಕಾಂಶಗಳನ್ನು ಸಿಂಪಡಿಸುವುದು.' } },
    { id: 'green-manure', title: { EN: 'Green Manuring', HI: 'हरी खाद', KN: 'ಹಸಿರು ಗೊಬ್ಬರ' }, desc: { EN: 'Growing crops to enrich soil.', HI: 'मिट्टी को समृद्ध करने के लिए फसलें उगाना।', KN: 'ಮಣ್ಣನ್ನು ಫಲವತ್ತಾಗಿಸಲು ಬೆಳೆಗಳನ್ನು ಬೆಳೆಸುವುದು.' } },
    { id: 'bio-fertilizers', title: { EN: 'Bio-Fertilizers', HI: 'जैव उर्वरक', KN: 'ಜೈವಿಕ ಗೊಬ್ಬರಗಳು' }, desc: { EN: 'Using bacteria to fix nitrogen.', HI: 'नाइट्रोजन स्थिरीकरण के लिए बैक्टीरिया का उपयोग।', KN: 'ಸಾರಜನಕ ಸ್ಥಿರೀಕರಣಕ್ಕೆ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳ ಬಳಕೆ.' } },
    { id: 'fertigation', title: { EN: 'Fertigation Basics', HI: 'फर्टिगेशन की बुनियादी बातें', KN: 'ಫರ್ಟಿಗೇಷನ್ ಮೂಲಭೂತ ಅಂಶಗಳು' }, desc: { EN: 'Applying fertilizer through drip.', HI: 'ड्रिप के माध्यम से उर्वरक लगाना।', KN: 'ಹನಿ ನೀರಾವರಿ ಮೂಲಕ ಗೊಬ್ಬರ ನೀಡುವುದು.' } }
  ],
  animal: [
    { id: 'dairy-mgmt', title: { EN: 'Dairy Management', HI: 'डेयरी प्रबंधन', KN: 'ಹೈನುಗಾರಿಕೆ ನಿರ್ವಹಣೆ' }, desc: { EN: 'Tips for high milk yield.', HI: 'अधिक दूध उत्पादन के लिए टिप्स।', KN: 'ಹೆಚ್ಚಿನ ಹಾಲು ಉತ್ಪಾದನೆಗೆ ಸಲಹೆಗಳು.' } },
    { id: 'poultry-care', title: { EN: 'Poultry Care', HI: 'पोल्ट्री देखभाल', KN: 'ಕೋಳಿ ಸಾಕಣೆ ಆರೈಕೆ' }, desc: { EN: 'Raising healthy chickens.', HI: 'स्वस्थ मुर्गियां पालना।', KN: 'ಆರೋಗ್ಯಕರ ಕೋಳಿಗಳನ್ನು ಬೆಳೆಸುವುದು.' } },
    { id: 'fodder-crops', title: { EN: 'Fodder Crops', HI: 'चारा फसलें', KN: 'ಮೇವು ಬೆಳೆಗಳು' }, desc: { EN: 'Nutritious food for livestock.', HI: 'पशुओं के लिए पौष्टिक आहार।', KN: 'ಜಾನುವಾರುಗಳಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ.' } },
    { id: 'disease-prev', title: { EN: 'Disease Prevention', HI: 'रोग की रोकथाम', KN: 'ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ' }, desc: { EN: 'Keeping animals infection-free.', HI: 'जानवरों को संक्रमण मुक्त रखना।', KN: 'ಪ್ರಾಣಿಗಳನ್ನು ಸೋಂಕಿನಿಂದ ಮುಕ್ತವಾಗಿಡುವುದು.' } },
    { id: 'apiary', title: { EN: 'Beekeeping Basics', HI: 'मधुमक्खी पालन', KN: 'ಜೇನು ಸಾಕಣೆ ಮೂಲಭೂತ ಅಂಶಗಳು' }, desc: { EN: 'Honey production and pollination.', HI: 'शहद उत्पादन और परागण।', KN: 'ಜೇನುತುಪ್ಪ ಉತ್ಪಾದನೆ ಮತ್ತು ಪರಾಗಸ್ಪರ್ಶ.' } }
  ],
  weather: [
    { id: 'monsoon-prep', title: { EN: 'Monsoon Preparation', HI: 'मानसून की तैयारी', KN: 'ಮುಂಗಾರು ಸಿದ್ಧತೆ' }, desc: { EN: 'Farming during heavy rains.', HI: 'भारी बारिश के दौरान खेती।', KN: 'ಭಾರೀ ಮಳೆಯ ಸಮಯದಲ್ಲಿ ಕೃಷಿ.' } },
    { id: 'drought-mgmt', title: { EN: 'Drought Management', HI: 'सूखा प्रबंधन', KN: 'ಬರ ನಿರ್ವಹಣೆ' }, desc: { EN: 'Saving crops in low water.', HI: 'कम पानी में फसलें बचाना।', KN: 'ಕಡಿಮೆ ನೀರಿನಲ್ಲಿ ಬೆಳೆಗಳನ್ನು ಉಳಿಸುವುದು.' } },
    { id: 'frost-protection', title: { EN: 'Frost Protection', HI: 'पाले से सुरक्षा', KN: 'ಮಂಜಿನಿಂದ ರಕ್ಷಣೆ' }, desc: { EN: 'Protecting winter crops.', HI: 'शीतकालीन फसलों की सुरक्षा।', KN: 'ಚಳಿಗಾಲದ ಬೆಳೆಗಳ ರಕ್ಷಣೆ.' } },
    { id: 'cyclone-safety', title: { EN: 'Cyclone Safety', HI: 'चक्रवात सुरक्षा', KN: 'ಚಂಡಮಾರುತ ಸುರಕ್ಷಿತೆ' }, desc: { EN: 'Preparing for wind damage.', HI: 'हवा से होने वाले नुकसान की तैयारी।', KN: 'ಗಾಳಿಯ ಹಾನಿಯಿಂದ ರಕ್ಷಣೆ ಪಡೆಯುವುದು.' } },
    { id: 'climate-smart', title: { EN: 'Climate-Smart Farming', HI: 'जलवायु-अनुकूल खेती', KN: 'ಹವಾಮಾನ ಸ್ನೇಹಿ ಕೃಷಿ' }, desc: { EN: 'Adapting to changing weather.', HI: 'बदलते मौसम के अनुकूल ढलना।', KN: 'ಬದಲಾಗುತ್ತಿರುವ ಹವಾಮಾನಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವುದು.' } }
  ],
  seeds: [
    { id: 'seed-treatment', title: { EN: 'Seed Treatment', HI: 'बीज उपचार', KN: 'ಬೀಜೋಪಚಾರ' }, desc: { EN: 'Protecting seeds before sowing.', HI: 'बुवाई से पहले बीजों की सुरक्षा।', KN: 'ಬಿತ್ತುವ ಮೊದಲು ಬೀಜಗಳ ರಕ್ಷಣೆ.' } },
    { id: 'germination-test', title: { EN: 'Germination Testing', HI: 'अंकुरण परीक्षण', KN: 'ಮೊಳಕೆ ಪರೀಕ್ಷೆ' }, desc: { EN: 'Check seed quality at home.', HI: 'घर पर बीजों की गुणवत्ता की जांच करें।', KN: 'ಮನೆಯಲ್ಲಿ ಬೀಜದ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಿಸಿ.' } },
    { id: 'storage-tips', title: { EN: 'Seed Storage', HI: 'बीज भंडारण', KN: 'ಬೀಜ ಸಂಗ್ರಹಣೆ' }, desc: { EN: 'Keeping seeds safe for next year.', HI: 'अगले वर्ष के लिए बीजों को सुरक्षित रखना।', KN: 'ಮುಂದಿನ ವರ್ಷಕ್ಕೆ ಬೀಜಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡುವುದು.' } },
    { id: 'hybrid-vs-local', title: { EN: 'Hybrid vs Local Seeds', HI: 'हाइब्रिड बनाम स्थानीय बीज', KN: 'ಹೈಬ್ರಿಡ್ ಮತ್ತು ಸ್ಥಳೀಯ ಬೀಜಗಳು' }, desc: { EN: 'Choosing the right variety.', HI: 'सही किस्म का चुनाव।', KN: 'ಸರಿಯಾದ ತಳಿಯ ಆಯ್ಕೆ.' } },
    { id: 'seed-saving', title: { EN: 'Saving Heirloom Seeds', HI: 'विरासत बीजों का संरक्षण', KN: 'ಪಾರಂಪರಿಕ ಬೀಜಗಳ ಉಳಿಸುವಿಕೆ' }, desc: { EN: 'Preserving traditional varieties.', HI: 'पारंपरिक किस्मों का संरक्षण।', KN: 'ಸಾಂಪ್ರದಾಯಿಕ ತಳಿಗಳ ಸಂರಕ್ಷಣೆ.' } }
  ]
};

const TOPIC_CONTENT: Record<string, any> = {
  // --- SOIL HEALTH ---
  'ph-levels': {
    title: { EN: 'Understanding Soil pH', HI: 'मिट्टी के पीएच को समझना', KN: 'ಮಣ್ಣಿನ pH ಅನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು' },
    points: {
      EN: ['pH measures how acidic or alkaline your soil is.', 'Most crops prefer a pH between 6.0 and 7.0.', 'Wrong pH stops roots from absorbing nutrients.'],
      HI: ['पीएच मापता है कि आपकी मिट्टी कितनी अम्लीय या क्षारीय है।', 'ज्यादातर फसलें 6.0 और 7.0 के बीच पीएच पसंद करती हैं।', 'गलत पीएच जड़ों को पोषक तत्वों को अवशोषित करने से रोकता है।'],
      KN: ['ಮಣ್ಣು ಎಷ್ಟು ಆಮ್ಲೀಯ ಅಥವಾ ಕ್ಷಾರೀಯವಾಗಿದೆ ಎಂಬುದನ್ನು pH ಅಳೆಯುತ್ತದೆ.', 'ಹೆಚ್ಚಿನ ಬೆಳೆಗಳು 6.0 ಮತ್ತು 7.0 ರ ನಡುವಿನ pH ಅನ್ನು ಬಯಸುತ್ತವೆ.', 'ತಪ್ಪು pH ಬೇರುಗಳು ಪೋಷಕಾಂಶಗಳನ್ನು ಹೀರಿಕೊಳ್ಳುವುದನ್ನು ತಡೆಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: If tomato leaves turn yellow, soil may be acidic. Add 2kg lime per cent of land.',
      HI: 'व्यावहारिक: यदि टमाटर के पत्ते पीले पड़ जाएं, तो मिट्टी अम्लीय हो सकती है। प्रति सेंट 2 किलो चूना मिलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಟೊಮೆಟೊ ಎಲೆಗಳು ಹಳದಿಯಾದರೆ, ಮಣ್ಣು ಆಮ್ಲೀಯವಾಗಿರಬಹುದು. ಪ್ರತಿ ಸೆಂಟ್ ಭೂಮಿಗೆ 2 ಕೆಜಿ ಸುಣ್ಣ ಸೇರಿಸಿ.'
    },
    tip: { EN: 'Test soil after rain for accuracy.', HI: 'सटीकता के लिए बारिश के बाद मिट्टी का परीक्षण करें।', KN: 'ನಿಖರತೆಗಾಗಿ ಮಳೆಯ ನಂತರ ಮಣ್ಣನ್ನು ಪರೀಕ್ಷಿಸಿ.' }
  },
  'composting': {
    title: { EN: 'Making Organic Compost', HI: 'जैविक खाद बनाना', KN: 'ಸಾವಯವ ಗೊಬ್ಬರ ತಯಾರಿಕೆ' },
    points: {
      EN: ['Mix green waste with brown waste.', 'Keep the pit moist but not soaking.', 'Turn the pile every 15 days for air.'],
      HI: ['हरे कचरे को भूरे कचरे के साथ मिलाएं।', 'गड्ढे को नम रखें लेकिन बहुत गीला नहीं।', 'हवा के लिए हर 15 दिनों में ढेर को पलटें।'],
      KN: ['ಹಸಿರು ತ್ಯಾಜ್ಯವನ್ನು ಒಣ ತ್ಯಾಜ್ಯದೊಂದಿಗೆ ಬೆರೆಸಿ.', 'ಗುಂಡಿಯನ್ನು ತೇವವಾಗಿಡಿ ಆದರೆ ಅತಿಯಾದ ನೀರು ಬೇಡ.', 'ಗಾಳಿಯಾಡಲು ಪ್ರತಿ 15 ದಿನಕ್ಕೊಮ್ಮೆ ಮಿಶ್ರಣವನ್ನು ಕಲಕಿ.']
    },
    example: {
      EN: 'Practical: Layer cow dung, grass, and kitchen waste in a 3ft pit. Black gold soil in 3 months.',
      HI: 'व्यावहारिक: 3 फीट के गड्ढे में गोबर, घास और रसोई का कचरा बिछाएं। 3 महीने में काली सोना मिट्टी तैयार।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 3 ಅಡಿ ಗುಂಡಿಯಲ್ಲಿ ಸಗಣಿ, ಹುಲ್ಲು ಮತ್ತು ಕಸವನ್ನು ಹಾಕಿ. 3 ತಿಂಗಳಲ್ಲಿ ಗೊಬ್ಬರ ಸಿದ್ಧ.'
    },
    tip: { EN: 'Add jaggery water to speed up decay.', HI: 'अपघटन तेज करने के लिए गुड़ का पानी डालें।', KN: 'ಕೊಳೆಯುವಿಕೆ ವೇಗಗೊಳಿಸಲು ಬೆಲ್ಲದ ನೀರು ಸೇರಿಸಿ.' }
  },
  'soil-testing': {
    title: { EN: 'Soil Testing Guide', HI: 'मिट्टी परीक्षण गाइड', KN: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾರ್ಗದರ್ಶಿ' },
    points: {
      EN: ['Collect soil 15cm deep in "V" shape.', 'Mix samples from 10 different spots.', 'Dry in shade before laboratory test.'],
      HI: ['"V" आकार में 15 सेमी गहरी मिट्टी इकट्ठा करें।', '10 अलग-अलग जगहों के नमूनों को मिलाएं।', 'प्रयोगशाला परीक्षण से पहले छाया में सुखाएं।'],
      KN: ['"V" ಆಕಾರದಲ್ಲಿ 15 ಸೆಂ.ಮೀ ಆಳದ ಮಣ್ಣನ್ನು ಸಂಗ್ರಹಿಸಿ.', '10 ವಿವಿಧ ಸ್ಥಳಗಳ ಮಾದರಿಗಳನ್ನು ಮಿಶ್ರಣ ಮಾಡಿ.', 'ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗೆ ಮೊದಲು ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ.']
    },
    example: {
      EN: 'Practical: Test soil every 2-3 years or before changing major crops.',
      HI: 'व्यावहारिक: हर 2-3 साल में या बड़ी फसलें बदलने से पहले मिट्टी का परीक्षण करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಪ್ರತಿ 2-3 ವರ್ಷಕ್ಕೊಮ್ಮೆ ಅಥವಾ ಹೊಸ ಬೆಳೆ ಬೆಳೆಯುವ ಮುನ್ನ ಮಣ್ಣು ಪರೀಕ್ಷಿಸಿ.'
    },
    tip: { EN: 'Avoid sampling near fence or manure pits.', HI: 'बाड़ या खाद के गड्ढों के पास से नमूने लेने से बचें।', KN: 'ಬೇಲಿ ಅಥವಾ ಗೊಬ್ಬರದ ಗುಂಡಿ ಹತ್ತಿರದ ಮಣ್ಣು ಬೇಡ.' }
  },
  'mulching': {
    title: { EN: 'Benefits of Mulching', HI: 'मल्चिंग के लाभ', KN: 'ಮಲ್ಚಿಂಗ್‌ನ ಪ್ರಯೋಜನಗಳು' },
    points: {
      EN: ['Reduces evaporation by 50%.', 'Controls weed growth.', 'Improves organic matter as it decays.'],
      HI: ['वाष्पीकरण को 50% तक कम करता है।', 'खरपतवारों की वृद्धि को नियंत्रित करता है।', 'सड़ने पर कार्बनिक पदार्थों में सुधार करता है।'],
      KN: ['ನೀರು ಆವಿಯಾಗುವುದನ್ನು ಶೇ. 50 ರಷ್ಟು ತಡೆಯುತ್ತದೆ.', 'ಕಳೆಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.', 'ಕೊಳೆತಂತೆ ಮಣ್ಣಿನ ಸತ್ವ ಹೆಚ್ಚಿಸುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Use coconut fronds or straw to cover ginger or turmeric beds.',
      HI: 'व्यावहारिक: अदरक या हल्दी की क्यारियों को ढकने के लिए नारियल के पत्तों या पुआल का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಶುಂಠಿ ಅಥವಾ ಅರಿಶಿನದ ಪಾತಿಗಳನ್ನು ತೆಂಗಿನ ಗರಿ ಅಥವಾ ಹುಲ್ಲಿನಿಂದ ಮುಚ್ಚಿ.'
    },
    tip: { EN: 'Termites might attack dry straw; use neem spray.', HI: 'दीमक सूखे पुआल पर हमला कर सकते हैं; नीम स्प्रे का उपयोग करें।', KN: 'ಒಣ ಹುಲ್ಲಿಗೆ ಗೆದ್ದಲು ಬರದಂತೆ ಬೇವಿನ ನೀರು ಸಿಂಪಡಿಸಿ.' }
  },
  'crop-rotation': {
    title: { EN: 'Crop Rotation', HI: 'फसल चक्र', KN: 'ಬೆಳೆ ಸರದಿ' },
    points: {
      EN: ['Rotate legumes with grains.', 'Deep roots followed by shallow roots.', 'Avoid same family crops consecutively.'],
      HI: ['अनाज के साथ दलहन का चक्र अपनाएं।', 'गहरी जड़ों के बाद उथली जड़ों वाली फसलें।', 'एक ही परिवार की फसलों को लगातार न लगाएं।'],
      KN: ['ದ್ವಿದಳ ಧಾನ್ಯಗಳ ನಂತರ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆಯಿರಿ.', 'ಆಳವಾದ ಬೇರಿನ ನಂತರ ಮೇಲ್ಮೈ ಬೇರಿನ ಬೆಳೆ ಬೆಳೆಯಿರಿ.', 'ಒಂದೇ ಜಾತಿಗೆ ಸೇರಿದ ಬೆಳೆಗಳನ್ನು ಪದೇ ಪದೇ ಬೆಳೆಯಬೇಡಿ.']
    },
    example: {
      EN: 'Practical: Follow Rice with Black gram to fix nitrogen naturally.',
      HI: 'व्यावहारिक: प्राकृतिक रूप से नाइट्रोजन स्थिर करने के लिए चावल के बाद उड़द लगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಸಾರಜನಕ ಹೆಚ್ಚಿಸಲು ಭತ್ತದ ನಂತರ ಉದ್ದು ಬೆಳೆಯಿರಿ.'
    },
    tip: { EN: 'Reduces pesticide need by breaking life cycles.', HI: 'जीवन चक्र को तोड़कर कीटनाशकों की आवश्यकता को कम करता है।', KN: 'ರೋಗದ ಹರಡುವಿಕೆ ತಡೆಯಲು ಇದು ಉತ್ತಮ ಮಾರ್ಗ.' }
  },

  // --- CROP MANAGEMENT ---
  'nursery-mgmt': {
    title: { EN: 'Nursery Management', HI: 'नर्सरी प्रबंधन', KN: 'ಸಸಿಮಡಿ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Use raised beds (10-15cm).', 'Partial shade for young seedlings.', 'Regular sorting for healthy growth.'],
      HI: ['उठी हुई क्यारियों (10-15 सेमी) का उपयोग करें।', 'छोटे पौधों के लिए आंशिक छाया।', 'स्वस्थ विकास के लिए नियमित छंटाई।'],
      KN: ['ಎತ್ತರಿಸಿದ ಪಾತಿಗಳನ್ನು ಬಳಸಿ (10-15 ಸೆಂ.ಮೀ).', 'ಎಳೆ ಸಸಿಗಳಿಗೆ ಅಲ್ಪ ನೆರಳು ನೀಡಿ.', 'ಆರೋಗ್ಯಕರ ಬೆಳವಣಿಗೆಗಾಗಿ ನಿಯಮಿತ ನಿಗಾ ವಹಿಸಿ.']
    },
    example: {
      EN: 'Practical: Pro-trays save space and water for vegetable nurseries.',
      HI: 'व्यावहारिक: प्रो-ट्रे सब्जियों की नर्सरी के लिए जगह और पानी बचाते हैं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ತರಕಾರಿ ಸಸಿಗಳಿಗೆ ಪ್ರೊ-ಟ್ರೇ ಬಳಸುವುದು ಉತ್ತಮ.'
    },
    tip: { EN: 'Avoid overhead watering in evening to prevent rot.', HI: 'सड़न रोकने के लिए शाम को ऊपर से पानी देने से बचें।', KN: 'ಸಸಿ ಕೊಳೆಯದಂತೆ ಸಂಜೆ ಹೊತ್ತು ಮೇಲಿನಿಂದ ನೀರು ಹಾಕಬೇಡಿ.' }
  },
  'spacing': {
    title: { EN: 'Optimal Plant Spacing', HI: 'पौधों की दूरी', KN: 'ಸೂಕ್ತ ಸಸ್ಯಗಳ ಅಂತರ' },
    points: {
      EN: ['Prevents nutrient competition.', 'Ensures air circulation.', 'Makes harvesting and weeding easier.'],
      HI: ['पोषक तत्वों की प्रतिस्पर्धा को रोकता है।', 'हवा का संचार सुनिश्चित करता है।', 'कटाई और निराई को आसान बनाता है।'],
      KN: ['ಪೋಷಕಾಂಶಗಳ ಪೈಪೋಟಿ ತಡೆಯುತ್ತದೆ.', 'ಗಾಳಿಯಾಡಲು ಅನುವು ಮಾಡಿಕೊಡುತ್ತದೆ.', 'ಕೊಯ್ಲು ಮತ್ತು ಕಳೆ ತೆಗೆಯಲು ಸುಲಭವಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: 60cm x 60cm for Hybrid Tomatoes.',
      HI: 'व्यावहारिक: हाइब्रिड टमाटर के लिए 60 सेमी x 60 सेमी।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಹೈಬ್ರಿಡ್ ಟೊಮೆಟೊಗೆ 60ಸೆಂ.ಮೀ x 60ಸೆಂ.ಮೀ ಅಂತರ ಇರಲಿ.'
    },
    tip: { EN: 'Dense spacing in summer helps retain soil moisture.', HI: 'गर्मियों में घनी दूरी मिट्टी की नमी बनाए रखने में मदद करती है।', KN: 'ಬೇಸಿಗೆಯಲ್ಲಿ ಹತ್ತಿರದಲ್ಲಿ ಬೆಳೆ ಬೆಳೆಯುವುದು ತೇವಾಂಶ ಉಳಿಸಲು ಸಹಕಾರಿ.' }
  },
  'pruning': {
    title: { EN: 'Pruning Techniques', HI: 'छंटाई तकनीक', KN: 'ಸವರುವ ತಂತ್ರಗಳು' },
    points: {
      EN: ['Remove dead or diseased branches.', 'Allows sunlight inside canopy.', 'Stimulates fruit production.'],
      HI: ['मृत या रोगग्रस्त शाखाओं को हटा दें।', 'धूप को अंदर तक पहुँचने देता है।', 'फलों के उत्पादन को उत्तेजित करता है।'],
      KN: ['ಒಣಗಿದ ಅಥವಾ ರೋಗಗ್ರಸ್ತ ರೆಂಬೆಗಳನ್ನು ತೆಗೆಯಿರಿ.', 'ಗಿಡದ ಒಳಭಾಗಕ್ಕೆ ಬಿಸಿಲು ಬೀಳುವಂತೆ ಮಾಡುತ್ತದೆ.', 'ಹೆಚ್ಚು ಹಣ್ಣು ಬಿಡಲು ಸಹಕಾರಿ.']
    },
    example: {
      EN: 'Practical: Prune Pomegranate after harvest to encourage new growth.',
      HI: 'व्यावहारिक: नई वृद्धि को प्रोत्साहित करने के लिए कटाई के बाद अनार की छंटाई करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ದಾಳಿಂಬೆ ಕೊಯ್ಲಿನ ನಂತರ ರೆಂಬೆಗಳನ್ನು ಸವರಿದರೆ ಹೊಸ ಚಿಗುರು ಬರುತ್ತದೆ.'
    },
    tip: { EN: 'Sterilize cutters to avoid spreading diseases.', HI: 'रोगों को फैलने से बचाने के लिए कटर को कीटाणुरहित करें।', KN: 'ರೋಗ ಹರಡದಂತೆ ಕತ್ತರಿಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.' }
  },
  'post-harvest': {
    title: { EN: 'Post-Harvest Handling', HI: 'कटाई के बाद प्रबंधन', KN: 'ಕೊಯ್ಲಿನ ನಂತರದ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Clean crops from soil and dust.', 'Sort based on size and quality.', 'Store in cool, well-ventilated space.'],
      HI: ['फसलों को मिट्टी और धूल से साफ करें।', 'आकार और गुणवत्ता के आधार पर छाँटें।', 'ठंडी, अच्छी हवादार जगह में स्टोर करें।'],
      KN: ['ಬೆಳೆಗಳಿಂದ ಮಣ್ಣು ಮತ್ತು ಧೂಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.', 'ಗಾತ್ರ ಮತ್ತು ಗುಣಮಟ್ಟಕ್ಕೆ ಅನುಗುಣವಾಗಿ ವಿಂಗಡಿಸಿ.', 'ತಂಪಾದ, ಗಾಳಿಯಾಡುವ ಜಾಗದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.']
    },
    example: {
      EN: 'Practical: Pre-cool fruits like Mangoes to increase shelf life.',
      HI: 'व्यावहारिक: शेल्फ लाइफ बढ़ाने के लिए आम जैसे फलों को प्री-कूल करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಹಣ್ಣುಗಳು ಬೇಗ ಕೆಡದಂತೆ ಮಾವಿನ ಹಣ್ಣುಗಳನ್ನು ತಂಪು ಮಾಡಿ.'
    },
    tip: { EN: 'Handle gently to avoid bruising.', HI: 'चोट से बचने के लिए सावधानी से संभालें।', KN: 'ಹಣ್ಣುಗಳಿಗೆ ಪೆಟ್ಟಾಗದಂತೆ ಎಚ್ಚರಿಕೆಯಿಂದ ನಿರ್ವಹಿಸಿ.' }
  },
  'inter-cropping': {
    title: { EN: 'Intercropping', HI: 'अंतःफसल', KN: 'ಮಿಶ್ರ ಬೆಳೆ' },
    points: {
      EN: ['Better land utilization.', 'Insurance against primary crop failure.', 'Reduces weed and pest spread.'],
      HI: ['भूमि का बेहतर उपयोग।', 'मुख्य फसल की विफलता के खिलाफ बीमा।', 'खरपतवार और कीटों के प्रसार को कम करता है।'],
      KN: ['ಭೂಮಿಯ ಸದ್ಬಳಕೆಯಾಗುತ್ತದೆ.', 'ಮುಖ್ಯ ಬೆಳೆ ನಷ್ಟವಾದರೆ ಇದು ಆಸರೆಯಾಗುತ್ತದೆ.', 'ಕಳೆ ಮತ್ತು ಕೀಟಗಳ ಹಾವಳಿ ಕಡಿಮೆಯಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Grow Marigold between Chillies to repel nematodes.',
      HI: 'व्यावहारिक: नेमाटोड को दूर भगाने के लिए मिर्च के बीच गेंदा उगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಕೀಟಗಳನ್ನು ದೂರವಿಡಲು ಮೆಣಸಿನಕಾಯಿ ನಡುವೆ ಚೆಂಡುಹೂ ಬೆಳೆಯಿರಿ.'
    },
    tip: { EN: 'Choose crops that don\'t compete for same nutrients.', HI: 'ऐसी फसलें चुनें जो एक ही पोषक तत्वों के लिए प्रतिस्पर्धा न करें।', KN: 'ಒಂದೇ ರೀತಿಯ ಪೋಷಕಾಂಶ ಬಳಸದ ಬೆಳೆಗಳನ್ನು ಆರಿಸಿ.' }
  },

  // --- PEST CONTROL ---
  'biological-control': {
    title: { EN: 'Biological Control', HI: 'जैविक नियंत्रण', KN: 'ಜೈವಿಕ ನಿಯಂತ್ರಣ' },
    points: {
      EN: ['Use ladybugs for aphids.', 'Trichogramma for sugarcane borers.', 'Conserves natural ecosystem.'],
      HI: ['एफिड्स के लिए लेडीबग्स का उपयोग करें।', 'गन्ने के छेदकों के लिए ट्राइकोगामा।', 'प्राकृतिक पारिस्थितिकी तंत्र का संरक्षण करता है।'],
      KN: ['ನುಸಿಗಳಿಗೆ ಲೇಡಿಬಗ್ ಬಳಸಿ.', 'ಕಬ್ಬಿನ ಹುಳುಗಳಿಗೆ ಟ್ರೈಕೋಗ್ರಾಮಾ ಬಳಸಿ.', 'ಪರಿಸರಕ್ಕೆ ಯಾವುದೇ ಹಾನಿಯಾಗುವುದಿಲ್ಲ.']
    },
    example: {
      EN: 'Practical: Release 1.5 lakh Trichogramma cards per hectare.',
      HI: 'व्यावहारिक: प्रति हेक्टेयर 1.5 लाख ट्राइकोगामा कार्ड छोड़ें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ 1.5 ಲಕ್ಷ ಟ್ರೈಕೋಗ್ರಾಮಾ ಕಾರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿ.'
    },
    tip: { EN: 'Don\'t spray chemicals after releasing biocontrol agents.', HI: 'जैविक नियंत्रण एजेंटों को छोड़ने के बाद रसायनों का छिड़काव न करें।', KN: 'ಜೈವಿಕ ನಿಯಂತ್ರಕಗಳನ್ನು ಬಳಸಿದ ನಂತರ ಕ್ರಿಮಿನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ.' }
  },
  'neem-spray': {
    title: { EN: 'Neem Spray', HI: 'नीम स्प्रे', KN: 'ಬೇವಿನ ಸಿಂಪಡಣೆ' },
    points: {
      EN: ['Safe for humans and pets.', 'Repels over 200 pest species.', 'Easy to make at home.'],
      HI: ['मनुष्यों और पालतू जानवरों के लिए सुरक्षित।', '200 से अधिक कीट प्रजातियों को दूर भगाता है।', 'घर पर बनाना आसान।'],
      KN: ['ಮನುಷ್ಯರು ಮತ್ತು ಪ್ರಾಣಿಗಳಿಗೆ ಸುರಕ್ಷಿತ.', '200 ಕ್ಕೂ ಹೆಚ್ಚು ಕೀಟಗಳನ್ನು ದೂರವಿಡುತ್ತದೆ.', 'ಮನೆಯಲ್ಲೇ ತಯಾರಿಸುವುದು ಸುಲಭ.']
    },
    example: {
      EN: 'Practical: Mix 5ml Neem oil + 1ml soap in 1L water.',
      HI: 'व्यावहारिक: 1 लीटर पानी में 5 मिली नीम का तेल + 1 मिली साबुन मिलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 1 ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಮತ್ತು 1 ಮಿಲಿ ಸೋಪು ಬೆರೆಸಿ.'
    },
    tip: { EN: 'Spray in early morning or late evening.', HI: 'सुबह जल्दी या देर शाम को स्प्रे करें।', KN: 'ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ಹೊತ್ತು ಸಿಂಪಡಿಸಿ.' }
  },

  // --- IRRIGATION ---
  'drip-irrigation': {
    title: { EN: 'Drip Irrigation', HI: 'ड्रिप सिंचाई', KN: 'ಹನಿ ನೀರಾವರಿ' },
    points: {
      EN: ['Saves 60% water.', 'Direct water to root zone.', 'Reduces labor costs.'],
      HI: ['60% पानी बचाता है।', 'सीधा जड़ क्षेत्र तक पानी पहुँचाता है।', 'श्रम लागत कम करता है।'],
      KN: ['ಶೇ. 60 ರಷ್ಟು ನೀರು ಉಳಿಸುತ್ತದೆ.', 'ಬೇರುಗಳಿಗೆ ನೇರವಾಗಿ ನೀರು ನೀಡುತ್ತದೆ.', 'ಕೂಲಿ ವೆಚ್ಚ ಕಡಿಮೆಯಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Best for widely spaced crops like coconut, banana.',
      HI: 'व्यावहारिक: नारियल, केला जैसी व्यापक दूरी वाली फसलों के लिए सर्वोत्तम।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ತೆಂಗು, ಬಾಳೆ ಇತ್ಯಾದಿ ಬೆಳೆಗಳಿಗೆ ಇದು ಅತ್ಯುತ್ತಮ.'
    },
    tip: { EN: 'Acid wash laterals once a season to remove salts.', HI: 'लवण हटाने के लिए सीजन में एक बार लेटरल को एसिड वॉश करें।', KN: 'ಉಪ್ಪಿನಂಶ ಹೋಗಲಾಡಿಸಲು ಪೈಪ್‌ಗಳನ್ನು ಆಸಿಡ್‌ನಿಂದ ಸ್ವಚ್ಛಗೊಳಿಸಿ.' }
  },
  'rainwater-harvest': {
    title: { EN: 'Rainwater Harvesting', HI: 'वर्षा जल संचयन', KN: 'ಮಳೆನೀರು ಕೊಯ್ಲು' },
    points: {
      EN: ['Recharge borewells/wells.', 'Store in ponds for dry months.', 'Prevents soil erosion during heavy rains.'],
      HI: ['बोरवेल/कुओं को रिचार्ज करें।', 'शुष्क महीनों के लिए तालाबों में स्टोर करें।', 'भारी बारिश के दौरान मिट्टी के कटाव को रोकता है।'],
      KN: ['ಬೋರ್‌ವೆಲ್ ಅಥವಾ ಬಾವಿ ಮರುಪೂರಣ ಮಾಡಿ.', 'ಬೇಸಿಗೆಗಾಗಿ ಕೆರೆಗಳಲ್ಲಿ ನೀರು ಸಂಗ್ರಹಿಸಿ.', 'ಭಾರೀ ಮಳೆಯಿಂದ ಮಣ್ಣು ಕೊಚ್ಚಿಹೋಗದಂತೆ ತಡೆಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Direct roof water to a simple filtration pit.',
      HI: 'व्यावहारिक: छत के पानी को एक साधारण निस्पंदन गड्ढे में निर्देशित करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮನೆಯ ಮೇಲ್ಛಾವಣಿಯ ನೀರನ್ನು ಫಿಲ್ಟರ್ ಗುಂಡಿಗೆ ಹರಿಸಿರಿ.'
    },
    tip: { EN: 'Keep catchment area clean for drinking quality.', HI: 'पीने की गुणवत्ता के लिए जलग्रಹण क्षेत्र को साफ रखें।', KN: 'ನೀರು ಶುದ್ಧವಾಗಿರಲು ಮೇಲ್ಛಾವಣಿಯನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.' }
  }
};

// Add remaining topics with placeholder but descriptive content to ensure no "Empty Boxes"
const ALL_TOPIC_IDS = Object.values(TOPICS).flat().map(t => t.id);
ALL_TOPIC_IDS.forEach(id => {
  if (!TOPIC_CONTENT[id]) {
    const topicInfo = Object.values(TOPICS).flat().find(t => t.id === id);
    TOPIC_CONTENT[id] = {
      title: topicInfo.title,
      points: {
        EN: [`Key details about ${topicInfo.title.EN} are being updated.`, 'Regular monitoring is essential for success.', 'Follow local expert advice for best results.'],
        HI: [`${topicInfo.title.HI} के बारे में जानकारी अपडेट की जा रही है।`, 'सफलता के लिए नियमित निगरानी आवश्यक है।', 'सर्वोत्तम परिणामों के लिए स्थानीय विशेषज्ञों की सलाह लें।'],
        KN: [`${topicInfo.title.KN} ಬಗ್ಗೆ ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಿರುತ್ತದೆ.`, 'ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ ನಿಯಮಿತ ನಿಗಾ ವಹಿಸಿ.', 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಕೃಷಿ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.']
      },
      example: {
        EN: 'This guide is coming soon with practical field examples.',
        HI: 'यह गाइड जल्द ही व्यावहारिक उदाहरणों के साथ आ रही है।',
        KN: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಿರುತ್ತದೆ.'
      },
      tip: { EN: 'Consult KrishiX AI for instant specific queries.', HI: 'त्वरित प्रश्नों के लिए KrishiX AI से परामर्श लें।', KN: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ KrishiX AI ಸಹಾಯ ಪಡೆಯಿರಿ.' }
    };
  }
});

// --- COMPONENT ---

const UI_STRINGS = {
  knowledgeHub: { EN: 'Knowledge Hub', HI: 'ज्ञान केंद्र', KN: 'ಜ್ಞಾನ ಕೇಂದ್ರ' },
  searchPlaceholder: { EN: 'Search crops, seeds, soil tips...', HI: 'फसलें, बीज, मिट्टी के सुझाव...', KN: 'ಬೆಳೆಗಳು, ಬೀಜಗಳು, ಮಣ್ಣಿನ ಮಾಹಿತಿ...' },
  popularTopics: { EN: 'Popular Topics', HI: 'लोकप्रिय विषय', KN: 'ಜನಪ್ರಿಯ ವಿಷಯಗಳು' },
  viewGuide: { EN: 'View Guide', HI: 'गाइड देखें', KN: 'ಮಾಹಿತಿ ನೋಡಿ' },
  allCategories: { EN: 'All Categories', HI: 'सभी श्रेणियां', KN: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು' },
  back: { EN: 'Back', HI: 'पीछे', KN: 'ಹಿಂದೆ' },
  listen: { EN: 'Listen', HI: 'सुनें', KN: 'ಕೇಳಿ' },
  stop: { EN: 'Stop', HI: 'रोकें', KN: 'ನಿಲ್ಲಿಸಿ' },
  exampleLabel: { EN: 'Example Scenario', HI: 'उदाहरण', KN: 'ಉದಾಹರಣೆ' },
  proTip: { EN: 'Practical Tip', HI: 'व्यावहारिक सुझाव', KN: 'ಉಪಯುಕ್ತ ಸಲಹೆ' },
  askAi: { EN: 'Ask AI Assistant', HI: 'AI सहायक से पूछें', KN: 'AI ಸಹಾಯ ಕೇಳಿ' },
  questions: { EN: 'Still have questions?', HI: 'अभी भी सवाल हैं?', KN: 'ಇನ್ನೂ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ?' },
  clear: { EN: 'Clear', HI: 'साफ करें', KN: 'ತೆರವುಗೊಳಿಸಿ' }
};

export default function KnowledgeHub({ onBack }: { onBack?: () => void }) {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>('EN');
  const [view, setView] = useState<ViewState>('grid');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    return () => window.speechSynthesis.cancel();
  }, [lang, activeTopic]);

  const handleSpeak = (text: string) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'HI') utterance.lang = 'hi-IN';
    else if (lang === 'KN') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-US';
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const filteredCategories = useMemo(() => {
    let cats = CATEGORIES;
    if (activeFilter) {
      cats = cats.filter(c => c.id === activeFilter);
    }
    if (searchQuery) {
      cats = cats.filter(cat => 
        cat.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc[lang].toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return cats;
  }, [searchQuery, lang, activeFilter]);

  const currentTopicData = activeTopic ? TOPIC_CONTENT[activeTopic] : null;

  const navigateToTopic = (catId: string, topicId: string) => {
    setActiveCategory(catId);
    setActiveTopic(topicId);
    setView('topic');
  };

  const s = (key: keyof typeof UI_STRINGS) => UI_STRINGS[key][lang];

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 font-sans selection:bg-green-100 pb-24 text-[#2C3E50]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- TOP BAR --- */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-full transition-colors border border-gray-100 shadow-sm">
                <ChevronLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {s('knowledgeHub')}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            {(['EN', 'HI', 'KN'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  lang === l 
                    ? "bg-white text-[#2E7D32] shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* --- SEARCH --- */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={s('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium text-gray-800 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.slice(0, 4).map((c) => (
              <button 
                key={c.id}
                onClick={() => setActiveFilter(activeFilter === c.id ? null : c.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold border transition-all",
                  activeFilter === c.id 
                    ? "bg-[#2E7D32] text-white border-[#2E7D32]" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#2E7D32]"
                )}
              >
                {c.title[lang]}
              </button>
            ))}
            {activeFilter && (
              <button onClick={() => setActiveFilter(null)} className="text-xs font-bold text-red-500 hover:underline px-2">
                {s('clear')}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'grid' && (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {!searchQuery && !activeFilter && (
                <section className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#2E7D32]" />
                    {s('popularTopics')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { catId: 'soil', topicId: 'ph-levels', title: { EN: 'Soil pH', HI: 'मिट्टी पीएच', KN: 'ಮಣ್ಣಿನ pH' }, icon: Beaker },
                      { catId: 'crop', topicId: 'nursery-mgmt', title: { EN: 'Nursery Care', HI: 'नर्सरी देखभाल', KN: 'ಸಸಿಮಡಿ ಆರೈಕೆ' }, icon: Sprout },
                      { catId: 'irrigation', topicId: 'drip-irrigation', title: { EN: 'Drip Systems', HI: 'ड्रिप सिस्टम', KN: 'ಹನಿ ವ್ಯವಸ್ಥೆ' }, icon: Droplets }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => navigateToTopic(item.catId, item.topicId)}
                        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
                      >
                        <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-[#e8f5e9] transition-colors text-[#2E7D32]">
                          <item.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight">{item.title[lang]}</h4>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.catId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredCategories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setView('category'); }}
                    className={cn(
                      "group p-6 rounded-xl border transition-all cursor-pointer flex flex-col gap-4 shadow-sm hover:shadow-md",
                      cat.bg, cat.border
                    )}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm" style={{ color: cat.accent }}>
                      <cat.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{cat.title[lang]}</h3>
                      <p className="text-xs font-semibold text-gray-600 line-clamp-2 leading-relaxed opacity-80">{cat.desc[lang]}</p>
                    </div>
                    <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-gray-500 group-hover:text-gray-900 transition-colors uppercase tracking-widest">
                      {s('viewGuide')} <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'category' && activeCategory && (
            <motion.div 
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setView('grid')}
                className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={18} /> {s('allCategories')}
              </button>

              <div className="grid grid-cols-1 gap-3">
                {(TOPICS[activeCategory] || []).map((topic) => (
                  <div 
                    key={topic.id}
                    onClick={() => { setActiveTopic(topic.id); setView('topic'); }}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#2E7D32] transition-colors">{topic.title[lang]}</h3>
                      <p className="text-sm font-medium text-gray-500">{topic.desc[lang]}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#2E7D32] group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'topic' && currentTopicData && (
            <motion.div 
              key="topic"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <button 
                onClick={() => setView('category')}
                className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={18} /> {s('back')}
              </button>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-[#2E7D32] p-8 md:p-12 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4 text-white">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Guide</span>
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight">{currentTopicData.title[lang]}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSpeak([currentTopicData.title[lang], ...currentTopicData.points[lang], currentTopicData.example[lang]].join(". "))}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all",
                        isPlaying ? "bg-red-500" : "bg-white text-[#2E7D32]"
                      )}
                    >
                      {isPlaying ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
                      {isPlaying ? s('stop') : s('listen')}
                    </button>
                    <button onClick={() => setIsSaved(!isSaved)} className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                      <Bookmark size={20} className={isSaved ? "fill-white" : ""} />
                    </button>
                  </div>
                </div>

                <div className="p-8 md:p-12 space-y-10 text-gray-800">
                  <div className="grid grid-cols-1 gap-6">
                    {currentTopicData.points[lang].map((point: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-[#2E7D32] shrink-0 group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-lg font-medium leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#fcfaf5] border border-[#f5eeda] rounded-2xl p-8">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest mb-4">
                      <HelpCircle size={16} /> {s('exampleLabel')}
                    </div>
                    <p className="text-lg font-medium italic border-l-4 border-amber-200 pl-6 leading-relaxed">
                      "{currentTopicData.example[lang]}"
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-8 flex items-start gap-6 border border-emerald-100">
                    <div className="p-4 bg-white rounded-xl shadow-sm text-yellow-500">
                      <Lightbulb size={24} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 uppercase text-xs tracking-widest mb-1">{s('proTip')}</h4>
                      <p className="text-emerald-800 font-semibold text-lg">{currentTopicData.tip[lang]}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-8 bg-gray-50/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-gray-500 text-sm font-bold">
                    <MessageSquare size={18} />
                    {s('questions')}
                  </div>
                  <button 
                    onClick={() => navigate('/assistant')}
                    className="px-8 py-3 bg-[#2E7D32] text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={18} />
                    {s('askAi')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
