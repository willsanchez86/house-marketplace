// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBXlAm3LvSrAGHFMZ-t7HGQky_davtD-co',
  authDomain: 'house-marketplace-ab650.firebaseapp.com',
  projectId: 'house-marketplace-ab650',
  storageBucket: 'house-marketplace-ab650.appspot.com',
  messagingSenderId: '65463790057',
  appId: '1:65463790057:web:52ec04fe95c9d67ec0c378',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();

//Initialize Firebase Authentication
// const auth = getAuth(app);
