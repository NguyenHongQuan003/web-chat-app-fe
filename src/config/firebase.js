import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAZ0MczzhMNUi_u70e1Tq4RG9COZuxOA6k",
  authDomain: "verify-otp-d40ca.firebaseapp.com",
  projectId: "verify-otp-d40ca",
  storageBucket: "verify-otp-d40ca.firebasestorage.app",
  messagingSenderId: "351883525189",
  appId: "1:351883525189:web:ba1700e79e2e9bb219772c",
  measurementId: "G-37X0KLSEB5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
