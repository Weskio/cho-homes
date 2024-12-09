import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

export interface Message {
  id: string;
  propertyId: string;
  propertyTitle: string;
  from: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: Date;
}

const MESSAGES_COLLECTION = 'messages';

// Add a new message
export const addMessage = async (message: Omit<Message, 'id' | 'isRead' | 'isStarred' | 'createdAt'>) => {
  try {
    const messageData = {
      ...message,
      isRead: false,
      isStarred: false,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

// Get all messages
export const getMessages = async () => {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as Message[];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Update message (e.g., mark as read/starred)
export const updateMessage = async (id: string, updates: Partial<Message>) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, id);
    await updateDoc(messageRef, updates);
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (id: string) => {
  try {
    const messageRef = doc(db, MESSAGES_COLLECTION, id);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
