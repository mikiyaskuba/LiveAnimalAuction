import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	addDoc,
} from "firebase/firestore"; // Import necessary functions
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDBhhuImt1upKDDXhw_hETyITPXflvP_3Q",
	authDomain: "liveauction-aa4bc.firebaseapp.com",
	projectId: "liveauction-aa4bc",
	storageBucket: "liveauction-aa4bc.appspot.com",
	messagingSenderId: "712780694128",
	appId: "1:712780694128:web:e90b6a67eedf7c6b4f6ab5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { auth, db, storage, collection, doc, getDocs, addDoc };
