import { initializeApp, getApps } from '@firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import {
  getFirestore,
  serverTimestamp,
  Timestamp,
  increment,
  collection,
  doc,
  onSnapshot,
  getDoc,
  writeBatch,
  where,
  query,
  limit,
  getDocs,
  orderBy,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAh-9w8LARutP3D6NEu8FjeQ2UrJ36cXfo',
  authDomain: 'rh-forum.firebaseapp.com',
  projectId: 'rh-forum',
  storageBucket: 'rh-forum.appspot.com',
  messagingSenderId: '350340538247',
  appId: '1:350340538247:web:102932fb686ed4ece67d22',
  measurementId: 'G-KPFHGTQ7LS',
};

if (!getApps().length) {
  // if length 0, no app initialized (can only run once)
  const firebaseApp = initializeApp(firebaseConfig);
}

//Auth exports
export const auth = getAuth();
export const auth_provider = new GoogleAuthProvider();
export { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

//Firestore exports
export const firestore_db = getFirestore();
export const server_timestamp = serverTimestamp();
export const fromMillis = Timestamp.fromMillis;
export {
  increment,
  collection,
  doc,
  onSnapshot,
  getDoc,
  writeBatch,
  where,
  query,
  limit,
  getDocs,
  orderBy,
};

/// helper functions

/*
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore_db, 'users');
  const q = query(usersRef, where('username', '==', username), limit(3));
  const UserDoc = await (await getDocs(q)).docs[0];
  return UserDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.createdAt.toMillis(),
  };
}
