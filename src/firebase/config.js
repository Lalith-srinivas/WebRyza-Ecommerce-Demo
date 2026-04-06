import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBJ10Bo6mfGANd0lgkoceB7vX7vtsQw0QU",
  authDomain: "webryza-ecommerce.firebaseapp.com",
  projectId: "webryza-ecommerce",
  storageBucket: "webryza-ecommerce.firebasestorage.app",
  messagingSenderId: "242820867215",
  appId: "1:242820867215:web:46a7a4858e7c1e9c6b3cfa",
  measurementId: "G-SBP4E5XCDL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export default app;
