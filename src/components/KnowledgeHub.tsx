import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Bug, Droplets, Leaf, 
  Wind, Beaker, Sprout, Bird, ChevronLeft, 
  Volume2, Square, Bookmark, MessageSquare,
  Languages, Lightbulb, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// --- DATA STRUCTURES ---

type Language = 'EN' | 'HI' | 'KN';
type ViewState = 'grid' | 'category' | 'topic';

const CATEGORIES = [
  { id: 'soil', title: { EN: 'Soil Health', HI: 'मृदा स्वास्थ्य', KN: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ' }, icon: Beaker, desc: { EN: 'Keep your soil rich and fertile.', HI: 'अपनी मिट्टी को उपजाऊ रखें।', KN: 'ನಿಮ್ಮ ಮಣ್ಣನ್ನು ಫಲವತ್ತಾಗಿಡಿ.' } },
  { id: 'crop', title: { EN: 'Crop Management', HI: 'फसल प्रबंधन', KN: 'ಬೆಳೆ ನಿರ್ವಹಣೆ' }, icon: Sprout, desc: { EN: 'Best practices for healthy crops.', HI: 'स्वस्थ फसलों के लिए सर्वोत्तम अभ्यास।', KN: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳಿಗೆ ಉತ್ತಮ ಅಭ್ಯಾಸಗಳು.' } },
  { id: 'pest', title: { EN: 'Pest Control', HI: 'कीट नियंत्रण', KN: 'ಕೀಟ ನಿಯಂತ್ರಣ' }, icon: Bug, desc: { EN: 'Protect your farm from insects.', HI: 'अपने खेत को कीड़ों से बचाएं।', KN: 'ಕೀಟಗಳಿಂದ ನಿಮ್ಮ ಜಮೀನನ್ನು ರಕ್ಷಿಸಿ.' } },
  { id: 'irrigation', title: { EN: 'Irrigation', HI: 'सिंचाई', KN: 'ನೀರಾವರಿ' }, icon: Droplets, desc: { EN: 'Smart watering techniques.', HI: 'स्मार्ट सिंचाई तकनीकें।', KN: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ತಂತ್ರಗಳು.' } },
  { id: 'fertilizer', title: { EN: 'Fertilizer Guide', HI: 'उर्वरक गाइड', KN: 'ರಸಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ' }, icon: Leaf, desc: { EN: 'Right nutrients for your soil.', HI: 'आपकी मिट्टी के लिए सही पोषक तत्व।', KN: 'ನಿಮ್ಮ ಮಣ್ಣಿಗೆ ಸರಿಯಾದ ಪೋಷಕಾಂಶಗಳು.' } },
  { id: 'animal', title: { EN: 'Animal Husbandry', HI: 'पशुपालन', KN: 'ಪಶುಸಂಗೋಪನೆ' }, icon: Bird, desc: { EN: 'Care for farm animals.', HI: 'खेत के जानवरों की देखभाल।', KN: 'ಕೃಷಿ ಪ್ರಾಣಿಗಳ ಆರೈಕೆ.' } },
  { id: 'weather', title: { EN: 'Weather Farming', HI: 'मौसम आधारित खेती', KN: 'ಹವಾಮಾನ ಕೃಷಿ' }, icon: Wind, desc: { EN: 'Farming in different climates.', HI: 'विभिन्न जलवायु में खेती।', KN: 'ವಿವಿಧ ಹವಾಮಾನಗಳಲ್ಲಿ ಕೃಷಿ.' } },
  { id: 'seeds', title: { EN: 'Seed Selection', HI: 'बीज चयन', KN: 'ಬೀಜ ಆಯ್ಕೆ' }, icon: BookOpen, desc: { EN: 'Choosing the best seeds.', HI: 'सर्वोत्तम बीजों का चुनाव।', KN: 'ಉತ್ತಮ ಬೀಜಗಳ ಆಯ್ಕೆ.' } },
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
    { id: 'sprinkler-mgmt', title: { EN: 'Sprinkler Systems', HI: 'छिड़काव प्रणाली', KN: 'ತುಂತುರು ನೀರಾವರಿ' }, desc: { EN: 'Effective overhead watering.', HI: 'प्रभावी ओवरहेड सिंचाई।', KN: 'ಪರಿಣಾಮಕಾರಿ ಮೇಲಿನಿಂದ ನೀರು ಹರಿಸುವ ವಿಧಾನ.' } },
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
      EN: 'Practical: If tomato leaves turn yellow, soil may be acidic (below 5.5). Add lime at 2kg per cent of land.',
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
      KN: 'ಪ್ರಾಯೋಗಿಕ: 3 ಅಡಿ ಗುಂಡಿಯಲ್ಲಿ ಸಗಣಿ, ಹುಲ್ಲು ಮತ್ತು ಕಸವನ್ನು ಹಾಕಿ. 3 ತಿಂಗಳಲ್ಲಿ ಕಪ್ಪು ಬಂಗಾರದಂತಹ ಗೊಬ್ಬರ ಸಿದ್ಧ.'
    },
    tip: { EN: 'Add jaggery water to speed up decay.', HI: 'अपघटन तेज करने के लिए गुड़ का पानी डालें।', KN: 'ಕೊಳೆಯುವಿಕೆ ವೇಗಗೊಳಿಸಲು ಬೆಲ್ಲದ ನೀರು ಸೇರಿಸಿ.' }
  },
  'soil-testing': {
    title: { EN: 'Soil Testing Guide', HI: 'मिट्टी परीक्षण गाइड', KN: 'ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾರ್ಗದರ್ಶಿ' },
    points: {
      EN: ['Collect soil in a "V" shape 15cm deep.', 'Mix samples from different spots.', 'Dry in shade before sending to lab.'],
      HI: ['15 सेमी गहरे "V" आकार में मिट्टी इकट्ठा करें।', 'अलग-अलग जगहों के नमूनों को मिलाएं।', 'लैब भेजने से पहले छाया में सुखाएं।'],
      KN: ['15 ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ "V" ಆಕಾರದಲ್ಲಿ ಮಣ್ಣನ್ನು ಸಂಗ್ರಹಿಸಿ.', 'ವಿವಿಧ ಸ್ಥಳಗಳ ಮಾದರಿಗಳನ್ನು ಮಿಶ್ರಣ ಮಾಡಿ.', 'ಲ್ಯಾಬ್‌ಗೆ ಕಳುಹಿಸುವ ಮೊದಲು ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ.']
    },
    example: {
      EN: 'Practical: Take 10-15 random spots in 1 acre. Remove top debris first.',
      HI: 'व्यावहारिक: 1 एकड़ में 10-15 यादृच्छिक स्थान लें। पहले ऊपर का कचरा हटा दें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 1 ಎಕರೆ ಭೂಮಿಯಲ್ಲಿ 10-15 ವಿವಿಧ ಜಾಗಗಳಿಂದ ಮಾದರಿ ಪಡೆಯಿರಿ.'
    },
    tip: { EN: 'Avoid spots near fences or trees.', HI: 'बाड़ या पेड़ों के पास के स्थानों से बचें।', KN: 'ಬೇಲಿ ಅಥವಾ ಮರಗಳ ಹತ್ತಿರದ ಜಾಗಗಳನ್ನು ಬಿಟ್ಟುಬಿಡಿ.' }
  },
  'mulching': {
    title: { EN: 'Benefits of Mulching', HI: 'मल्चिंग के लाभ', KN: 'ಮಲ್ಚಿಂಗ್‌ನ ಪ್ರಯೋಜನಗಳು' },
    points: {
      EN: ['Reduces water evaporation.', 'Stops weeds from growing.', 'Keeps soil temperature stable.'],
      HI: ['पानी के वाष्पीकरण को कम करता है।', 'खरपतवारों को बढ़ने से रोकता है।', 'मिट्टी के तापमान को स्थिर रखता है।'],
      KN: ['ನೀರು ಆವಿಯಾಗುವುದನ್ನು ತಡೆಯುತ್ತದೆ.', 'ಕಳೆಗಳು ಬೆಳೆಯದಂತೆ ನೋಡಿಕೊಳ್ಳುತ್ತದೆ.', 'ಮಣ್ಣಿನ ತಾಪಮಾನವನ್ನು ಸ್ಥಿರವಾಗಿರಿಸುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Cover soil around plants with 3 inches of straw or plastic sheets.',
      HI: 'व्यावहारिक: पौधों के चारों ओर मिट्टी को 3 इंच पुआल या प्लास्टिक शीट से ढकें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಗಿಡಗಳ ಸುತ್ತ ಮಣ್ಣನ್ನು 3 ಇಂಚು ಹುಲ್ಲು ಅಥವಾ ಪ್ಲಾಸ್ಟಿಕ್‌ನಿಂದ ಮುಚ್ಚಿ.'
    },
    tip: { EN: 'Organic mulch adds nutrients as it decays.', HI: 'जैविक मल्च सड़ने पर पोषक तत्व जोड़ता है।', KN: 'ಸಾವಯವ ಮಲ್ಚ್ ಕೊಳೆತಂತೆ ಮಣ್ಣಿಗೆ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.' }
  },
  'crop-rotation': {
    title: { EN: 'Soil-Friendly Crop Rotation', HI: 'मृदा-अनुकूल फसल चक्र', KN: 'ಮಣ್ಣಿನ ಸ್ನೇಹಿ ಬೆಳೆ ಸರದಿ' },
    points: {
      EN: ['Never grow the same crop twice in same spot.', 'Rotate heavy feeders with legumes.', 'Breaks pest and disease cycles.'],
      HI: ['एक ही स्थान पर एक ही फसल दोबारा न उगाएं।', 'भारी पोषक तत्व वाली फसलों को फलियों के साथ बदलें।', 'कीट और रोग चक्र को तोड़ता है।'],
      KN: ['ಒಂದೇ ಜಾಗದಲ್ಲಿ ಪದೇ ಪದೇ ಒಂದೇ ಬೆಳೆ ಬೆಳೆಯಬೇಡಿ.', 'ಹೆಚ್ಚು ಶಕ್ತಿ ಬಳಸುವ ಬೆಳೆಗಳ ನಂತರ ದ್ವಿದಳ ಧಾನ್ಯ ಬೆಳೆಯಿರಿ.', 'ಕೀಟ ಮತ್ತು ರೋಗದ ಹರಡುವಿಕೆಯನ್ನು ತಡೆಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Follow Grain (Wheat) with Legume (Moong) to restore Nitrogen.',
      HI: 'व्यावहारिक: नाइट्रोजन बहाल करने के लिए अनाज (गेहूं) के बाद दलहन (मूंग) उगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಸಾರಜನಕ ಹೆಚ್ಚಿಸಲು ಧಾನ್ಯದ (ಗೋಧಿ) ನಂತರ ಹೆಸರುಕಾಳು ಬೆಳೆಯಿರಿ.'
    },
    tip: { EN: 'Legumes act as natural fertilizers.', HI: 'फलीदार फसलें प्राकृतिक उर्वरक का काम करती हैं।', KN: 'ದ್ವಿದಳ ಧಾನ್ಯಗಳು ನೈಸರ್ಗಿಕ ಗೊಬ್ಬರದಂತೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ.' }
  },

  // --- CROP MANAGEMENT ---
  'nursery-mgmt': {
    title: { EN: 'Nursery Management', HI: 'नर्सरी प्रबंधन', KN: 'ಸಸಿಮಡಿ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Use raised beds for better drainage.', 'Protect from direct harsh sunlight.', 'Maintain optimal moisture for seeds.'],
      HI: ['बेहतर जल निकासी के लिए उठी हुई क्यारियों का उपयोग करें।', 'सीधी तेज धूप से बचाएं।', 'बीजों के लिए इष्टतम नमी बनाए रखें।'],
      KN: ['ಉತ್ತಮ ನೀರು ಹರಿಯಲು ಎತ್ತರಿಸಿದ ಪಾತಿಗಳನ್ನು ಬಳಸಿ.', 'ನೇರ ಬಿಸಿಲಿನಿಂದ ಸಸಿಗಳನ್ನು ರಕ್ಷಿಸಿ.', 'ಬೀಜಗಳಿಗೆ ಬೇಕಾದಷ್ಟು ತೇವಾಂಶವಿರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ.']
    },
    example: {
      EN: 'Practical: Use Pro-trays with Coco-peat for 95% survival rate of chilies.',
      HI: 'व्यावहारिक: मिर्च के पौधों की 95% जीवित रहने की दर के लिए कोको-पीट के साथ प्रो-ट्रे का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮೆಣಸಿನಕಾಯಿ ಸಸಿಗಳು ಚೆನ್ನಾಗಿ ಬರಲು ಕೋಕೋಪಿಟ್ ಇರುವ ಪ್ರೊ-ಟ್ರೇ ಬಳಸಿ.'
    },
    tip: { EN: 'Harden plants before transplanting.', HI: 'प्रत्यारोपण से पहले पौधों को कठोर बनाएं।', KN: 'ನಾಟಿ ಮಾಡುವ ಮೊದಲು ಸಸಿಗಳನ್ನು ಹೊರಗಿನ ಹವಾಮಾನಕ್ಕೆ ಒಗ್ಗಿಸಿ.' }
  },
  'spacing': {
    title: { EN: 'Optimal Plant Spacing', HI: 'इष्टतम पौधों की दूरी', KN: 'ಸೂಕ್ತ ಸಸ್ಯಗಳ ಅಂತರ' },
    points: {
      EN: ['Prevents competition for sunlight and nutrients.', 'Allows proper air circulation.', 'Makes weeding and harvesting easier.'],
      HI: ['धूप और पोषक तत्वों की प्रतिस्पर्धा को रोकता है।', 'उचित वायु संचार की अनुमति देता है।', 'निराई और कटाई को आसान बनाता है।'],
      KN: ['ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಪೈಪೋಟಿ ತಡೆಯುತ್ತದೆ.', 'ಉತ್ತಮ ಗಾಳಿಯಾಡಲು ಅವಕಾಶ ನೀಡುತ್ತದೆ.', 'ಕಳೆ ತೆಗೆಯಲು ಮತ್ತು ಕೊಯ್ಲು ಮಾಡಲು ಸುಲಭವಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Maintain 60x45 cm spacing for Tomato for healthy fruit size.',
      HI: 'व्यावहारिक: फलों के स्वस्थ आकार के लिए टमाटर के लिए 60x45 सेमी की दूरी बनाए रखें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಟೊಮೆಟೊ ಗಿಡಗಳ ನಡುವೆ 60x45 ಸೆಂ.ಮೀ ಅಂತರ ಕಾಪಾಡಿಕೊಳ್ಳಿ.'
    },
    tip: { EN: 'Follow local agriculture dept guidelines.', HI: 'स्थानीय कृषि विभाग के दिशा-निर्देशों का पालन करें।', KN: 'ಸ್ಥಳೀಯ ಕೃಷಿ ಇಲಾಖೆಯ ಸೂಚನೆಗಳನ್ನು ಪಾಲಿಸಿ.' }
  },
  'pruning': {
    title: { EN: 'Pruning Techniques', HI: 'छंटाई तकनीक', KN: 'ಸವರುವ ತಂತ್ರಗಳು' },
    points: {
      EN: ['Remove dead or infected branches.', 'Direct energy to fruit production.', 'Shape the plant for better growth.'],
      HI: ['मृत या संक्रमित शाखाओं को हटा दें।', 'ऊर्जा को फल उत्पादन की ओर निर्देशित करें।', 'बेहतर विकास के लिए पौधे को आकार दें।'],
      KN: ['ಒಣಗಿದ ಅಥವಾ ರೋಗಗ್ರಸ್ತ ಕೊಂಬೆಗಳನ್ನು ತೆಗೆಯಿರಿ.', 'ಹಣ್ಣು ಬಿಡಲು ಗಿಡಕ್ಕೆ ಶಕ್ತಿ ನೀಡಿ.', 'ಗಿಡವು ಸರಿಯಾಗಿ ಬೆಳೆಯಲು ಆಕಾರ ನೀಡಿ.']
    },
    example: {
      EN: 'Practical: Prune Pomegranate in Jan-Feb to get high-quality Bahar fruits.',
      HI: 'व्यावहारिक: उच्च गुणवत्ता वाले बहार फल प्राप्त करने के लिए जनवरी-फरवरी में अनार की छंटाई करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಉತ್ತಮ ಹಣ್ಣು ಪಡೆಯಲು ದಾಳಿಂಬೆ ಗಿಡವನ್ನು ಜನವರಿ-ಫೆಬ್ರವರಿಯಲ್ಲಿ ಸವರಿ.'
    },
    tip: { EN: 'Always use sharp, clean tools.', HI: 'हमेशा तेज और साफ औजारों का प्रयोग करें।', KN: 'ಯಾವಾಗಲೂ ಹರಿತವಾದ ಮತ್ತು ಸ್ವಚ್ಛವಾದ ಉಪಕರಣ ಬಳಸಿ.' }
  },
  'post-harvest': {
    title: { EN: 'Post-Harvest Handling', HI: 'कटाई के बाद प्रबंधन', KN: 'ಕೊಯ್ಲಿನ ನಂತರದ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Harvest during cool hours.', 'Clean and grade crops immediately.', 'Store in cool, dry ventilated areas.'],
      HI: ['ठंडे घंटों के दौरान कटाई करें।', 'फसलों को तुरंत साफ और श्रेणीबद्ध करें।', 'ठंडी, सूखी हवादार जगहों पर स्टोर करें।'],
      KN: ['ತಂಪಾದ ಸಮಯದಲ್ಲಿ ಬೆಳೆ ಕೊಯ್ಲು ಮಾಡಿ.', 'ಕೊಯ್ಲಿನ ನಂತರ ತಕ್ಷಣ ಬೆಳೆಗಳನ್ನು ವರ್ಗೀಕರಿಸಿ.', 'ತಂಪಾದ ಮತ್ತು ಗಾಳಿಯಾಡುವ ಜಾಗದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.']
    },
    example: {
      EN: 'Practical: Pre-cool mangoes after harvest to increase shelf life by 5 days.',
      HI: 'व्यावहारिक: शेल्फ लाइफ को 5 दिन बढ़ाने के लिए कटाई के बाद आमों को प्री-कूल करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮಾವಿನ ಹಣ್ಣುಗಳನ್ನು ಕೊಯ್ಲಿನ ನಂತರ ತಂಪು ಮಾಡಿದರೆ 5 ದಿನ ಹೆಚ್ಚು ಬಾಳಿಕೆ ಬರುತ್ತವೆ.'
    },
    tip: { EN: 'Avoid direct contact with soil after harvest.', HI: 'कटाई के बाद मिट्टी के सीधे संपर्क से बचें।', KN: 'ಕೊಯ್ಲಿನ ನಂತರ ಬೆಳೆ ಮಣ್ಣಿಗೆ ತಾಗದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.' }
  },
  'inter-cropping': {
    title: { EN: 'Intercropping Benefits', HI: 'अंतःफसल के लाभ', KN: 'ಮಿಶ್ರ ಬೆಳೆಯ ಪ್ರಯೋಜನಗಳು' },
    points: {
      EN: ['Better land use efficiency.', 'Insurance against primary crop failure.', 'Reduces overall pest spread.'],
      HI: ['बेहतर भूमि उपयोग दक्षता।', 'प्राथमिक फसल की विफलता के खिलाफ बीमा।', 'कुल कीट प्रसार को कम करता है।'],
      KN: ['ಭೂಮಿಯ ಸದುಪಯೋಗವಾಗುತ್ತದೆ.', 'ಮುಖ್ಯ ಬೆಳೆ ವಿಫಲವಾದರೆ ಪರ್ಯಾಯ ಆದಾಯ ಸಿಗುತ್ತದೆ.', 'ಕೀಟಗಳ ಹರಡುವಿಕೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Grow Garlic between Sugarcane to repel boring insects naturally.',
      HI: 'व्यावहारिक: कीटों को स्वाभाविक रूप से दूर भगाने के लिए गन्ने के बीच लहसुन उगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಕಬ್ಬಿನ ನಡುವೆ ಬೆಳ್ಳುಳ್ಳಿ ಬೆಳೆದರೆ ಕೀಟಗಳು ಬರುವುದಿಲ್ಲ.'
    },
    tip: { EN: 'Choose crops that don\'t compete.', HI: 'ऐसी फसलें चुनें जो प्रतिस्पर्धा न करें।', KN: 'ಪೈಪೋಟಿ ಇಲ್ಲದ ಬೆಳೆಗಳನ್ನು ಆರಿಸಿ.' }
  },

  // --- PEST CONTROL ---
  'biological-control': {
    title: { EN: 'Biological Pest Control', HI: 'जैविक कीट नियंत्रण', KN: 'ಜೈವಿಕ ಕೀಟ ನಿಯಂತ್ರಣ' },
    points: {
      EN: ['Use "Good Insects" to kill pests.', 'Reduces chemical dependency.', 'Safe for human consumption.'],
      HI: ['कीटों को मारने के लिए "अच्छे कीड़ों" का प्रयोग करें।', 'रासायनिक निर्भरता कम करता है।', 'मानव उपभोग के लिए सुरक्षित।'],
      KN: ['ಕೀಟಗಳನ್ನು ಕೊಲ್ಲಲು "ಉಪಕಾರಿ ಕೀಟ" ಬಳಸಿ.', 'ರಾಸಾಯನಿಕಗಳ ಬಳಕೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.', 'ಆರೋಗ್ಯಕ್ಕೆ ಸುರಕ್ಷಿತ.']
    },
    example: {
      EN: 'Practical: Release Trichogramma cards in Rice field to control stem borer.',
      HI: 'व्यावहारिक: तना छेदक को नियंत्रित करने के लिए धान के खेत में ट्राइकोलोरामा कार्ड छोड़ें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ ಕಾಂಡ ಕೊರಕ ತಡೆಯಲು ಟ್ರೈಕೋಡರ್ಮಾ ಬಳಸಿ.'
    },
    tip: { EN: 'Avoid pesticides after releasing agents.', HI: 'एजेंटों को छोड़ने के बाद कीटनाशकों से बचें।', KN: 'ಉಪಕಾರಿ ಕೀಟಗಳನ್ನು ಬಿಟ್ಟ ನಂತರ ವಿಷ ಸಿಂಪಡಿಸಬೇಡಿ.' }
  },
  'neem-spray': {
    title: { EN: 'Homemade Neem Spray', HI: 'घर का बना नीम स्प्रे', KN: 'ಮನೆಯಲ್ಲಿ ತಯಾರಿಸಿದ ಬೇವಿನ ಸಿಂಪಡಣೆ' },
    points: {
      EN: ['Kills over 200 types of pests.', 'Safe for bees and earthworms.', 'Easy to make at home.'],
      HI: ['200 से अधिक प्रकार के कीटों को मारता है।', 'मधुमक्खियों और केंचुओं के लिए सुरक्षित।', 'घर पर बनाना आसान है।'],
      KN: ['200 ಕ್ಕೂ ಹೆಚ್ಚು ಕೀಟಗಳನ್ನು ಕೊಲ್ಲುತ್ತದೆ.', 'ಜೇನುನೊಣಗಳಿಗೆ ಇದು ಸುರಕ್ಷಿತ.', 'ಮನೆಯಲ್ಲೇ ತಯಾರಿಸುವುದು ಸುಲಭ.']
    },
    example: {
      EN: 'Practical: Mix 5ml Neem oil + 2ml soap in 1L water for chili leaf curl.',
      HI: 'व्यावहारिक: मिर्च के लीफ कर्ल के लिए 1 लीटर पानी में 5 मिली नीम का तेल + 2 मिली साबुन मिलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 1 ಲೀ ನೀರಿಗೆ 5 ಮಿಲಿ ಬೇವಿನ ಎಣ್ಣೆ ಮತ್ತು 2 ಮಿಲಿ ಸಾಬೂನು ಬೆರೆಸಿ ಮೆಣಸಿನ ಗಿಡಕ್ಕೆ ಸಿಂಪಡಿಸಿ.'
    },
    tip: { EN: 'Shake well before using spray.', HI: 'स्प्रे का उपयोग करने से पहले अच्छी तरह हिलाएं।', KN: 'ಬಳಸುವ ಮೊದಲು ಚೆನ್ನಾಗಿ ಅಲುಗಾಡಿಸಿ.' }
  },
  'trap-crops': {
    title: { EN: 'Setting Trap Crops', HI: 'ट्रैप फसलें लगाना', KN: 'ಟ್ರ್ಯಾಪ್ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಸುವುದು' },
    points: {
      EN: ['Pests prefer trap crop over main crop.', 'Sacrifice a small area to save the farm.', 'Reduces pesticide use on main crop.'],
      HI: ['कीट मुख्य फसल की तुलना में ट्रैप फसल को पसंद करते हैं।', 'खेत बचाने के लिए एक छोटा सा क्षेत्र कुर्बान करें।', 'मुख्य फसल पर कीटनाशकों के प्रयोग को कम करता है।'],
      KN: ['ಕೀಟಗಳು ಮುಖ್ಯ ಬೆಳೆಗಿಂತ ಟ್ರ್ಯಾಪ್ ಬೆಳೆಯನ್ನು ಇಷ್ಟಪಡುತ್ತವೆ.', 'ಮುಖ್ಯ ಬೆಳೆ ಉಳಿಸಲು ಸ್ವಲ್ಪ ಜಾಗದಲ್ಲಿ ಇವುಗಳನ್ನು ಬೆಳೆಯಿರಿ.', 'ಮುಖ್ಯ ಬೆಳೆಗೆ ವಿಷ ಹಾಕುವ ಅವಶ್ಯಕತೆ ಇರುವುದಿಲ್ಲ.']
    },
    example: {
      EN: 'Practical: Plant Marigold around Tomato to attract and trap Nematodes.',
      HI: 'व्यावहारिक: नेमाटोड को आकर्षित करने और फँसाने के लिए टमाटर के चारों ओर गेंदा लगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಟೊಮೆಟೊ ಗಿಡಗಳ ಸುತ್ತ ಚೆಂಡು ಹೂ ಬೆಳೆದರೆ ಕೀಟಗಳು ಅಲ್ಲಿಗೆ ಹೋಗುತ್ತವೆ.'
    },
    tip: { EN: 'Destroy pests on trap crop regularly.', HI: 'ट्रैप फसल पर कीटों को नियमित रूप से नष्ट करें।', KN: 'ಟ್ರ್ಯಾಪ್ ಬೆಳೆಗಳಲ್ಲಿನ ಕೀಟಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ನಾಶಮಾಡಿ.' }
  },
  'pheromones': {
    title: { EN: 'Pheromone Traps', HI: 'फेरोमोन ट्रैप', KN: 'ಫೆರೋಮೋನ್ ಟ್ರ್ಯಾಪ್‌ಗಳು' },
    points: {
      EN: ['Attract male insects using scents.', 'Stops breeding cycle.', 'Low-cost and highly specific.'],
      HI: ['गंध का उपयोग करके नर कीड़ों को आकर्षित करें।', 'प्रजनन चक्र को रोकता है।', 'कम लागत और अत्यधिक विशिष्ट।'],
      KN: ['ಗಂಡು ಕೀಟಗಳನ್ನು ಆಕರ್ಷಿಸಲು ವಾಸನೆ ಬಳಸುವುದು.', 'ಸಂತಾನೋತ್ಪತ್ತಿಯನ್ನು ತಡೆಯುತ್ತದೆ.', 'ಕಡಿಮೆ ಖರ್ಚಿನ ವಿಧಾನ.']
    },
    example: {
      EN: 'Practical: Use Wota traps for Mango fruit fly in summer months.',
      HI: 'व्यावहारिक: गर्मियों के महीनों में आम के फल की मक्खी के लिए वोटा ट्रैप का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮಾವಿನ ಹಣ್ಣಿನ ನೊಣಗಳನ್ನು ಹಿಡಿಯಲು ಹಣ್ಣಿನ ನೊಣದ ಟ್ರ್ಯಾಪ್ ಬಳಸಿ.'
    },
    tip: { EN: 'Replace lures every 30 days.', HI: 'हर 30 दिनों में ल्यूर बदलें।', KN: 'ಪ್ರತಿ 30 ದಿನಕ್ಕೊಮ್ಮೆ ಇದರೊಳಗಿನ ಔಷಧ ಬದಲಿಸಿ.' }
  },
  'light-traps': {
    title: { EN: 'Solar Light Traps', HI: 'सोलर लाइट ट्रैप', KN: 'ಸೌರ ಬೆಳಕಿನ ಟ್ರ್ಯಾಪ್‌ಗಳು' },
    points: {
      EN: ['Attract nocturnal moths with light.', 'Pests fall into water-oil mix.', 'No recurring costs with solar.'],
      HI: ['प्रकाश से रात के पतंगों को आकर्षित करें।', 'कीट पानी-तेल के मिश्रण में गिर जाते हैं।', 'सोलर के साथ कोई आवर्ती लागत नहीं।'],
      KN: ['ಬೆಳಕಿನಿಂದ ರಾತ್ರಿ ಪತಂಗಗಳನ್ನು ಆಕರ್ಷಿಸಿ.', 'ಕೀಟಗಳು ಕೆಳಗಿನ ನೀರು-ಎಣ್ಣೆ ಮಿಶ್ರಣಕ್ಕೆ ಬೀಳುತ್ತವೆ.', 'ಸೌರಶಕ್ತಿಯಿಂದ ನಡೆಯುವುದರಿಂದ ವಿದ್ಯುತ್ ಖರ್ಚಿಲ್ಲ.']
    },
    example: {
      EN: 'Practical: Place 1 trap per acre to monitor and kill armyworms.',
      HI: 'व्यावहारिक: आर्मीवर्म की निगरानी और मारने के लिए प्रति एकड़ 1 ट्रैप लगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 1 ಎಕರೆಗೆ ಒಂದು ಬೆಳಕಿನ ಟ್ರ್ಯಾಪ್ ಇರಿಸಿ.'
    },
    tip: { EN: 'Clean the collection tray daily.', HI: 'कलेक्शन ट्रे को रोजाना साफ करें।', KN: 'ಶೇಖರಣಾ ತಟ್ಟೆಯನ್ನು ಪ್ರತಿದಿನ ಸ್ವಚ್ಛಗೊಳಿಸಿ.' }
  },

  // --- IRRIGATION ---
  'drip-irrigation': {
    title: { EN: 'Drip Irrigation', HI: 'ड्रिप सिंचाई', KN: 'ಹನಿ ನೀರಾವರಿ' },
    points: {
      EN: ['Direct water to roots.', 'Saves 60% water.', 'Prevents weed growth between rows.'],
      HI: ['सीधा जड़ों तक पानी पहुँचाएं।', '60% पानी बचाता है।', 'लाइनों के बीच खरपतवार की वृद्धि को रोकता है।'],
      KN: ['ಬೇರುಗಳಿಗೆ ನೇರವಾಗಿ ನೀರು ನೀಡಿ.', 'ಶೇ. 60 ರಷ್ಟು ನೀರು ಉಳಿತಾಯ.', 'ಸಾಲುಗಳ ನಡುವೆ ಕಳೆ ಬೆಳೆಯುವುದಿಲ್ಲ.']
    },
    example: {
      EN: 'Practical: Use 4LPH emitters for Papaya for 2 hours daily.',
      HI: 'व्यावहारिक: पपीते के लिए रोजाना 2 घंटे 4LPH एमिटर का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಪರಂಗಿ ಗಿಡಗಳಿಗೆ ದಿನಕ್ಕೆ 2 ಗಂಟೆ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ.'
    },
    tip: { EN: 'Check filters weekly for sand.', HI: 'रेत के लिए साप्ताहिक रूप से फिल्टर की जांच करें।', KN: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ವಾರಕ್ಕೊಮ್ಮೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ.' }
  },
  'sprinkler-mgmt': {
    title: { EN: 'Sprinkler Systems', HI: 'छिड़काव प्रणाली', KN: 'ತುಂತುರು ನೀರಾವರಿ' },
    points: {
      EN: ['Simulates natural rain.', 'Good for sandy soil.', 'Reduces leaf temperature.'],
      HI: ['प्राकृतिक वर्षा का अनुकरण करता है।', 'रेतीली मिट्टी के लिए अच्छा है।', 'पत्तियों के तापमान को कम करता है।'],
      KN: ['ಕೃತಕ ಮಳೆಯಂತೆ ನೀರು ಹರಿಸುವುದು.', 'ಮರಳು ಭೂಮಿಗೆ ಇದು ಸೂಕ್ತ.', 'ಎಲೆಗಳ ತಾಪಮಾನವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Use for groundnut crops in the evening to reduce heat stress.',
      HI: 'व्यावहारिक: गर्मी के तनाव को कम करने के लिए शाम को मूंगफली की फसलों के लिए उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಶೇಂಗಾ ಬೆಳೆಗೆ ಸಂಜೆ ವೇಳೆ ತುಂತುರು ನೀರಾವರಿ ಬಳಸಿ.'
    },
    tip: { EN: 'Avoid use in high winds.', HI: 'तेज हवाओं में उपयोग से बचें।', KN: 'ಗಾಳಿ ಜೋರಿದ್ದಾಗ ಇದನ್ನು ಬಳಸಬೇಡಿ.' }
  },
  'mulch-water': {
    title: { EN: 'Watering with Mulch', HI: 'मल्च के साथ सिंचाई', KN: 'ಮಲ್ಚ್‌ನೊಂದಿಗೆ ನೀರುಣಿಸುವುದು' },
    points: {
      EN: ['Mulch keeps water inside soil.', 'Prevents soil crusting.', 'Reduces frequency of watering.'],
      HI: ['मल्च मिट्टी के अंदर पानी रखता है।', 'मिट्टी की पपड़ी बनने से रोकता है।', 'सिंचाई की आवृत्ति कम करता है।'],
      KN: ['ಮಲ್ಚ್ ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶವನ್ನು ಹಿಡಿದಿಡುತ್ತದೆ.', 'ಮಣ್ಣು ಗಟ್ಟಿಯಾಗುವುದನ್ನು ತಪ್ಪಿಸುತ್ತದೆ.', 'ನೀರುಣಿಸುವ ಅವಶ್ಯಕತೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Use 25-micron plastic mulch in watermelon to save 40% water.',
      HI: 'व्यावहारिक: तरबूज में 40% पानी बचाने के लिए 25-माइक्रोन प्लास्टिक मल्च का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಕಲ್ಲಂಗಡಿ ಬೆಳೆಯಲ್ಲಿ ಶೇ. 40 ರಷ್ಟು ನೀರು ಉಳಿಸಲು ಪ್ಲಾಸ್ಟಿಕ್ ಮಲ್ಚ್ ಬಳಸಿ.'
    },
    tip: { EN: 'Straw is a cheap organic option.', HI: 'पुआल एक सस्ता जैविक विकल्प है।', KN: 'ಒಣ ಹುಲ್ಲು ಕಡಿಮೆ ಖರ್ಚಿನ ಆಯ್ಕೆಯಾಗಿದೆ.' }
  },
  'rainwater-harvest': {
    title: { EN: 'Rainwater Harvesting', HI: 'वर्षा जल संचयन', KN: 'ಮಳೆನೀರು ಕೊಯ್ಲು' },
    points: {
      EN: ['Recharge borewells with rain.', 'Store in farm ponds.', 'Natural soft water for crops.'],
      HI: ['बारिश से बोरवेल रिचार्ज करें।', 'खेत के तालाबों में स्टोर करें।', 'फसलों के लिए प्राकृतिक मृदु जल।'],
      KN: ['ಬೋರ್‌ವೆಲ್‌ಗಳನ್ನು ಮಳೆನೀರನಿಂದ ಮರುಪೂರಣ ಮಾಡಿ.', 'ಕೃಷಿ ಹೊಂಡಗಳಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.', 'ಬೆಳೆಗಳಿಗೆ ಮಳೆನೀರು ತುಂಬಾ ಒಳ್ಳೆಯದು.']
    },
    example: {
      EN: 'Practical: Build a 10x10 meter pond to survive 2 months of dry spell.',
      HI: 'व्यावहारिक: सूखे के 2 महीनों तक जीवित रहने के लिए 10x10 मीटर का तालाब बनाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಬೇಸಿಗೆಗೆ ನೀರಿಗಾಗಿ 10x10 ಮೀಟರ್ ಕೃಷಿ ಹೊಂಡ ಮಾಡಿ.'
    },
    tip: { EN: 'Filter water before storing.', HI: 'भंडारण से पहले पानी को छान लें।', KN: 'ನೀರು ಸಂಗ್ರಹಿಸುವ ಮೊದಲು ಕಸ ಇಲ್ಲದಂತೆ ನೋಡಿ.' }
  },
  'deficit-irrigation': {
    title: { EN: 'Deficit Irrigation', HI: 'न्यूनतम सिंचाई', KN: 'ಕೊರತೆ ನೀರಾವರಿ' },
    points: {
      EN: ['Give less water intentionally.', 'Improve fruit sweetness.', 'Focus water only on critical stages.'],
      HI: ['जानबूझकर कम पानी दें।', 'फलों की मिठास बढ़ाएं।', 'केवल महत्वपूर्ण चरणों में पानी पर ध्यान दें।'],
      KN: ['ಬೇಕೆಂದೇ ಸ್ವಲ್ಪ ಕಡಿಮೆ ನೀರು ಹರಿಸುವುದು.', 'ಹಣ್ಣಿನ ರುಚಿ ಹೆಚ್ಚಿಸಲು ಇದು ಸಹಕಾರಿ.', 'ಕೇವಲ ಅವಶ್ಯಕ ಹಂತಗಳಲ್ಲಿ ಮಾತ್ರ ನೀರು ನೀಡಿ.']
    },
    example: {
      EN: 'Practical: Reduce water by 20% in Grapes during ripening for higher sugar.',
      HI: 'व्यावहारिक: उच्च चीनी के लिए अंगूर के पकने के दौरान पानी में 20% की कमी करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ದ್ರಾಕ್ಷಿ ಹಣ್ಣಾಗುವಾಗ ಶೇ. 20 ರಷ್ಟು ನೀರು ಕಡಿಮೆ ಮಾಡಿದರೆ ಸಿಹಿ ಹೆಚ್ಚುತ್ತದೆ.'
    },
    tip: { EN: 'Monitor soil moisture carefully.', HI: 'मिट्टी की नमी की सावधानीपूर्वक निगरानी करें।', KN: 'ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಗಮನಿಸುತ್ತಿರಿ.' }
  },

  // --- FERTILIZER ---
  'organic-fertilizers': {
    title: { EN: 'Organic Fertilizers', HI: 'जैविक उर्वरक', KN: 'ಸಾವಯವ ಗೊಬ್ಬರಗಳು' },
    points: {
      EN: ['Improve soil structure.', 'Long-lasting nutrients.', 'Eco-friendly and cheap.'],
      HI: ['मिट्टी की संरचना में सुधार।', 'लंबे समय तक चलने वाले पोषक तत्व।', 'पर्यावरण के अनुकूल और सस्ता।'],
      KN: ['ಮಣ್ಣಿನ ಗುಣಮಟ್ಟ ಸುಧಾರಿಸುತ್ತದೆ.', 'ಬಹಳ ದಿನ ಪೋಷಕಾಂಶ ನೀಡುತ್ತದೆ.', 'ಪರಿಸರ ಸ್ನೇಹಿ ಮತ್ತು ಕಡಿಮೆ ಖರ್ಚು.']
    },
    example: {
      EN: 'Practical: Apply 5 tons of Vermicompost per acre for vegetables.',
      HI: 'व्यावहारिक: सब्जियों के लिए प्रति एकड़ 5 टन वर्मीकम्पोस्ट डालें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ತರಕಾರಿ ಬೆಳೆಗೆ ಎಕರೆಗೆ 5 ಟನ್ ಎರೆಗೊಬ್ಬರ ಬಳಸಿ.'
    },
    tip: { EN: 'Mix well with topsoil.', HI: 'ऊपरी मिट्टी के साथ अच्छी तरह मिलाएं।', KN: 'ಮಣ್ಣಿನ ಮೇಲ್ಪದರದೊಂದಿಗೆ ಚೆನ್ನಾಗಿ ಬೆರೆಸಿ.' }
  },
  'foliar-feeding': {
    title: { EN: 'Foliar Feeding', HI: 'पर्णीय पोषण', KN: 'ಎಲೆಗಳಿಗೆ ಪೋಷಕಾಂಶ ನೀಡುವುದು' },
    points: {
      EN: ['Nutrients absorbed via leaves.', 'Fast response in crops.', 'Fixes micro-nutrient deficiency.'],
      HI: ['पत्तियों के माध्यम से अवशोषित पोषक तत्व।', 'फसलों में त्वरित प्रतिक्रिया।', 'सूक्ष्म पोषक तत्वों की कमी को दूर करता है।'],
      KN: ['ಎಲೆಗಳ ಮೂಲಕ ಪೋಷಕಾಂಶ ಪಡೆಯುವುದು.', 'ಬೆಳೆಗಳಿಗೆ ತಕ್ಷಣ ಶಕ್ತಿ ಸಿಗುತ್ತದೆ.', 'ಲಘು ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ನೀಗಿಸುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Spray Zinc Sulphate if paddy leaves turn brown.',
      HI: 'व्यावहारिक: यदि धान की पत्तियां भूरी हो जाएं तो जिंक सल्फेट का छिड़काव करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಭತ್ತದ ಎಲೆಗಳು ಕಂದು ಬಣ್ಣಕ್ಕೆ ತಿರುಗಿದರೆ ಜಿಂಕ್ ಸಲ್ಫೇಟ್ ಸಿಂಪಡಿಸಿ.'
    },
    tip: { EN: 'Spray during morning or evening.', HI: 'सुबह या शाम के समय स्प्रे करें।', KN: 'ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ಸಿಂಪಡಿಸಿ.' }
  },
  'green-manure': {
    title: { EN: 'Green Manuring', HI: 'हरी खाद', KN: 'ಹಸಿರು ಗೊಬ್ಬರ' },
    points: {
      EN: ['Plants grown and buried in soil.', 'Adds high organic Nitrogen.', 'Improves soil water holding.'],
      HI: ['मिट्टी में उगाए और दफन किए गए पौधे।', 'उच्च जैविक नाइट्रोजन जोड़ता है।', 'मिट्टी के जल धारण में सुधार करता है।'],
      KN: ['ಗಿಡಗಳನ್ನು ಬೆಳೆಸಿ ಅಲ್ಲೇ ಮಣ್ಣಿಗೆ ಸೇರಿಸುವುದು.', 'ಹೆಚ್ಚಿನ ಸಾರಜನಕ ಸಿಗುತ್ತದೆ.', 'ಮಣ್ಣು ನೀರನ್ನು ಹಿಡಿದಿಡುವ ಶಕ್ತಿ ಪಡೆಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Grow Dhaincha for 45 days and plough it back into soil.',
      HI: 'व्यावहारिक: 45 दिनों तक ढैंचा उगाएं और इसे वापस मिट्टी में जोत दें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಡೈಂಚಾ ಬೆಳೆಸಿ 45 ದಿನಕ್ಕೆ ಭೂಮಿಗೆ ಉಳುಮೆ ಮಾಡಿ.'
    },
    tip: { EN: 'Plough back before flowering.', HI: 'फूल आने से पहले वापस जोत दें।', KN: 'ಹೂವು ಬಿಡುವ ಮೊದಲೇ ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ.' }
  },
  'bio-fertilizers': {
    title: { EN: 'Bio-Fertilizers', HI: 'जैव उर्वरक', KN: 'ಜೈವಿಕ ಗೊಬ್ಬರಗಳು' },
    points: {
      EN: ['Living microbes fix Nitrogen.', 'Solubilize fixed Phosphorus.', 'Reduces urea use by 25%.'],
      HI: ['जीवित सूक्ष्मजीव नाइट्रोजन स्थिर करते हैं।', 'स्थिर फास्फोरस को घुलनशील बनाते हैं।', 'यूरिया के प्रयोग को 25% कम करता है।'],
      KN: ['ಜೈವಿಕ ಸೂಕ್ಷ್ಮಾಣುಜೀವಿಗಳು ಸಾರಜನಕ ನೀಡುತ್ತವೆ.', 'ರಂಜಕವನ್ನು ಗಿಡಕ್ಕೆ ಸಿಗುವಂತೆ ಮಾಡುತ್ತವೆ.', 'ಯೂರಿಯಾ ಬಳಕೆಯನ್ನು ಶೇ. 25 ರಷ್ಟು ಕಡಿಮೆ ಮಾಡಬಹುದು.']
    },
    example: {
      EN: 'Practical: Treat Soyabean seeds with Rhizobium culture before sowing.',
      HI: 'व्यावहारिक: बुवाई से पहले सोयाबीन के बीजों को राइजोबियम कल्चर से उपचारित करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಸೋಯಾಬೀನ್ ಬಿತ್ತುವ ಮೊದಲು ರೈಜೋಬಿಯಂನೊಂದಿಗೆ ಬಿಜೋಪಚಾರ ಮಾಡಿ.'
    },
    tip: { EN: 'Keep away from chemical pesticides.', HI: 'रासायनिक कीटनाशकों से दूर रखें।', KN: 'ರಾಸಾಯನಿಕಗಳ ಜೊತೆಗೆ ಇದನ್ನು ಬಳಸಬೇಡಿ.' }
  },
  'fertigation': {
    title: { EN: 'Fertigation Basics', HI: 'फर्टिगेशन की बुनियादी बातें', KN: 'ಫರ್ಟಿಗೇಷನ್ ಮೂಲಭೂತ ಅಂಶಗಳು' },
    points: {
      EN: ['Mix fertilizer in drip water.', 'Zero waste of nutrients.', 'Saves labor cost.'],
      HI: ['ड्रिप के पानी में उर्वरक मिलाएं।', 'पोषक तत्वों की शून्य बर्बादी।', 'श्रम लागत बचाता है।'],
      KN: ['ಹನಿ ನೀರಾವರಿ ಜೊತೆ ಗೊಬ್ಬರ ನೀಡುವುದು.', 'ಗೊಬ್ಬರ ಪೋಲಾಗುವುದಿಲ್ಲ.', 'ಕೂಲಿ ಆಳುಗಳ ಖರ್ಚು ಉಳಿಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Use water-soluble NPK (19:19:19) via Venturi injector.',
      HI: 'व्यावहारिक: वेंचुरी इंजेक्टर के माध्यम से जल-घुलनशील एनपीके (19:19:19) का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ವೆಂಚುರಿ ಮೂಲಕ ನೀರಿನಲ್ಲಿ ಕರಗುವ ಗೊಬ್ಬರ ನೀಡಿ.'
    },
    tip: { EN: 'Flush lines after each application.', HI: 'प्रत्येक आवेदन के बाद लाइनों को फ्लश करें।', KN: 'ಗೊಬ್ಬರ ನೀಡಿದ ನಂತರ ಪೈಪ್‌ಗಳನ್ನು ನೀರಿನಿಂದ ಸ್ವಚ್ಛಗೊಳಿಸಿ.' }
  },

  // --- ANIMAL HUSBANDRY ---
  'dairy-mgmt': {
    title: { EN: 'Dairy Management', HI: 'डेयरी प्रबंधन', KN: 'ಹೈನುಗಾರಿಕೆ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Better feed = More milk.', 'Regular vet checkups.', 'Clean drinking water 24/7.'],
      HI: ['बेहतर चारा = अधिक दूध।', 'नियमित पशु चिकित्सक जांच।', 'स्वच्छ पेयजल 24/7।'],
      KN: ['ಉತ್ತಮ ಆಹಾರ = ಹೆಚ್ಚು ಹಾಲು.', 'ನಿಯಮಿತವಾಗಿ ಪಶುವೈದ್ಯರಿಂದ ತಪಾಸಣೆ.', 'ಯಾವಾಗಲೂ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರು ಇರಲಿ.']
    },
    example: {
      EN: 'Practical: Feed 1kg concentrate extra for every 2.5kg of milk.',
      HI: 'व्यावहारिक: प्रत्येक 2.5 किलो दूध के लिए 1 किलो अतिरिक्त चारा खिलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಪ್ರತಿ 2.5 ಲೀಟರ್ ಹಾಲಿಗೆ 1 ಕೆಜಿ ಹೆಚ್ಚಿನ ಹಿಂಡಿ ನೀಡಿ.'
    },
    tip: { EN: 'Milk cows at same time daily.', HI: 'रोजाना एक ही समय पर गायों का दूध निकालें।', KN: 'ಪ್ರತಿದಿನ ಒಂದೇ ಸಮಯಕ್ಕೆ ಹಾಲು ಕರೆಯಿರಿ.' }
  },
  'poultry-care': {
    title: { EN: 'Poultry Care', HI: 'पोल्ट्री देखभाल', KN: 'ಕೋಳಿ ಸಾಕಣೆ ಆರೈಕೆ' },
    points: {
      EN: ['Keep floor dry with saw dust.', 'Vaccinate against Ranikhet disease.', 'Maintain proper ventilation.'],
      HI: ['लकड़ी के बुरादे से फर्श को सूखा रखें।', 'रानीखेत रोग के खिलाफ टीकाकरण करें।', 'उचित वेंटिलेशन बनाए रखें।'],
      KN: ['ಕೋಳಿ ಕೊಟ್ಟಿಗೆಯನ್ನು ಒಣದಾಗಿ ಇರಿಸಿ.', 'ರಾಣಿಖೇತ್ ರೋಗದ ವಿರುದ್ಧ ಲಸಿಕೆ ಹಾಕಿ.', 'ಗಾಳಿಯಾಡುವ ವ್ಯವಸ್ಥೆ ಇರಲಿ.']
    },
    example: {
      EN: 'Practical: Use brooder heaters for chicks in the first 2 weeks.',
      HI: 'व्यावहारिक: पहले 2 हफ्तों में चूजों के लिए ब्रूडर हीटर का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮೊದಲ 2 ವಾರ ಸಣ್ಣ ಕೋಳಿ ಮರಿಗಳಿಗೆ ಬೆಚ್ಚಗಿನ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.'
    },
    tip: { EN: 'Change water every morning.', HI: 'हर सुबह पानी बदलें।', KN: 'ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ ನೀರು ಬದಲಿಸಿ.' }
  },
  'fodder-crops': {
    title: { EN: 'Fodder Crops', HI: 'चारा फसलें', KN: 'ಮೇವು ಬೆಳೆಗಳು' },
    points: {
      EN: ['High protein for animals.', 'Saves cost on buying feed.', 'Year-round availability.'],
      HI: ['जानवरों के लिए उच्च प्रोटीन।', 'चारा खरीदने की लागत बचाता है।', 'साल भर उपलब्धता।'],
      KN: ['ಪ್ರಾಣಿಗಳಿಗೆ ಹೆಚ್ಚಿನ ಪ್ರೋಟೀನ್ ಸಿಗುತ್ತದೆ.', 'ಆಹಾರ ಖರೀದಿಸುವ ಖರ್ಚು ಉಳಿಯುತ್ತದೆ.', 'ವರ್ಷವಿಡೀ ಆಹಾರ ಸಿಗುವಂತೆ ಮಾಡಬಹುದು.']
    },
    example: {
      EN: 'Practical: Grow Hybrid Napier grass for high biomass dairy feed.',
      HI: 'व्यावहारिक: उच्च बायोमास डेयरी चारे के लिए हाइब्रिड नेपियर घास उगाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಎಮ್ಮೆ, ಹಸುಗಳಿಗೆ ಹೈಬ್ರಿಡ್ ನೇಪಿಯರ್ ಹುಲ್ಲು ಬೆಳೆಯಿರಿ.'
    },
    tip: { EN: 'Cut grass at the right stage.', HI: 'घास को सही अवस्था में काटें।', KN: 'ಹುಲ್ಲನ್ನು ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ಕಟಾವು ಮಾಡಿ.' }
  },
  'disease-prev': {
    title: { EN: 'Disease Prevention', HI: 'रोग की रोकथाम', KN: 'ರೋಗ ತಡೆಗಟ್ಟುವಿಕೆ' },
    points: {
      EN: ['Isolate sick animals.', 'Timely deworming.', 'Sanitize shed regularly.'],
      HI: ['बीमार जानवरों को अलग करें।', 'समय पर कृमि मुक्ति।', 'नियमित रूप से शेड को सैनिटाइज करें।'],
      KN: ['ಕಾಯಿಲೆ ಬಂದ ಪ್ರಾಣಿಗಳನ್ನು ಬೇರ್ಪಡಿಸಿ.', 'ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಜಂತುಹುಳು ನಿವಾರಣೆ ಮಾಡಿ.', 'ಕೊಟ್ಟಿಗೆಯನ್ನು ಶುಚಿಯಾಗಿ ಇಡಿ.']
    },
    example: {
      EN: 'Practical: Use foot-baths with lime at shed entrance.',
      HI: 'व्यावहारिक: शेड के प्रवेश द्वार पर चूने के साथ फुट-बाथ का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಕೊಟ್ಟಿಗೆಯ ಮುಂಭಾಗದಲ್ಲಿ ಸುಣ್ಣದ ಪುಡಿ ಇರಿಸಿ.'
    },
    tip: { EN: 'Follow vaccination calendar.', HI: 'टीकाकरण कैलेंडर का पालन करें।', KN: 'ಲಸಿಕೆ ಹಾಕುವ ವೇಳಾಪಟ್ಟಿ ಪಾಲಿಸಿ.' }
  },
  'apiary': {
    title: { EN: 'Beekeeping Basics', HI: 'मधुमक्खी पालन', KN: 'ಜೇನು ಸಾಕಣೆ ಮೂಲಭೂತ ಅಂಶಗಳು' },
    points: {
      EN: ['Bees help pollinate crops.', 'Source of honey and wax.', 'Easy extra income.'],
      HI: ['मधुमक्खियां फसलों को परागित करने में मदद करती हैं।', 'शहद और मोम का स्रोत।', 'आसान अतिरिक्त आय।'],
      KN: ['ಜೇನುನೊಣಗಳು ಇಳುವರಿ ಹೆಚ್ಚಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.', 'ಜೇನುತುಪ್ಪ ಮತ್ತು ಮೇಣದ ಮೂಲ.', 'ಹೆಚ್ಚುವರಿ ಆದಾಯದ ಮೂಲ.']
    },
    example: {
      EN: 'Practical: Keep boxes near Sunflower or Mustard for best honey.',
      HI: 'व्यावहारिक: सर्वोत्तम शहद के लिए बक्सों को सूरजमुखी या सरसों के पास रखें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಸೂರ್ಯಕಾಂತಿ ಅಥವಾ ಸಾಸಿವೆ ಗದ್ದೆ ಬಳಿ ಪೆಟ್ಟಿಗೆ ಇರಿಸಿ.'
    },
    tip: { EN: 'Don\'t spray toxic chemicals.', HI: 'जहरीले रसायनों का छिड़काव न करें।', KN: 'ವಿಷಕಾರಿ ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸಬೇಡಿ.' }
  },

  // --- WEATHER ---
  'monsoon-prep': {
    title: { EN: 'Monsoon Preparation', HI: 'मानसून की तैयारी', KN: 'ಮುಂಗಾರು ಸಿದ್ಧತೆ' },
    points: {
      EN: ['Clear drainage channels.', 'Avoid fertilizer during rain.', 'Repair roof of sheds.'],
      HI: ['जल निकासी चैनलों को साफ करें।', 'बारिश के दौरान उर्वरक से बचें।', 'शेड की छतों की मरम्मत करें।'],
      KN: ['ಕಾಲುವೆಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.', 'ಮಳೆ ಬರುವಾಗ ಗೊಬ್ಬರ ಹಾಕಬೇಡಿ.', 'ಕೊಟ್ಟಿಗೆಯ ಮೇಲ್ಛಾವಣಿ ಸರಿಪಡಿಸಿ.']
    },
    example: {
      EN: 'Practical: Dig trenches around field to stop water logging.',
      HI: 'व्यावहारिक: जलभराव रोकने के लिए खेत के चारों ओर खाइयां खोदें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ನೀರು ನಿಲ್ಲದಂತೆ ಗದ್ದೆಯ ಸುತ್ತ ಚರಂಡಿ ಮಾಡಿ.'
    },
    tip: { EN: 'Watch for flood alerts.', HI: 'बाढ़ अलर्ट पर नजर रखें।', KN: 'ಪ್ರವಾಹದ ಮುನ್ಸೂಚನೆ ಗಮನಿಸಿ.' }
  },
  'drought-mgmt': {
    title: { EN: 'Drought Management', HI: 'सूखा प्रबंधन', KN: 'ಬರ ನಿರ್ವಹಣೆ' },
    points: {
      EN: ['Prioritize high value crops.', 'Use drip at night.', 'Reduce plant population.'],
      HI: ['उच्च मूल्य वाली फसलों को प्राथमिकता दें।', 'रात में ड्रिप का प्रयोग करें।', 'पौधों की संख्या कम करें।'],
      KN: ['ಹೆಚ್ಚು ಬೆಲೆಯ ಬೆಳೆಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಿ.', 'ರಾತ್ರಿ ವೇಳೆ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ.', 'ಗಿಡಗಳ ಸಂಖ್ಯೆ ಕಡಿಮೆ ಮಾಡಿ.']
    },
    example: {
      EN: 'Practical: Mulch with 4-inch straw to save soil moisture.',
      HI: 'व्यावहारिक: मिट्टी की नमी बचाने के लिए 4 इंच पुआल से मल्चिंग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ತೇವಾಂಶ ಉಳಿಸಲು ಒಣ ಹುಲ್ಲು ಹರಡಿ.'
    },
    tip: { EN: 'Stop chemical fertilizers.', HI: 'रासायनिक उर्वरक बंद करें।', KN: 'ರಾಸಾಯನಿಕ ಗೊಬ್ಬರ ಬಳಸಬೇಡಿ.' }
  },
  'frost-protection': {
    title: { EN: 'Frost Protection', HI: 'पाले से सुरक्षा', KN: 'ಮಂಜಿನಿಂದ ರಕ್ಷಣೆ' },
    points: {
      EN: ['Irrigate before frost night.', 'Use smoke or covers.', 'Increase air temperature.'],
      HI: ['पाले वाली रात से पहले सिंचाई करें।', 'धुएं या कवर का प्रयोग करें।', 'हवा का तापमान बढ़ाएं।'],
      KN: ['ಮಂಜು ಬೀಳುವ ಮೊದಲು ನೀರು ಹಾಯಿಸಿ.', 'ಹೊಗೆ ಹಾಕುವುದು ಅಥವಾ ಮುಚ್ಚುವುದು ಮಾಡಿ.', 'ಗಾಳಿಯ ತಾಪಮಾನ ಹೆಚ್ಚಿಸಿ.']
    },
    example: {
      EN: 'Practical: Light small fires around field (smoke) at 4 AM.',
      HI: 'व्यावहारिक: सुबह 4 बजे खेत के चारों ओर छोटी आग (धुआं) जलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮುಂಜಾನೆ 4 ಗಂಟೆಗೆ ಗದ್ದೆಯ ಸುತ್ತ ಸಣ್ಣದಾಗಿ ಬೆಂಕಿ ಹಾಕಿ.'
    },
    tip: { EN: 'Water keeps plants warm.', HI: 'पानी पौधों को गर्म रखता है।', KN: 'ನೀರು ಗಿಡಗಳನ್ನು ಬೆಚ್ಚಗಿರಿಸುತ್ತದೆ.' }
  },
  'cyclone-safety': {
    title: { EN: 'Cyclone Safety', HI: 'चक्रवात सुरक्षा', KN: 'ಚಂಡಮಾರುತ ಸುರಕ್ಷಿತೆ' },
    points: {
      EN: ['Secure loose equipment.', 'Harvest ready crops fast.', 'Move animals to safety.'],
      HI: ['ढीले उपकरणों को सुरक्षित करें।', 'तैयार फसलों की तेजी से कटाई करें।', 'जानवरों को सुरक्षित स्थान पर ले जाएं।'],
      KN: ['ಉಪಕರಣಗಳನ್ನು ಭದ್ರವಾಗಿರಿಸಿ.', 'ಕೊಯ್ಲಿಗೆ ಬಂದ ಬೆಳೆ ಕಟಾವು ಮಾಡಿ.', 'ಪ್ರಾಣಿಗಳನ್ನು ಸುರಕ್ಷಿತ ಜಾಗಕ್ಕೆ ಸ್ಥಳಾಂತರಿಸಿ.']
    },
    example: {
      EN: 'Practical: Cut tall banana leaves to stop trees from falling.',
      HI: 'व्यावहारिक: पेड़ों को गिरने से रोकने के लिए केले के ऊंचे पत्तों को काट दें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಬಾಳೆ ಮರಗಳು ಬೀಳದಂತೆ ಎಲೆಗಳನ್ನು ಕತ್ತರಿಸಿ.'
    },
    tip: { EN: 'Keep emergency feed stock.', HI: 'आपातकालीन चारा स्टॉक रखें।', KN: 'ತುರ್ತು ಆಹಾರ ಸಂಗ್ರಹಿಸಿಡಿ.' }
  },
  'climate-smart': {
    title: { EN: 'Climate-Smart Farming', HI: 'जलवायु-अनुकूल खेती', KN: 'ಹವಾಮಾನ ಸ್ನೇಹಿ ಕೃಷಿ' },
    points: {
      EN: ['Use weather-tolerant seeds.', 'Carbon sequestering soil.', 'Flexible sowing times.'],
      HI: ['मौसम-सहनशील बीजों का प्रयोग करें।', 'कार्बन पृथक्करण वाली मिट्टी।', 'लचीला बुवाई समय।'],
      KN: ['ಹವಾಮಾನಕ್ಕೆ ಒಗ್ಗುವ ಬೀಜ ಬಳಸಿ.', 'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಕಾಪಾಡಿ.', 'ಬಿತ್ತುವ ಸಮಯ ಬದಲಿಸಿಕೊಳ್ಳಿ.']
    },
    example: {
      EN: 'Practical: Shift sowing by 15 days based on rainfall delay.',
      HI: 'व्यावहारिक: बारिश में देरी के आधार पर बुवाई को 15 दिन आगे बढ़ाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮಳೆ ತಡವಾದರೆ ಬಿತ್ತುವ ಸಮಯವನ್ನೂ ತಡ ಮಾಡಿ.'
    },
    tip: { EN: 'Diversify your farm.', HI: 'अपने खेत में विविधता लाएं।', KN: 'ಹಲವು ತರಹದ ಬೆಳೆ ಬೆಳೆಯಿರಿ.' }
  },

  // --- SEEDS ---
  'seed-treatment': {
    title: { EN: 'Seed Treatment', HI: 'बीज उपचार', KN: 'ಬೀಜೋಪಚಾರ' },
    points: {
      EN: ['Kills fungus on seeds.', 'Improves germination.', 'Faster early growth.'],
      HI: ['बीजों पर लगे फंगस को मारता है।', 'अंकुरण में सुधार करता है।', 'तेजी से प्रारंभिक विकास।'],
      KN: ['ಬೀಜದ ಶಿಲೀಂಧ್ರ ನಾಶಮಾಡುತ್ತದೆ.', 'ಮೊಳಕೆ ಒಡೆಯುವುದು ಸುಧಾರಿಸುತ್ತದೆ.', 'ಗಿಡ ಬೇಗ ಬೆಳೆಯುತ್ತದೆ.']
    },
    example: {
      EN: 'Practical: Use 3g Thiram for 1kg seeds before sowing.',
      HI: 'व्यावहारिक: बुवाई से पहले 1 किलो बीज के लिए 3 ग्राम थिरम का प्रयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 1 ಕೆಜಿ ಬೀಜಕ್ಕೆ 3 ಗ್ರಾಂ ಥಿರಮ್ ಬಳಸಿ.'
    },
    tip: { EN: 'Dry in shade, not sun.', HI: 'छाया में सुखाएं, धूप में नहीं।', KN: 'ನೆರಳಿನಲ್ಲಿ ಒಣಗಿಸಿ, ಬಿಸಿಲಿನಲ್ಲಿ ಬೇಡ.' }
  },
  'germination-test': {
    title: { EN: 'Germination Testing', HI: 'अंकुरण परीक्षण', KN: 'ಮೊಳಕೆ ಪರೀಕ್ಷೆ' },
    points: {
      EN: ['Check if seeds are alive.', 'Save cost of re-sowing.', 'Test before buying bulk.'],
      HI: ['जांचें कि बीज जीवित हैं या नहीं।', 'दोबारा बुवाई की लागत बचाएं।', 'थोक खरीदने से पहले परीक्षण करें।'],
      KN: ['ಬೀಜ ಮೊಳಕೆ ಬರುತ್ತದೆಯೇ ಪರೀಕ್ಷಿಸಿ.', 'ಮತ್ತೆ ಬಿತ್ತುವ ಖರ್ಚು ಉಳಿಯುತ್ತದೆ.', 'ಹೆಚ್ಚು ಬೀಜ ಕೊಳ್ಳುವ ಮೊದಲು ಪರೀಕ್ಷಿಸಿ.']
    },
    example: {
      EN: 'Practical: Place 100 seeds in wet cloth. Check after 5 days.',
      HI: 'व्यावहारिक: गीले कपड़े में 100 बीज रखें। 5 दिन बाद जांच करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: 100 ಬೀಜಗಳನ್ನು ಹಸಿ ಬಟ್ಟೆಯಲ್ಲಿ ಕಟ್ಟಿ 5 ದಿನ ಬಿಡಿ.'
    },
    tip: { EN: 'Success > 80% is good.', HI: 'सफलता > 80% अच्छी है।', KN: 'ಶೇ. 80 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೊಳಕೆ ಬಂದರೆ ಉತ್ತಮ.' }
  },
  'storage-tips': {
    title: { EN: 'Seed Storage', HI: 'बीज भंडारण', KN: 'ಬೀಜ ಸಂಗ್ರಹಣೆ' },
    points: {
      EN: ['Keep in airtight bags.', 'Zero moisture entry.', 'Protect from rats/insects.'],
      HI: ['वायुरोधी बैग में रखें।', 'नमी का प्रवेश शून्य रखें।', 'चूहों/कीड़ों से बचाएं।'],
      KN: ['ಗಾಳಿಯಾಡದ ಚೀಲದಲ್ಲಿರಿಸಿ.', 'ತೇವಾಂಶ ಇರದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.', 'ಇಲಿ, ಕೀಟಗಳಿಂದ ರಕ್ಷಿಸಿ.']
    },
    example: {
      EN: 'Practical: Mix dried neem leaves in seed bins to repel pests.',
      HI: 'व्यावहारिक: कीटों को भगाने के लिए बीज के डिब्बों में सूखे नीम के पत्ते मिलाएं।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಸಂಗ್ರಹಿಸಿದ ಬೀಜಕ್ಕೆ ಒಣ ಬೇವಿನ ಎಲೆ ಬೆರೆಸಿ.'
    },
    tip: { EN: 'Store in cool dark place.', HI: 'ठंडी अंधेरी जगह में स्टोर करें।', KN: 'ತಂಪಾದ ಕತ್ತಲೆ ಜಾಗದಲ್ಲಿ ಸಂಗ್ರಹಿಸಿ.' }
  },
  'hybrid-vs-local': {
    title: { EN: 'Hybrid vs Local Seeds', HI: 'हाइब्रिड बनाम स्थानीय बीज', KN: 'ಹೈಬ್ರಿಡ್ ಮತ್ತು ಸ್ಥಳೀಯ ಬೀಜಗಳು' },
    points: {
      EN: ['Hybrid gives more yield.', 'Local are more disease resistant.', 'Local seeds can be saved.'],
      HI: ['हाइब्रिड अधिक पैदावार देता है।', 'स्थानीय अधिक रोग प्रतिरोधी हैं।', 'स्थानीय बीजों को बचाया जा सकता है।'],
      KN: ['ಹೈಬ್ರಿಡ್ ಹೆಚ್ಚು ಇಳುವರಿ ನೀಡುತ್ತದೆ.', 'ಸ್ಥಳೀಯ ಬೀಜಕ್ಕೆ ರೋಗ ಕಡಿಮೆ.', 'ಸ್ಥಳೀಯ ಬೀಜವನ್ನು ಮುಂದಿನ ವರ್ಷಕ್ಕೆ ಬಳಸಬಹುದು.']
    },
    example: {
      EN: 'Practical: Use Hybrid for commercial farming, Local for home/low cost.',
      HI: 'व्यावहारिक: व्यावसायिक खेती के लिए हाइब्रिड, घरेलू/कम लागत के लिए स्थानीय का उपयोग करें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ವ್ಯಾಪಾರಕ್ಕಾಗಿ ಹೈಬ್ರಿಡ್, ಮನೆಗೆ ಸ್ಥಳೀಯ ಬೀಜ ಬಳಸಿ.'
    },
    tip: { EN: 'Hybrids need more fertilizer.', HI: 'हाइब्रिड को अधिक उर्वरक की आवश्यकता होती है।', KN: 'ಹೈಬ್ರಿಡ್‌ಗೆ ಹೆಚ್ಚಿನ ಗೊಬ್ಬರ ಬೇಕು.' }
  },
  'seed-saving': {
    title: { EN: 'Saving Heirloom Seeds', HI: 'विरासत बीजों का संरक्षण', KN: 'ಪಾರಂಪರಿಕ ಬೀಜಗಳ ಉಳಿಸುವಿಕೆ' },
    points: {
      EN: ['Save seeds from best plants.', 'Preserves taste and culture.', 'Zero seed cost next year.'],
      HI: ['सर्वोत्तम पौधों से बीज बचाएं।', 'स्वाद और संस्कृति को संरक्षित करता है।', 'अगले साल बीज की शून्य लागत।'],
      KN: ['ಉತ್ತಮ ಗಿಡದ ಬೀಜ ಸಂಗ್ರಹಿಸಿ.', 'ಹಳೆಯ ತಳಿಗಳ ರುಚಿ ಉಳಿಯುತ್ತದೆ.', 'ಬೀಜದ ಖರ್ಚು ಇರುವುದಿಲ್ಲ.']
    },
    example: {
      EN: 'Practical: Select the biggest, healthiest chili for next year\'s seeds.',
      HI: 'व्यावहारिक: अगले साल के बीज के लिए सबसे बड़ी, स्वास्थ्यप्रद मिर्च चुनें।',
      KN: 'ಪ್ರಾಯೋಗಿಕ: ಮುಂದಿನ ವರ್ಷಕ್ಕಾಗಿ ದೊಡ್ಡದಾದ ಮೆಣಸಿನಕಾಯಿ ಆರಿಸಿ ಬೀಜ ತೆಗೆಯಿರಿ.'
    },
    tip: { EN: 'Only save from non-hybrids.', HI: 'केवल गैर-हाइब्रिड से बचाएं।', KN: 'ಕೇವಲ ಸ್ಥಳೀಯ ಬೀಜಗಳನ್ನು ಮಾತ್ರ ಉಳಿಸಿಕೊಳ್ಳಿ.' }
  }
};

// --- COMPONENT ---

export default function KnowledgeHub({ onBack }: { onBack?: () => void }) {
  const [lang, setLang] = useState<Language>('EN');
  const [view, setView] = useState<ViewState>('grid');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Stop speech when component unmounts or language/topic changes
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
    
    // Attempt to set matching language voice
    if (lang === 'HI') utterance.lang = 'hi-IN';
    else if (lang === 'KN') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const currentTopicData = activeTopic ? TOPIC_CONTENT[activeTopic] : null;

  return (
    <div className="min-h-screen bg-[#F1F8E9] p-4 md:p-8 font-sans selection:bg-[#81C784]/30 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-neutral-100">
          <div className="flex items-center gap-4">
            {view === 'grid' && onBack && (
              <button 
                onClick={onBack}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} className="text-neutral-600" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 mb-1 flex items-center gap-3">
                {view !== 'grid' ? null : <BookOpen className="text-[#2E7D32]" size={32} />}
                {lang === 'EN' ? 'Knowledge Hub' : lang === 'HI' ? 'ज्ञान केंद्र' : 'ಜ್ಞಾನ ಕೇಂದ್ರ'}
              </h1>
              <p className="text-neutral-500 font-medium">
                {lang === 'EN' ? 'Learn farming in a simple way' : lang === 'HI' ? 'खेती को आसान तरीके से सीखें' : 'ಕೃಷಿಯನ್ನು ಸರಳವಾಗಿ ಕಲಿಯಿರಿ'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-50 p-1.5 rounded-xl border border-neutral-200">
            {(['EN', 'HI', 'KN'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                  lang === l 
                    ? "bg-[#2E7D32] text-white shadow-md" 
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        {/* --- DYNAMIC CONTENT AREA --- */}
        <AnimatePresence mode="wait">
          
          {/* 1. GRID VIEW */}
          {view === 'grid' && (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder={lang === 'EN' ? "Search farming topics..." : lang === 'HI' ? "खेती के विषय खोजें..." : "ಕೃಷಿ ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ..."}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#81C784]/50 focus:border-[#2E7D32] transition-all font-medium text-neutral-800 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setView('category'); }}
                    className="bg-white p-6 rounded-[12px] border border-neutral-100 shadow-sm hover:shadow-md hover:border-[#81C784]/50 transition-all cursor-pointer group flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-14 h-14 bg-[#F1F8E9] rounded-2xl flex items-center justify-center text-[#2E7D32] group-hover:scale-110 transition-transform duration-300">
                      <cat.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-1">{cat.title[lang]}</h3>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed">{cat.desc[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. CATEGORY VIEW */}
          {view === 'category' && activeCategory && (
            <motion.div 
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <button 
                onClick={() => setView('grid')}
                className="flex items-center gap-2 text-neutral-600 hover:text-[#2E7D32] font-semibold text-sm transition-colors bg-white w-fit px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
              >
                <ChevronLeft size={16} /> {lang === 'EN' ? 'Back to Categories' : lang === 'HI' ? 'श्रेणियों पर वापस' : 'ವರ್ಗಗಳಿಗೆ ಹಿಂತಿರುಗಿ'}
              </button>

              <div className="bg-white p-6 rounded-[12px] border border-neutral-100 shadow-sm mb-6 flex items-center gap-4">
                {CATEGORIES.find(c => c.id === activeCategory)?.icon && React.createElement(CATEGORIES.find(c => c.id === activeCategory)!.icon, { size: 32, className: "text-[#2E7D32]" })}
                <h2 className="text-2xl font-bold text-neutral-900">
                  {CATEGORIES.find(c => c.id === activeCategory)?.title[lang]}
                </h2>
              </div>

              <div className="grid gap-4">
                {(TOPICS[activeCategory] || []).map((topic) => (
                  <div 
                    key={topic.id}
                    className="bg-white p-5 rounded-[12px] border border-neutral-200 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1 group-hover:text-[#2E7D32] transition-colors">{topic.title[lang]}</h3>
                      <p className="text-sm text-neutral-500">{topic.desc[lang]}</p>
                    </div>
                    <button 
                      onClick={() => { setActiveTopic(topic.id); setView('topic'); setIsSaved(false); }}
                      className="shrink-0 px-5 py-2.5 bg-[#F1F8E9] text-[#2E7D32] font-bold rounded-lg hover:bg-[#2E7D32] hover:text-white transition-colors border border-[#81C784]/30"
                    >
                      {lang === 'EN' ? 'Read More' : lang === 'HI' ? 'और पढ़ें' : 'ಇನ್ನಷ್ಟು ಓದಿ'}
                    </button>
                  </div>
                ))}
                {(!TOPICS[activeCategory] || TOPICS[activeCategory].length === 0) && (
                  <div className="p-8 text-center text-neutral-500 bg-white rounded-[12px] border border-neutral-200 border-dashed">
                     {lang === 'EN' ? 'More topics coming soon!' : 'अधिक विषय जल्द ही आ रहे हैं!'}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 3. TOPIC DETAIL VIEW */}
          {view === 'topic' && currentTopicData && (
            <motion.div 
              key="topic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setView('category')}
                className="flex items-center gap-2 text-neutral-600 hover:text-[#2E7D32] font-semibold text-sm transition-colors bg-white w-fit px-4 py-2 rounded-lg border border-neutral-200 shadow-sm"
              >
                <ChevronLeft size={16} /> {lang === 'EN' ? 'Back to Topics' : lang === 'HI' ? 'विषयों पर वापस' : 'ವಿಷಯಗಳಿಗೆ ಹಿಂತಿರುಗಿ'}
              </button>

              <div className="bg-white rounded-[16px] shadow-sm border border-neutral-200 overflow-hidden">
                {/* Topic Header */}
                <div className="bg-[#2E7D32] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                    {currentTopicData.title[lang]}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setIsSaved(!isSaved)}
                      className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                    >
                      <Bookmark size={20} className={isSaved ? "fill-white" : ""} />
                    </button>
                    <button 
                      onClick={() => {
                        const fullText = [
                          currentTopicData.title[lang],
                          ...currentTopicData.points[lang],
                          currentTopicData.example[lang],
                          currentTopicData.tip[lang]
                        ].join(". ");
                        handleSpeak(fullText);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-colors backdrop-blur-sm shadow-sm",
                        isPlaying ? "bg-red-500 text-white" : "bg-white text-[#2E7D32] hover:bg-neutral-50"
                      )}
                    >
                      {isPlaying ? <Square size={18} className="fill-current" /> : <Volume2 size={18} />}
                      {isPlaying ? (lang === 'EN' ? 'Stop' : lang === 'HI' ? 'रुकें' : 'ನಿಲ್ಲಿಸು') : (lang === 'EN' ? 'Listen' : lang === 'HI' ? 'सुनें' : 'ಆಲಿಸಿ')}
                    </button>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Simple Explanation */}
                  <div className="space-y-4">
                    {currentTopicData.points[lang].map((point: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#81C784] shrink-0" />
                        <p className="text-neutral-800 text-lg leading-relaxed font-medium">{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Example Box */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-[12px] p-5">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <BookOpen size={14} /> 
                      {lang === 'EN' ? 'Real-life Example' : lang === 'HI' ? 'वास्तविक जीवन का उदाहरण' : 'ನಿಜ ಜೀವನದ ಉದಾಹರಣೆ'}
                    </h4>
                    <p className="text-neutral-800 italic">"{currentTopicData.example[lang]}"</p>
                  </div>

                  {/* Highlight Tip Box */}
                  <div className="bg-[#F1F8E9] border border-[#81C784]/50 rounded-[12px] p-5 flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2E7D32] shadow-sm">
                      <Lightbulb size={20} className="fill-yellow-400 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2E7D32] mb-1">
                        {lang === 'EN' ? 'Pro Tip' : lang === 'HI' ? 'विशेष सुझाव' : 'ವಿಶೇಷ ಸಲಹೆ'}
                      </h4>
                      <p className="text-neutral-700 font-medium">{currentTopicData.tip[lang]}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-900 text-white rounded-[10px] font-bold shadow-md hover:bg-[#2E7D32] transition-colors">
                    <MessageSquare size={18} />
                    {lang === 'EN' ? 'Ask AI about this topic' : lang === 'HI' ? 'AI से इस विषय के बारे में पूछें' : 'ಈ ವಿಷಯದ ಬಗ್ಗೆ AI ಅನ್ನು ಕೇಳಿ'}
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
