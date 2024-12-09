import { 
  collection,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';

export interface FirebaseUser {
  id?: string;
  email: string;
  uid: string;
  createdAt: Date;
}

const USERS_COLLECTION = 'users';

export const addUser = async (email: string, password: string) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Store user data in Firestore
    const timestamp = Timestamp.now();
    await addDoc(collection(db, USERS_COLLECTION), {
      email,
      uid: userCredential.user.uid,
      createdAt: timestamp
    });

    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already in use');
    }
    throw error;
  }
};

export const getUsers = async (): Promise<FirebaseUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as FirebaseUser[];
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};
