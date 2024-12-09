import { FirebaseProperty } from '../services/properties.firebase';

export type PropertySource = 'firebase';

export interface PropertyState extends Omit<FirebaseProperty, 'id'> {
  id?: string;
  source: PropertySource;
}

export function mapFirebaseToAPIProperty(p: FirebaseProperty & { id?: string }): PropertyState {
  return {
    id: p.id || '',
    title: p.title,
    description: p.description,
    price: p.price,
    location: p.location,
    purpose: p.purpose,
    propertyType: p.propertyType,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    photos: p.photos,
    features: p.features,
    contactInfo: p.contactInfo,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    source: 'firebase',
  };
}
