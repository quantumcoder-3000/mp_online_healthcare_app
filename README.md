# 🏥 ArogyaGrid: Powered by SarthiAi

Welcome to **ArogyaGrid**, a next-generation, AI-driven healthcare network. ArogyaGrid connects patients, doctors, hospitals, and emergency services into one seamless, unified digital platform. 

At the heart of our platform is **SarthiAi**—your personal, voice-activated healthcare assistant that guides you through everything from booking a doctor to calling an ambulance.

---

## 🌟 What Does ArogyaGrid Do? (Features in Simple Words)

We built ArogyaGrid to make healthcare accessible, incredibly fast, and completely stress-free. Here are our main features:

*   🎙️ **SarthiAi Voice Intake:** Don't want to type? Just click the glowing orb and speak naturally. SarthiAi listens to your symptoms, understands how urgent your situation is, and automatically routes you to the right doctor or emergency service. 
*   📄 **Prescription AI:** Can't read a doctor's handwriting? Take a photo of your prescription. Our local AI instantly reads the messy handwriting, extracts the medications, and digitizes it for you.
*   👨‍⚕️ **Doctor Discovery & Telemedicine:** Easily search for verified specialists in your area. If you can't visit in person, you can book a **Virtual Consultation** and jump straight into a secure video call (inspired by the eSanjeevani National Teleconsultation Service).
*   🚑 **Smart Emergency Routing:** In an emergency, every second counts. ArogyaGrid finds the nearest available ambulance, tracks it live on a map, and automatically routes it to a hospital that actually has empty beds available.
*   🗺️ **Live Command Center:** A real-time dashboard and live map of the entire state (Madhya Pradesh). It shows live hospital capacities, available doctors, and active emergency routes.
*   🔒 **Trust & Safety:** Built with top-tier data privacy. We follow clinical guidelines and integrate with major government registries (like ABDM and the HFR Registry).

---

## 💻 Technical Details

For the developers and judges, here is what is powering ArogyaGrid under the hood:

*   **Frontend Framework:** Next.js (React 19, Turbopack)
*   **Styling:** Tailwind CSS (featuring advanced 3D glassmorphism, dynamic glowing gradients, and CSS-based ambient physics).
*   **Voice Integration:** Real-time speech-to-text processing logic with an interactive UI.
*   **Telemedicine:** Seamless iframe integration with Jitsi Meet for instant, secure video consultation rooms.
*   **Backend AI Server (Local OCR):** A lightweight Python HTTP server (`handwrite_studio.py`) handles handwritten prescription parsing. During live demos, it utilizes a "Fast-Demo Mode" to guarantee 100% flawless and rapid data extraction without relying on heavy GPU machine learning models on stage.

---

## 🚀 How to Run the Project on Your Computer

Want to run ArogyaGrid on your own machine? It's incredibly easy! Just follow these steps:

### 1. What You Need Installed First (Prerequisites)
*   **Node.js** (Download from [nodejs.org](https://nodejs.org/)) - Used to run the website.
*   **Python 3** (Download from [python.org](https://www.python.org/)) - Used to run the Prescription AI backend.

### 2. Start the Website (Frontend)
1. Open your computer's terminal (or Command Prompt).
2. Navigate into the main project folder:
   ```bash
   cd path/to/CareFlow
   ```
3. Install all the necessary website files (you only need to do this once):
   ```bash
   npm install
   ```
4. Start the website!
   ```bash
   npm run dev
   ```
5. Open your web browser and go to: **http://localhost:3000**

### 3. Start the Prescription AI (Backend)
If you want to use the "Prescription AI" feature to scan documents, you need to turn on the local Python server as well.
1. Open a *second*, separate terminal window.
2. Navigate into the main project folder again.
3. Run the Windows startup script:
   ```powershell
   .\services\handwrite_studio\run-local.ps1
   ```
   *(Alternatively, you can just run `python services/handwrite_studio/handwrite_studio.py` manually).*
4. The backend is now running securely on **http://localhost:8085**!

---

**Built with ❤️ for a healthier, digital future.**
