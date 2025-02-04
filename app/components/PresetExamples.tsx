import { HouseDetails } from '../types/house';

export const housePresets: { name: string; details: HouseDetails; image: string }[] = [
  {
    name: "Modern Family Home",
    details: {
      totalArea: 2500,
      bedrooms: 4,
      bathrooms: 3,
      floors: 2,
      style: "modern",
      hasGarage: true,
      hasGarden: true
    },
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Minimalist Studio",
    details: {
      totalArea: 800,
      bedrooms: 1,
      bathrooms: 1,
      floors: 1,
      style: "minimalist",
      hasGarage: false,
      hasGarden: false
    },
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Traditional Cottage",
    details: {
      totalArea: 1800,
      bedrooms: 3,
      bathrooms: 2,
      floors: 1,
      style: "traditional",
      hasGarage: true,
      hasGarden: true
    },
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

export default function PresetExamples({ onSelect }: { onSelect: (details: HouseDetails) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {housePresets.map((preset, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="relative h-64">
            <img
              src={preset.image}
              alt={preset.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-bold text-white mb-2">{preset.name}</h3>
              <div className="text-sm text-gray-200 space-y-1">
                <p>{preset.details.totalArea} sq ft</p>
                <p>{preset.details.bedrooms} bedrooms, {preset.details.bathrooms} bathrooms</p>
                <p className="capitalize">{preset.details.style} style</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelect(preset.details)}
            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600/80 flex items-center justify-center"
          >
            <span className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Use This Design
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}