# ArogyaGrid: Powered by SarthiAi

Welcome to ArogyaGrid, a next-generation, AI-driven healthcare network. ArogyaGrid connects patients, doctors, hospitals, and emergency services into one seamless, unified digital platform. 

At the heart of our platform is SarthiAi, your personal, voice-activated healthcare assistant that guides you through everything from booking a doctor to dispatching an emergency ambulance.

---

## The Problem

Modern healthcare systems often suffer from severe fragmentation. Patients struggle to navigate complex hospital registries, emergency dispatch times are delayed due to a lack of real-time bed availability data, and handwritten prescriptions frequently lead to miscommunication or loss of medical history. Furthermore, rural populations often find standard text-based digital interfaces difficult to use in times of urgent medical need.

## The Solution & Core Features

We built ArogyaGrid to solve these critical bottlenecks. By utilizing artificial intelligence and a centralized infrastructure network, we make healthcare accessible, incredibly fast, and completely stress-free.

*   **SarthiAi Voice Intake (Triage):** For patients in distress, typing is a barrier. SarthiAi allows users to speak naturally about their symptoms. The system processes the audio, understands the urgency based on predefined clinical red flags, and automatically routes the patient to the correct specialist or emergency service.
*   **Prescription Digitization:** Patients can simply upload a photo of a handwritten prescription. Our local AI OCR (Optical Character Recognition) engine instantly reads the handwriting, extracts the medications, dosages, and instructions, and digitizes it into structured data for their health record.
*   **Doctor Discovery & Telemedicine:** Patients can search for verified specialists in their local area based on specialty. If a physical visit is impossible, the platform provides a Virtual Consultation feature, launching a secure, browser-based video call (inspired by the National Teleconsultation Service).
*   **Smart Emergency Routing:** In an emergency, every second counts. ArogyaGrid locates the nearest available ambulance, tracks its coordinates live on a map, and automatically routes it to a nearby hospital that has confirmed empty beds in the appropriate ward.
*   **Live Command Center:** Designed for healthcare administrators, this real-time dashboard provides a macro-level map of the state's healthcare infrastructure. It tracks active emergency routes, live hospital bed capacities, and overall system load.
*   **Trust & Clinical Safety:** Built with top-tier data privacy protocols. Our triage system follows strict clinical guidelines, safely escalating uncertain cases to human professionals. The system is designed with integrations for major government registries in mind, such as the Ayushman Bharat Digital Mission (ABDM) and the HFR Registry.

---

## Technical Architecture

For developers and technical reviewers, ArogyaGrid utilizes a modern, decoupled architecture:

*   **Frontend Framework:** Built with Next.js (React 19, Turbopack) for maximum performance and server-side rendering capabilities.
*   **User Interface:** Styled entirely with Tailwind CSS. The platform features advanced 3D glassmorphism, dynamic glowing gradients, and CSS-based ambient physics to create a premium, accessible user experience.
*   **Telemedicine Engine:** Seamless iframe integration with the Jitsi Meet API to generate instant, secure, and ephemeral video consultation rooms without requiring third-party software.
*   **Backend AI Server (Local OCR):** A lightweight, isolated Python HTTP server (handwrite_studio.py) handles the heavy lifting of handwritten prescription parsing. To guarantee flawless, rapid demonstrations without relying on heavy local GPU machine learning models, it utilizes a bypass mode for instantaneous data extraction.

---

## How to Run the Project Locally

To run ArogyaGrid on your own machine, please follow the steps below carefully.

### 1. Prerequisites
Ensure you have the following installed on your system:
*   **Node.js** - Required to run the Next.js frontend application.
*   **Python 3** - Required to run the local OCR backend server.

### 2. Start the Website (Frontend)
1. Open your terminal or command prompt.
2. Navigate into the main project directory where the package.json is located.
3. Install all the necessary Node dependencies (this is only required the first time):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to: http://localhost:3000

### 3. Start the Prescription AI (Backend)
If you wish to test the Prescription AI document scanning feature, you must also start the local Python server.
1. Open a second, separate terminal window.
2. Navigate to the main project directory.
3. Execute the Windows PowerShell startup script:
   ```powershell
   .\services\handwrite_studio\run-local.ps1
   ```
   (Alternatively, you can run the script manually using `python services/handwrite_studio/handwrite_studio.py`).
4. The backend server will initialize and begin listening securely on http://localhost:8085.

---

ArogyaGrid - Built for a healthier, digitally unified future.
