import type { Settings } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'settings';

export const getSettings = async (): Promise<Settings> => {
  return await apiGet(DB_KEY);
};

export const updateSettings = async (newSettings: Settings): Promise<void> => {
  await apiSet(DB_KEY, newSettings);
};
