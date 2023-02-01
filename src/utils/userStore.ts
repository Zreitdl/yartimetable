import { User } from "../models/User";

const currentUserDataStore = () => {
  let _data: User | undefined = undefined;

  return {
    setData : (userData: User) => {
      _data = userData;
    },

    getData : () => {
      return _data;
    },
  };
};

export const userDataStore = currentUserDataStore();