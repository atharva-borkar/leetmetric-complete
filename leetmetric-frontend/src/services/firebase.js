import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const authApi = {
  signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  },
  signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },
  signOut() {
    return signOut(auth);
  },
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },
};
