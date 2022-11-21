import { getStorage } from "firebase/storage"; 
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDDm6wbCjQ-_czrTNXQxPHrcYSa-v4KKqU",
  authDomain: "todo-645a2.firebaseapp.com",
  projectId: "todo-645a2",
  storageBucket: "todo-645a2.appspot.com",
  messagingSenderId: "25381540465",
  appId: "1:25381540465:web:646f41e3147a19d96f81d0",
  measurementId: "G-KXHMF4Z85J"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {app, storage, db}