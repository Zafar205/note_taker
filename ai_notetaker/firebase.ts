// Import the functions you need from the SDKs you need
import { initializeApp, getApp,getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyB25rMy46aXeVrzpvCP_sVbDtMYw7AlCrs",
  authDomain: "ai-notetaker-2024.firebaseapp.com",
  projectId: "ai-notetaker-2024",
  storageBucket: "ai-notetaker-2024.appspot.com",
  messagingSenderId: "761507235307",
  appId: "1:761507235307:web:362f02d0e90ea751a505ae"

};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {db};