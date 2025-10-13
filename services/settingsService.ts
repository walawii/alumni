import type { Settings } from '../types';
import { INITIAL_SETTINGS } from '../constants';

const SETTINGS_DB_KEY = 'settingsDatabase';

export const getSettings = (): Settings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_DB_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    } else {
      localStorage.setItem(SETTINGS_DB_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
  } catch (error) {
    console.error("Failed to parse settings data from localStorage", error);
    return INITIAL_SETTINGS;
  }
};

export const updateSettings = (newSettings: Settings): void => {
  localStorage.setItem(SETTINGS_DB_KEY, JSON.stringify(newSettings));
};
