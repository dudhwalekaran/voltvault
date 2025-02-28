// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdlZnqzZVrctF_1W46Uw09BI7gtNrfUlY",
  authDomain: "power-system-lab-3ef7f.firebaseapp.com",
  projectId: "power-system-lab-3ef7f",
  storageBucket: "power-system-lab-3ef7f.firebasestorage.app",
  messagingSenderId: "1067026167711",
  appId: "1:1067026167711:web:08b6ec61cb4dbd8ce2efaa",
  measurementId: "G-M90BHKNQNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);