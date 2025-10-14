import type { Alumni } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'alumni';

// Function to get all alumni from the mock API
export const getAlumni = async (): Promise<Alumni[]> => {
  return await apiGet(DB_KEY);
};

// Function to add a new alumnus
export const addAlumni = async (newAlumnus: Omit<Alumni, 'id'> & { id?: number }): Promise<void> => {
  const alumni = await getAlumni();
  const alumnusToAdd: Alumni = {
    ...newAlumnus,
    id: newAlumnus.id || Date.now(), // Ensure ID exists
  };
  const updatedAlumni = [...alumni, alumnusToAdd];
  await apiSet(DB_KEY, updatedAlumni);
};

// Function to update an existing alumnus
export const updateAlumni = async (updatedAlumnus: Alumni): Promise<void> => {
  const alumni = await getAlumni();
  const updatedAlumniList = alumni.map(a => 
    a.id === updatedAlumnus.id ? updatedAlumnus : a
  );
  await apiSet(DB_KEY, updatedAlumniList);
};

// Function to delete an alumnus by ID
export const deleteAlumni = async (alumnusId: number): Promise<void> => {
  const alumni = await getAlumni();
  const updatedAlumni = alumni.filter(a => a.id !== alumnusId);
  await apiSet(DB_KEY, updatedAlumni);
};
