'use client';

import { useRef, useState } from 'react';
import HouseForm from './components/HouseForm';
import HousePlanViewer from './components/HousePlanViewer';
import PresetExamples from './components/PresetExamples';
import ExportPDF from './components/ExportPDF';
import { HouseDetails } from './types/house';

export default function Home() {
  const [houseDetails, setHouseDetails] = useState<HouseDetails | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (data: HouseDetails) => {
    setHouseDetails(data);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🏠</span>
              <span className="text-xl font-bold gradient-text">DreamHome</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#examples" className="text-gray-600 hover:text-blue-600 transition-colors">Examples</a>
              <a href="#customize" className="text-gray-600 hover:text-blue-600 transition-colors">Customize</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent"></div>
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Transform Your Vision Into Reality
            </h1>
            <p className="text-2xl text-gray-200 mb-12 animate-fade-in-delay">
              Create stunning 3D house plans with professional-grade tools and realistic visualizations
            </p>
            <div className="flex space-x-6 animate-fade-in-delay-2">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Designing
              </button>
              <button 
                onClick={() => document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                View Examples
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
            Professional Design Tools
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to create stunning house plans with precision and style
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Precision 2D Plans',
                description: 'Create detailed floor plans with exact measurements and professional annotations',
                icon: '📐',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Realistic 3D Views',
                description: 'Experience your design in immersive 3D with photorealistic materials and lighting',
                icon: '🏠',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Professional Export',
                description: 'Share your designs in multiple formats perfect for clients and contractors',
                icon: '📤',
                color: 'from-green-500 to-green-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover-card bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center text-3xl bg-gradient-to-br ${feature.color} text-white transform group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Popular House Plans
          </h2>
          <PresetExamples onSelect={handleFormSubmit} />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Plan</h2>
              <HouseForm onSubmit={handleFormSubmit} />
            </div>
          </div>
          
          <div>
            {houseDetails ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">Your House Plan</h2>
                  <ExportPDF houseDetails={houseDetails} viewerRef={viewerRef} />
                </div>
                
                <div ref={viewerRef} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <HousePlanViewer houseDetails={houseDetails} />
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">House Details</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Total Area</dt>
                        <dd className="text-lg text-gray-900">{houseDetails.totalArea} sq ft</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Style</dt>
                        <dd className="text-lg text-gray-900 capitalize">{houseDetails.style}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Bedrooms</dt>
                        <dd className="text-lg text-gray-900">{houseDetails.bedrooms}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                        <dd className="text-lg text-gray-900">{houseDetails.bathrooms}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Floors</dt>
                        <dd className="text-lg text-gray-900">{houseDetails.floors}</dd>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dt className="text-sm font-medium text-gray-500">Features</dt>
                        <dd className="text-lg text-gray-900">
                          {[
                            houseDetails.hasGarage && 'Garage',
                            houseDetails.hasGarden && 'Garden'
                          ].filter(Boolean).join(', ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[500px] bg-white rounded-xl shadow-lg border border-gray-100">
                <p className="text-gray-500 text-lg">
                  Select a preset or fill out the form to generate your house plan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🏠</span>
                <span className="text-2xl font-bold">DreamHome</span>
              </div>
              <p className="text-gray-400">
                Creating the future of home design with advanced 3D visualization technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#examples" className="text-gray-400 hover:text-white transition-colors">Examples</a>
                </li>
                <li>
                  <a href="#customize" className="text-gray-400 hover:text-white transition-colors">Customize</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Tutorials</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="text-gray-400">
                  <span className="block">Email:</span>
                  <a href="mailto:support@dreamhome.com" className="text-blue-400 hover:text-blue-300">support@dreamhome.com</a>
                </li>
                <li className="text-gray-400">
                  <span className="block">Phone:</span>
                  <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300">+1 (234) 567-890</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DreamHome. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}