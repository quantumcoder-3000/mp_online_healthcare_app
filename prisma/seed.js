const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding doctors from Excel...');
  const filePath = 'C:/Users/IRONMAN3000/Desktop/project/healthAI/careflow_synthetic_doctors_100.xlsx';
  
  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);
  
  // Clear existing
  await prisma.doctor.deleteMany({});
  
  let seeded = 0;
  for (const row of data) {
    await prisma.doctor.create({
      data: {
        name: row['Name'] || row['Doctor Name'] || 'Unknown Doctor',
        specialty: row['Specialty'] || row['Department'] || 'General Medicine',
        qualification: row['Qualification'] || row['Degrees'] || 'MBBS',
        experienceYears: parseInt(row['Experience']) || 5,
        registrationRef: row['Registration'] || row['Reg No'] || `DEMO-REG-${Math.floor(Math.random()*10000)}`,
        facility: row['Facility'] || row['Hospital'] || 'CareFlow Demo Clinic',
        city: row['City'] || row['Location'] || 'Bhopal',
        languages: row['Languages'] || 'English, Hindi',
        consultationTypes: row['Consultation Type'] || row['Type'] || 'BOTH',
        availabilitySource: 'DEMO',
        verificationStatus: 'SYNTHETIC DEMO DOCTOR',
        latitude: parseFloat(row['Latitude']) || 23.2599,
        longitude: parseFloat(row['Longitude']) || 77.4126,
      }
    });
    seeded++;
  }
  
  console.log(`Seeded ${seeded} synthetic demo doctors.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
