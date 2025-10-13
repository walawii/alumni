import React, { useState, useEffect } from 'react';
import { getGalleryImages } from '../services/galleryService';
import type { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setImages(getGalleryImages());
  }, []);

  return (
    <div className="py-16 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Galeri Kenangan</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Momen Tak Terlupakan
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Jelajahi kembali momen-momen indah selama di SMAN 7 Tasikmalaya dan di berbagai acara alumni.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <img
                src={image.url}
                alt={`Gallery image ${image.id}`}
                className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;