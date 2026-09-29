# MP Online Healthcare App — CareFlow

## Overview

**Problem:**
Healthcare journeys can be fragmented between patients, frontline workers, doctors, ambulances and hospitals.

**Current solution:**
A Gemini-powered voice intake assistant that converts natural speech into structured patient information for further clinical workflow.

**Current implementation:**
Gemini voice assistant / voice intake.

**Future system:**
Triage → doctor/teleconsultation or emergency coordination → ambulance → hospital destination → routing → handoff → follow-up.

**Technology currently used:**
- Next.js
- React
- TypeScript
- Gemini API
- Gemini Live API
- Tailwind CSS

## Hackathon Status

Current working prototype:
Gemini voice intake.

Demo flow:
User/ASHA speaks → Gemini voice interaction → patient information extraction → structured intake summary

Future emergency flow:
intake → triage → ambulance → hospital recommendation → Google Maps routing → hospital handoff

*Note: Future operational hospital/ambulance data may initially use simulated data for the prototype.*

## Git Branching Strategy

`main` = stable branch

Future development branches:
- feature/triage
- feature/hospital-network
- feature/doctor-discovery
- feature/ambulance
- feature/google-maps
- feature/destination-engine
- feature/command-center
- feature/emergency-workflow
