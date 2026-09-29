# Integration Contract

The voice module must remain independent from ambulance/hospital code.

## Flow
Voice
  ↓
PatientIntake
  ↓
TriageResult
  ↓
DestinationRequest

## PatientIntake Interface
- patient_name
- age
- sex
- main_complaint
- symptoms
- duration
- onset
- associated_symptoms
- medical_history
- current_medications
- allergies
- additional_information
- summary
