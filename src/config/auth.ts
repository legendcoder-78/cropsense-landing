import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCdLPXET0TwKoxuSxWDmNDC1T7mTgUv6DA",
    authDomain: "cropsense-landing.firebaseapp.com",
    projectId: "cropsense-landing",
    storageBucket: "cropsense-landing.firebasestorage.app",
    messagingSenderId: "727095154295",
    appId: "1:727095154295:web:e376480dc408cab643d872",
    measurementId: "G-9928Y8SH92"
};

const app = initializeApp(firebaseConfig);

// EXPORTS FOR GOOGLE AUTH
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Swapped from GitHub
export { signInWithPopup };