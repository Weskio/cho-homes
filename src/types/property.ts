import { FirebaseProperty } from '../services/properties.firebase';
import { Property } from '../services/api';

export type PropertySource = 'firebase' | 'api';

export interface PropertyState extends Omit<FirebaseProperty, 'id'> {
  id?: string;
  source: PropertySource;
  externalID?: string;
  phoneNumber?: {
    mobile: string;
    phone: string;
  };
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
    externalID: p.id || '',
    phoneNumber: {
      mobile: p.contactInfo.phone,
      phone: p.contactInfo.phone
    }
  };
}
