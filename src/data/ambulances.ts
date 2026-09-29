import { Ambulance } from "../types/ambulance";

/**
 * 10 initial ambulances stationed throughout the Bhopal emergency response grid.
 * Clearly marked as SIMULATED_DEMO.
 */
export const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: "amb-01",
    vehicle_number: "MP-04-AM-1001",
    latitude: 23.2355,
    longitude: 77.4285, // MP Nagar Zone-1 Hub
    status: "AVAILABLE",
    equipment: "ALS",
    crew_type: "PARAMEDIC_DUAL",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 90,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-02",
    vehicle_number: "MP-04-AM-1002",
    latitude: 23.2182,
    longitude: 77.4192, // Bittan Market / Arera Colony Post
    status: "AVAILABLE",
    equipment: "ALS",
    crew_type: "DOCTOR_LED",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 180,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-03",
    vehicle_number: "MP-04-AM-1003",
    latitude: 23.2421,
    longitude: 77.4011, // New Market / TT Nagar
    status: "AVAILABLE",
    equipment: "BLS",
    crew_type: "EMT_BASIC",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 45,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-04",
    vehicle_number: "MP-04-AM-1004",
    latitude: 23.2845,
    longitude: 77.3621, // Lalghati / Airport Junction
    status: "AVAILABLE",
    equipment: "ALS",
    crew_type: "PARAMEDIC_DUAL",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 120,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-05",
    vehicle_number: "MP-04-AM-1005",
    latitude: 23.2492,
    longitude: 77.4682, // Govindpura / BHEL Foundry Gate
    status: "AVAILABLE",
    equipment: "BLS",
    crew_type: "EMT_BASIC",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 270,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-06",
    vehicle_number: "MP-04-AM-1006",
    latitude: 23.1842,
    longitude: 77.4195, // Kolar Road Checkpoint
    status: "AVAILABLE",
    equipment: "ALS",
    crew_type: "PARAMEDIC_DUAL",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 0,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-07",
    vehicle_number: "MP-04-AM-1007",
    latitude: 23.2294,
    longitude: 77.4338, // Board Office Square / Shivaji Nagar
    status: "AVAILABLE", // Primary demonstration vehicle
    equipment: "ALS",
    crew_type: "DOCTOR_LED",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 135,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-08",
    vehicle_number: "MP-04-AM-1008",
    latitude: 23.2891,
    longitude: 77.4312, // Karond Chauraha
    status: "AVAILABLE",
    equipment: "BLS",
    crew_type: "EMT_BASIC",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 210,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-09",
    vehicle_number: "MP-04-AM-1009",
    latitude: 23.1612,
    longitude: 77.4498, // Misrod / Hoshangabad Corridor
    status: "AVAILABLE",
    equipment: "ALS",
    crew_type: "PARAMEDIC_DUAL",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 315,
    data_source: "SIMULATED_DEMO",
  },
  {
    id: "amb-10",
    vehicle_number: "MP-04-AM-1010",
    latitude: 23.2682,
    longitude: 77.4721, // Ayodhya Bypass Hub
    status: "AVAILABLE",
    equipment: "NEONATAL_ICU",
    crew_type: "DOCTOR_LED",
    current_case_id: null,
    destination_hospital_id: null,
    speed_kmh: 0,
    heading: 180,
    data_source: "SIMULATED_DEMO",
  },
];
