import {
  dataPlanTypes,
  DBTransactionTypes,
  userDataTypes,
} from "@/src/utils/types";

import { create } from "zustand";

//state types
export interface UserStore {
  user: userDataTypes | null;
  storeUser: (user: userDataTypes) => void;
}

export interface UsersStore {
  users: userDataTypes[];
  storeUsers: (users: userDataTypes[]) => void;
  updateUsers: (user: userDataTypes) => void;
}

export interface DataStore {
  plans: dataPlanTypes | null;
  storePlans: (plans: dataPlanTypes) => void;
}

export interface TransactionStore {
  transactions: DBTransactionTypes[];
  storeTransactions: (transactions: DBTransactionTypes[]) => void;
}

// global states

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  storeUser: (user) => {
    set((state) => {
      state.user = user;

      return {
        user: state.user,
      };
    });
  },
}));

export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  storeUsers: (users) => {
    set((state) => {
      state.users = users;

      return {
        users: state.users,
      };
    });
  },

  updateUsers: (user) => {
    set((state) => {
      const updatedUsers = state.users.filter(
        (storedUser) => storedUser.email !== user.email
      );

      updatedUsers.push(user);

      state.users = updatedUsers;

      return {
        users: state.users,
      };
    });
  },
}));

//data plans

export const useDataPlanStore = create<DataStore>((set) => ({
  plans: null,
  storePlans(plans) {
    set((state) => {
      state.plans = plans;

      return {
        plans: state.plans,
      };
    });
  },
}));

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  storeTransactions(transactions) {
    set((state) => {
      state.transactions = transactions;

      return {
        trasactions: state.transactions,
      };
    });
  },
}));
