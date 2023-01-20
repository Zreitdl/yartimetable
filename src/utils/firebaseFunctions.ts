import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { uid } from "uid";
import { auth, db } from "../config/firebase";
import { TimetableRecord } from "../models/TimetableRecord";

export const addOrUpdateUserTimetableRecord = async (data: TimetableRecord) => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  if (!data.id) {
    data.id = uid(20);
  }

  return setDoc(
    doc(db, "users", auth.currentUser?.uid, "timetableRecords", data.id),
    data,
    { merge: true }
  );
};

export const getTimetableRecords = async () => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  const q = query(
    collection(db, "users", auth.currentUser?.uid, "timetableRecords"),
    orderBy("startTime", "asc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as TimetableRecord;
  });
};

export const deleteTimetableRecord = async (uid: string) => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  if (!uid) {
    throw new Error("recordId can't be empty");
  }

  return deleteDoc(
    doc(db, "users", auth.currentUser?.uid, "timetableRecords", uid)
  );
};
