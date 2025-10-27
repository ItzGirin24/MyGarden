// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo5_3ujYZuEpgnl5UMQ7kpIz9Pk-aKXME",
  authDomain: "mygarden-b6ee1.firebaseapp.com",
  projectId: "mygarden-b6ee1",
  storageBucket: "mygarden-b6ee1.firebasestorage.app",
  messagingSenderId: "165148659167",
  appId: "1:165148659167:web:d4a1fd86fea018d5c2c86a",
  measurementId: "G-8BH2R61P88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
