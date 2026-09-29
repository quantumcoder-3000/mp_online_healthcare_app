import { NextResponse } from 'next/server';
import doctorsData from '@/data/doctors.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get('specialty');
  const consultationType = searchParams.get('consultationType');

  let filteredDoctors = [...doctorsData];

  if (specialty) {
    filteredDoctors = filteredDoctors.filter(doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }

  if (consultationType) {
    if (consultationType.toLowerCase() === 'virtual') {
      filteredDoctors = filteredDoctors.filter(doc => doc.virtual_availability === 'DEMO AVAILABLE' || doc.consultation_type.includes('Virtual'));
    } else if (consultationType.toLowerCase() === 'physical') {
      filteredDoctors = filteredDoctors.filter(doc => doc.physical_availability === 'DEMO AVAILABLE' || doc.consultation_type.includes('Physical'));
    }
  }

  // Shuffle/rotate results (anti-bias / fair ranking requirement)
  for (let i = filteredDoctors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredDoctors[i], filteredDoctors[j]] = [filteredDoctors[j], filteredDoctors[i]];
  }

  return NextResponse.json(filteredDoctors);
}
