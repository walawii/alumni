import type { GalleryImage } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'gallery';

// Function to get all gallery images from the mock API
export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  return await apiGet(DB_KEY);
};

// Function to add a new gallery image
export const addGalleryImage = async (imageUrl: string): Promise<void> => {
  const images = await getGalleryImages();
  const newImage: GalleryImage = {
    id: Date.now(),
    url: imageUrl,
  };
  const updatedImages = [newImage, ...images];
  await apiSet(DB_KEY, updatedImages);
};

// Function to delete a gallery image by ID
export const deleteGalleryImage = async (imageId: number): Promise<void> => {
  const images = await getGalleryImages();
  const updatedImages = images.filter(img => img.id !== imageId);
  await apiSet(DB_KEY, updatedImages);
};
