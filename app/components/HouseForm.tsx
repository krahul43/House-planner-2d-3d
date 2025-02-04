'use client';

import { useState } from 'react';
import { HouseDetails } from '../types/house';

const houseStyles = ['modern', 'traditional', 'contemporary', 'minimalist'] as const;

export default function HouseForm({ onSubmit }: { onSubmit: (data: HouseDetails) => void }) {
  const [formData, setFormData] = useState<HouseDetails>({
    totalArea: 1500,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    style: 'modern',
    hasGarage: true,
    hasGarden: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (sq ft)</label>
          <input
            type="number"
            value={formData.totalArea}
            onChange={(e) => setFormData({ ...formData, totalArea: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bedrooms</label>
          <input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Floors</label>
          <input
            type="number"
            value={formData.floors}
            onChange={(e) => setFormData({ ...formData, floors: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
            max="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House Style</label>
          <select
            value={formData.style}
            onChange={(e) => setFormData({ ...formData, style: e.target.value as HouseDetails['style'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {houseStyles.map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hasGarage"
              checked={formData.hasGarage}
              onChange={(e) => setFormData({ ...formData, hasGarage: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasGarage" className="text-sm text-gray-700">
              Include Garage
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hasGarden"
              checked={formData.hasGarden}
              onChange={(e) => setFormData({ ...formData, hasGarden: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="hasGarden" className="text-sm text-gray-700">
              Include Garden
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Generate House Plan
      </button>
    </form>
  );
}