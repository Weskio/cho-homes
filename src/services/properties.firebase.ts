import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from './firebase';

export interface FirebaseProperty {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  purpose: 'for-rent' | 'for-sale';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  photos: string[];
  features: string[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PROPERTIES_COLLECTION = 'properties';

// Add a new property
export const addProperty = async (property: Omit<FirebaseProperty, 'id' | 'createdAt' | 'updatedAt'>, images: File[]) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to add properties');
    }

    const photoUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(storage, `property-images/${currentUser.uid}/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        return getDownloadURL(snapshot.ref);
      })
    );

    const propertyData = {
      ...property,
      photos: photoUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), propertyData);
    return { id: docRef.id, ...propertyData };
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

// Update an existing property
export const updateProperty = async (
  id: string,
  updates: Partial<FirebaseProperty>,
  newImages?: File[],
  currentImages: string[] = [],
  removedImageUrls?: string[]
) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to update properties');
    }

    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    
    // Get current property data to preserve existing photos
    let photoUrls = [...currentImages]

    // Remove specified images
    if (removedImageUrls && removedImageUrls.length > 0) {
      photoUrls = photoUrls.filter(url => !removedImageUrls.includes(url));
    }

    // Upload and add new images
    if (newImages && newImages.length > 0) {
      const newPhotoUrls = await Promise.all(
        newImages.map(async (image) => {
          const storageRef = ref(storage, `property-images/${currentUser.uid}/${Date.now()}-${image.name}`);
          const snapshot = await uploadBytes(storageRef, image);
          return getDownloadURL(snapshot.ref);
        })
      );
      photoUrls = [...photoUrls, ...newPhotoUrls];
    }

    // Ensure we're not overwriting photos if none were changed
    const updateData = {
      ...updates,
      photos: photoUrls,
      updatedAt: new Date(),
    };

    await updateDoc(propertyRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id: string) => {
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

// Get all properties with optional filters
export const getProperties = async (filters?: {
  purpose?: 'for-rent' | 'for-sale';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: string;
  minBedrooms?: number;
}) => {
  try {
    let q = collection(db, PROPERTIES_COLLECTION);
    const conditions = [];

    // Build query based on filters
    if (filters) {
      if (filters.purpose) {
        conditions.push(where('purpose', '==', filters.purpose));
      }
      if (filters.minPrice) {
        conditions.push(where('price', '>=', filters.minPrice));
      }
      if (filters.maxPrice) {
        conditions.push(where('price', '<=', filters.maxPrice));
      }
      if (filters.location) {
        // Use case-insensitive contains for location
        conditions.push(where('location', '>=', filters.location.toLowerCase()));
        conditions.push(where('location', '<=', filters.location.toLowerCase() + '\uf8ff'));
      }
      if (filters.propertyType) {
        conditions.push(where('propertyType', '==', filters.propertyType));
      }
      if (filters.minBedrooms) {
        conditions.push(where('bedrooms', '>=', filters.minBedrooms));
      }
    }

    // Add ordering by createdAt
    if (conditions.length > 0) {
      q = query(q, ...conditions, orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as FirebaseProperty[];
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

// Get a single property by ID
export const getPropertyById = async (id: string) => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const docSnap = await getDocs(query(collection(db, PROPERTIES_COLLECTION), where('__name__', '==', id)));
    
    if (!docSnap.empty) {
      const propertyData = docSnap.docs[0].data();
      return {
        id: docSnap.docs[0].id,
        ...propertyData,
        createdAt: propertyData.createdAt?.toDate(),
        updatedAt: propertyData.updatedAt?.toDate()
      } as FirebaseProperty;
    }
    return null;
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

// Get a single property
export const getProperty = async (id: string): Promise<FirebaseProperty | null> => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const docSnap = await getDocs(query(collection(db, PROPERTIES_COLLECTION), where('id', '==', id)));
    
    if (docSnap.empty) {
      return null;
    }

    const data = docSnap.docs[0].data() as FirebaseProperty;
    return { ...data, id: docSnap.docs[0].id };
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};
