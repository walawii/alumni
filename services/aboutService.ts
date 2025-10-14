import type { AboutInfo } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'about';

export const getAboutInfo = async (): Promise<AboutInfo> => {
  return await apiGet(DB_KEY);
};

export const updateAboutInfo = async (newAboutInfo: AboutInfo): Promise<void> => {
  await apiSet(DB_KEY, newAboutInfo);
};
