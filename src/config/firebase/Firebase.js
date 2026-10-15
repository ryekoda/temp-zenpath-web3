import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getAnalytics, isSupported } from "firebase/analytics";



// export const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
    apiKey: "AIzaSyAVz1D8a8rZKXr9_IvDlzgqZ4fArHCDQ7g",
    authDomain: "triply-c94e3.firebaseapp.com",
    databaseURL: "https://triply-c94e3.firebaseio.com",
    projectId: "triply-c94e3",
    storageBucket: "triply-c94e3.appspot.com",
    messagingSenderId: "844063912665",
    appId: "1:844063912665:web:44b5ab42227d09844b44c8",
    measurementId: "G-5BZQNFL2ZH"
  };


// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);


export { app, auth, db, analytics };
