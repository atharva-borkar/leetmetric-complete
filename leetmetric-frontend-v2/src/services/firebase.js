import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB1bqKTgF1Oh9MvdMkJw42uL98gqlQwn60",
  authDomain: "leetmetric.firebaseapp.com",
  projectId: "leetmetric",
  storageBucket: "leetmetric.firebasestorage.app",
  messagingSenderId: "1018512770846",
  appId: "1:1018512770846:web:a99a07ce70fefdbc0b2b0f",
  measurementId: "G-N7FWZJMDYV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const authApi = {
  signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  },
  signOut() {
    return signOut(auth);
  },
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};
