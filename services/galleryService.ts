import type { GalleryImage } from '../types';
import { GALLERY_IMAGES } from '../constants';

const GALLERY_DB_KEY = 'galleryDatabase';

// Function to get all gallery images from localStorage
export const getGalleryImages = (): GalleryImage[] => {
  try {
    const galleryJson = localStorage.getItem(GALLERY_DB_KEY);
    if (galleryJson) {
      return JSON.parse(galleryJson);
    } else {
      // If no data, initialize with mock data
      localStorage.setItem(GALLERY_DB_KEY, JSON.stringify(GALLERY_IMAGES));
      return GALLERY_IMAGES;
    }
  } catch (error) {
    console.error("Failed to parse gallery data from localStorage", error);
    return GALLERY_IMAGES;
  }
};

// Function to save all gallery images to localStorage
const saveGalleryImages = (images: GalleryImage[]): void => {
  localStorage.setItem(GALLERY_DB_KEY, JSON.stringify(images));
};

// Function to add a new gallery image
export const addGalleryImage = (imageUrl: string): void => {
  const images = getGalleryImages();
  const newImage: GalleryImage = {
    id: Date.now(),
    url: imageUrl,
  };
  saveGalleryImages([...images, newImage]);
};

// Function to delete a gallery image by ID
export const deleteGalleryImage = (imageId: number): void => {
  const images = getGalleryImages();
  const updatedImages = images.filter(img => img.id !== imageId);
  saveGalleryImages(updatedImages);
};
