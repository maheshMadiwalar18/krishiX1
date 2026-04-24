# KrishiX – AI-Powered Smart Farming Assistant
*Empowering Farmers with Open-Source Intelligence*

## 🌍 Overview
**KrishiX** is a next-generation, climate-smart farming platform designed to provide farmers with real-time, actionable insights. By combining cutting-edge open-source AI with local environmental data, KrishiX offers instant disease detection, smart irrigation guidance, and a bilingual community hub. Our goal is to democratize high-tech agriculture, making it accessible, affordable, and sustainable for every farmer.

---

## 💡 The Problem & Our Solution
Farmers today face unpredictable weather, emerging crop diseases, and a lack of localized expert advice. **KrishiX** bridges this gap using a "Local-First" AI approach:
- **Instant Diagnosis:** AI-based disease detection using vision models.
- **Climate Intelligence:** Hyper-localized weather alerts and crop-specific advice.
- **Resource Optimization:** Data-driven irrigation strategies to save water and costs.
- **Inclusive Design:** Full support for regional languages (Kannada & English) with integrated Voice and Text-to-Speech.

---

## 🏗 Open-Source Technology Stack
KrishiX is built on a foundation of powerful open-source technologies, ensuring privacy, scalability, and independence from expensive proprietary platforms.

### 🧠 Artificial Intelligence (The Brain)
- **[Ollama](https://ollama.com/):** We use Ollama as our primary AI orchestration layer, allowing us to run high-performance models locally.
- **[LLaVA (Large Language-and-Vision Assistant)](https://llava-vl.github.io/):** Our core vision model for disease detection. It processes crop images locally without requiring constant cloud uploads.
- **[Phi-3 / Mistral]:** Optimized lightweight language models used for generating agricultural advice and processing regional language queries.
- **Hybrid Fallback:** Integrated with **Google Gemini 2.0 Flash** for high-speed cloud-based edge cases.

### 🌐 Weather & Environment
- **[Open-Meteo](https://open-meteo.com/):** An open-source weather API that provides hyper-local hourly and daily forecasts without the restrictive costs of commercial providers.

### 💻 Development & Infrastructure
- **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Icons & UI:** [Lucide React](https://lucide.dev/) & [Framer Motion](https://www.framer.com/motion/)
- **Database/Auth:** [Firebase](https://firebase.google.com/) for secure authentication and cloud synchronization.

---

## ✨ Key Features
- **📸 Disease Detection:** Snap a photo of a leaf/plant to get an instant diagnosis and treatment plan.
- **🌤 Smart Weather Hub:** View live temperature, humidity, wind, and UV index with AI-driven risk alerts.
- **💧 Irrigation Strategy:** Personalized water management based on current climate conditions.
- **📚 Earthworm (Knowledge Base):** A localized digital library for best practices with "Read Aloud" support.
- **🤝 AgriConnect:** A social feed for farmers to share updates, ask questions, and like community posts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- [Ollama](https://ollama.com/) (to run AI locally)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/maheshMadiwalar18/krishiX.git
   cd krishiX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   GEMINI_API_KEY=your_key
   ACCUWEATHER_API_KEY=your_key
   USE_OLLAMA=true
   ```

4. **Run the project:**
   ```bash
   # Start the frontend
   npm run dev
   
   # Start the backend (in a separate terminal)
   npm run server
   ```

---

## 🌱 Our Vision
We believe that the future of farming is open. By utilizing open-source models like LLaVA and Open-Meteo, KrishiX ensures that the most advanced agricultural tools remain in the hands of the people who feed the world—the farmers.

---

## 👥 Meet the Team
- **Hemanth**
- **Chethan**
- **Bharath**
- **Mahesh**

---

## 📄 License
This project is licensed under the MIT License.
