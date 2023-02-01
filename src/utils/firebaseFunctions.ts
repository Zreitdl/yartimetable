import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uid } from "uid";
import { auth, db } from "../config/firebase";
import { TimetableRecord } from "../models/TimetableRecord";
import { TimetableSettings, User } from "../models/User";
import { nameof } from "./nameof";
import { userDataStore } from "./userStore";

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


export const getTimetableRecord = async (uid: string) => {
  if (!auth.currentUser?.uid) {
    throw new Error("userId can't be empty");
  }

  if (!uid) {
    throw new Error("recordId can't be empty");
  }

  const docSnapshot = await getDoc(doc(db, "users", auth.currentUser?.uid, "timetableRecords", uid));

  if (!docSnapshot.exists()) {
    throw new Error("Record not found");
  }

  return { ...docSnapshot.data(), id: docSnapshot.id } as TimetableRecord;
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

export const getCurrentUserData : () => Promise<User> = async () => {
  console.log("Retrieving current user data...");

  if (!auth.currentUser) {
    throw new Error("There is no user logged in");
  }

  const docSnapshot = await getDoc(doc(db, "users", auth.currentUser.uid));

  if (!docSnapshot.exists()) {
    throw new Error('There is no user data with provided uid');
  }

  const currentUserData = { ...docSnapshot.data() as User };

  userDataStore.setData(currentUserData);
  console.log("user", currentUserData);

  return currentUserData;
}

export const updateCurrentUserTimetableSettings = async (data: TimetableSettings) => {
  if (!auth.currentUser) {
    throw new Error("There is no user logged in");
  }

  return setDoc(
    doc(db, "users", auth.currentUser.uid),
    { [nameof<User>("timetableSettings")]: data },
    { merge: true }
  );
}
