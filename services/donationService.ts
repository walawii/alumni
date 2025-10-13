import type { DonationInfo } from '../types';
import { INITIAL_DONATION_INFO } from '../constants';

const DONATION_DB_KEY = 'donationInfoDatabase';

export const getDonationInfo = (): DonationInfo => {
  try {
    const donationJson = localStorage.getItem(DONATION_DB_KEY);
    if (donationJson) {
      return JSON.parse(donationJson);
    } else {
      localStorage.setItem(DONATION_DB_KEY, JSON.stringify(INITIAL_DONATION_INFO));
      return INITIAL_DONATION_INFO;
    }
  } catch (error) {
    console.error("Failed to parse donation info data from localStorage", error);
    return INITIAL_DONATION_INFO;
  }
};

export const updateDonationInfo = (newDonationInfo: DonationInfo): void => {
  localStorage.setItem(DONATION_DB_KEY, JSON.stringify(newDonationInfo));
};
