import type { DonationInfo } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'donations';

export const getDonationInfo = async (): Promise<DonationInfo> => {
  return await apiGet(DB_KEY);
};

export const updateDonationInfo = async (newDonationInfo: DonationInfo): Promise<void> => {
  await apiSet(DB_KEY, newDonationInfo);
};
