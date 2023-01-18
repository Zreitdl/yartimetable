import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from "firebase/firestore";
import { uid } from "uid";
import { auth, db } from "../config/firebase";
import { TimetableRecord } from "../models/TimetableRecord";

export const addOrUpdateUserTimetableRecord = async (data: TimetableRecord) => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  if (!data.uid) {
    data.uid = uid(20);
  }

  return setDoc(
    doc(db, "users", auth.currentUser?.uid, "timetableRecords", data.uid),
    data,
    { merge: true }
  );
};

export const getTimetableRecords = async () => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  const q = query(collection(db, "users", auth.currentUser?.uid, "timetableRecords"), orderBy("startTime", "asc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => { return {...(doc.data() as TimetableRecord), uid: doc.id, }});
};
