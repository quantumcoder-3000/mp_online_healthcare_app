# CareFlow

## Part 1: Voice Intake

CareFlow is an AI-assisted healthcare orchestration platform designed for rural and emergency healthcare. This repository implements **Part 1**, the voice-based patient intake module.

### Architecture

```
User / ASHA
 ↓
Deepgram Voice Agent
 ↓
Gemini (via Deepgram Think Provider)
 ↓
Structured Patient Intake
 ↓
CareFlow UI
```

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Create a `.env.local` file in the root directory:
   ```env
   DEEPGRAM_API_KEY=your_deepgram_api_key_here
   # GEMINI_API_KEY=... (Handled via Deepgram-managed Gemini in this architecture)
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/voice](http://localhost:3000/voice) in your browser.

### How to Test

1. Navigate to `/voice`.
2. Click **Start Conversation** and allow microphone access.
3. Test with English, Hindi, or Hinglish phrases.
4. Try providing patient information (e.g., "My name is Ramesh, I am 62, experiencing sudden weakness").
5. The assistant will ask clarifying questions if important information is missing.
6. Once enough info is collected, it will confirm details and generate a structured Patient Intake summary on the UI.

### Current Limitations

*   **No Diagnosis / Medical Decision Making:** The AI acts as an intake assistant to structure information for clinical review. It will not diagnose or prescribe.
*   **Privacy limitations:** This is a prototype. In production, raw audio and full transcripts must be handled with appropriate healthcare compliance (e.g., HIPAA / local equivalents). We do not store permanent medical records in this phase.
*   **Audio constraints:** Operates within browser MediaRecorder and Deepgram's currently available multi-lingual listen models.

### Future Modules (Not in Part 1)

*   Deterministic Triage Engine
*   Ambulance Dispatch
*   Hospital capacity and route optimization
*   Family notification workflows
