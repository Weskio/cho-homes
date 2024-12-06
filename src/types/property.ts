import { Property as APIProperty } from '../services/api';
import { FirebaseProperty } from '../services/properties.firebase';

export type PropertySource = 'api' | 'local';

export interface PropertyPhoto {
  url: string
}

export interface PropertyLocation {
  name: string
}

export interface PropertyState {
  id: string
  title: string
  description: string
  price: number
  rentFrequency?: string
  rooms: number
  baths: number
  area: number
  coverPhoto: PropertyPhoto
  photos: PropertyPhoto[]
  location: PropertyLocation[]
  furnishingStatus: string | null
  purpose: string
  type: string
  state: string
}

export function mapFirebaseToAPIProperty(p: FirebaseProperty & { id?: string }): PropertyState {
  return {
    id: p.id || '',
    title: p.title,
    description: p.description,
    price: p.price,
    rentFrequency: p.purpose === 'for-rent' ? 'monthly' : undefined,
    rooms: p.bedrooms,
    baths: p.bathrooms,
    area: p.area,
    coverPhoto: { url: p.photos[0] },
    photos: p.photos.map(url => ({ url })),
    location: [{ name: p.location }],
    furnishingStatus: null,
    purpose: p.purpose,
    type: p.propertyType,
    state: 'active',
  };
}
