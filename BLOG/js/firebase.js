// Firebase configuration (ADWF Blog)
const firebaseConfig = {
  apiKey: "AIzaSyAT2j_hi9UPYE9Z9VLu5Ro0DZvPeHEaloc",
  authDomain: "adwf-blog.firebaseapp.com",
  projectId: "adwf-blog",
  storageBucket: "adwf-blog.firebasestorage.app",
  messagingSenderId: "24598016113",
  appId: "1:24598016113:web:946379a7a589426e4f6bd0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();
