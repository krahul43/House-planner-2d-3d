export interface HouseDetails {
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  style: 'modern' | 'traditional' | 'contemporary' | 'minimalist';
  hasGarage: boolean;
  hasGarden: boolean;
}

export interface Room {
  name: string;
  width: number;
  length: number;
  x: number;
  z: number;
  color: number;
  furniture?: Furniture[];
  doors?: Door[];
  windows?: Window[];
}

interface Furniture {
  type: string;
  width: number;
  length: number;
  x: number;
  z: number;
  rotation: number;
  color: number;
}

interface Door {
  x: number;
  z: number;
  rotation: number;
  width: number;
}

interface Window {
  x: number;
  z: number;
  rotation: number;
  width: number;
}