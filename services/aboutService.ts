import type { AboutInfo } from '../types';
import { INITIAL_ABOUT_INFO } from '../constants';

const ABOUT_DB_KEY = 'aboutInfoDatabase';

export const getAboutInfo = (): AboutInfo => {
  try {
    const aboutJson = localStorage.getItem(ABOUT_DB_KEY);
    if (aboutJson) {
      return JSON.parse(aboutJson);
    } else {
      localStorage.setItem(ABOUT_DB_KEY, JSON.stringify(INITIAL_ABOUT_INFO));
      return INITIAL_ABOUT_INFO;
    }
  } catch (error) {
    console.error("Failed to parse about info data from localStorage", error);
    return INITIAL_ABOUT_INFO;
  }
};

export const updateAboutInfo = (newAboutInfo: AboutInfo): void => {
  localStorage.setItem(ABOUT_DB_KEY, JSON.stringify(newAboutInfo));
};
