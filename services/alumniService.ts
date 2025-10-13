import type { Alumni } from '../types';
import { ALUMNI_DATA } from '../constants';

const ALUMNI_DB_KEY = 'alumniDatabase';

// Function to get all alumni from localStorage
export const getAlumni = (): Alumni[] => {
  try {
    const alumniJson = localStorage.getItem(ALUMNI_DB_KEY);
    if (alumniJson) {
      return JSON.parse(alumniJson);
    } else {
      // If no data, initialize with mock data
      localStorage.setItem(ALUMNI_DB_KEY, JSON.stringify(ALUMNI_DATA));
      return ALUMNI_DATA;
    }
  } catch (error) {
    console.error("Failed to parse alumni data from localStorage", error);
    // Fallback to mock data in case of parsing error
    return ALUMNI_DATA;
  }
};

// Function to save all alumni to localStorage
const saveAlumni = (alumni: Alumni[]): void => {
  localStorage.setItem(ALUMNI_DB_KEY, JSON.stringify(alumni));
};

// Function to add a new alumnus
export const addAlumni = (newAlumnus: Omit<Alumni, 'id'> & { id?: number }): void => {
  const alumni = getAlumni();
  const alumnusToAdd: Alumni = {
    ...newAlumnus,
    id: newAlumnus.id || Date.now(), // Ensure ID exists
  };
  const updatedAlumni = [...alumni, alumnusToAdd];
  saveAlumni(updatedAlumni);
};

// Function to update an existing alumnus
export const updateAlumni = (updatedAlumnus: Alumni): void => {
  const alumni = getAlumni();
  const updatedAlumniList = alumni.map(a => 
    a.id === updatedAlumnus.id ? updatedAlumnus : a
  );
  saveAlumni(updatedAlumniList);
};

// Function to delete an alumnus by ID
export const deleteAlumni = (alumnusId: number): void => {
  const alumni = getAlumni();
  const updatedAlumni = alumni.filter(a => a.id !== alumnusId);
  saveAlumni(updatedAlumni);
};
