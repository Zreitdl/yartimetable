import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();
export const Providers = { google: new GoogleAuthProvider() };
export const db = getFirestore(firebaseApp);

// export const addActivityRecord = (activity: Activity) => {
//   addDoc(collection(db, "activities"), {
//           Subject,
//           completed: false,
//       });
// }