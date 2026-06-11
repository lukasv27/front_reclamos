import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0ZhKU47_p7M3lGiF44XoRYtuoDkiKsnA",
  authDomain: "agora-cl.firebaseapp.com",
  projectId: "agora-cl",
  storageBucket: "agora-cl.firebasestorage.app",
  messagingSenderId: "5715521284",
  appId: "1:5715521284:web:250804cdfa098d0ca12a51",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
