import axios from "axios";

import {
  AccountType,
  DBTransactionTypes,
  PaystackParams,
  VerifyParams,
  notificationTypes,
  refsTypes,
  transactionTypes,
  userDataTypes,
} from "./types";
import { supabase } from "./supabase";

const monnifyUrl = process.env.EXPO_PUBLIC_MONNIFY_BASEURL as string;

const monnifyApiKey = process.env.EXPO_PUBLIC_MONNIFY_APIKEY as string;

const monnifySecretKey = process.env.EXPO_PUBLIC_MONNIFY_SECRETKEY as string;
const monnifyEncodedKey = btoa(monnifyApiKey + ":" + monnifySecretKey);

//fetch all users

export const fetchAllUsers = async () => {
  try {
    const { data } = await supabase
      .from("users")
      .select(
        "email, username, balance, referrals, referee, referral_bonus, is_admin"
      );

    return data;
  } catch (error) {
    console.log(error);
  }
};

//fetch user in pages

export const fetchUsersByPage = async (page: string) => {
  const minValue = Number(page + "0");
  const maxValue = Number(page + "9");

  console.log(minValue, maxValue);
  try {
    const { data } = await supabase
      .from("users")
      .select(
        "email, username, balance, referrals, referee, referral_bonus, is_admin"
      )
      .range(minValue, maxValue);

    return data;
  } catch (error) {
    console.log(error);
  }
};

//fetches one user by username

export const fetchUser = async (email: string | undefined) => {
  try {
    const { data } = await supabase
      .from("users")
      .select(
        "email, username, balance, referrals, referee, referral_bonus, is_admin"
      )
      .eq("email", email);

    return data;
  } catch (error) {
    console.log(error);
  }
};

//recharges and updates user balance

export const recharge = async (email: string | undefined, amount: string) => {
  try {
    const userData = await fetchUser(email);

    const { balance } = userData![0];

    const newBalance = parseInt(balance) + parseInt(amount);

    const { data, error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", email)
      .select();

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

//deducts from user balance

export const deductBalance = async (user: transactionTypes) => {
  try {
    const newBalance = user.newBalance!;
    const email = user.email!;

    const { data, error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("email", email)
      .select();

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

//creates a transaction

export const setTransaction = async (transaction: transactionTypes) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          email: transaction.email,
          amount: transaction.amount,
          purpose: transaction.purpose,
          status: transaction.status,
          transaction_id: transaction.transactionId,
          phone: transaction.phone,
          network: transaction.network,
          plan_size: transaction.planSize,
          previous_balance: transaction.previousBalance,
          new_balance: transaction.newBalance,
        },
      ])
      .select();
    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

//fetches a logged in user

export const getLoggedUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const data = await fetchUser(user?.email);

    if (data) {
      const user = {
        email: data[0].email,
        username: data[0].username,
        is_admin: data[0].is_admin,
        balance: data[0].balance,
        referrals: data[0].referrals,
        referral_bonus: data[0].referral_bonus,
        referee: data[0].referee,
      };

      return user;
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleCommission = async (
  user: transactionTypes,
  commission: number,
  referee: string | null,
  referral_bonus: string
) => {
  try {
    // const userData = await fetchUser(email);

    // const { referee } = userData![0];

    // const refereeData = await fetchUser(referee)

    // const {referral_bonus} = refereeData![0]

    let newBonus = parseInt(referral_bonus) + commission;

    supabase
      .from("users")
      .update({ referral_bonus: newBonus })
      .eq("email", referee)
      .select();
  } catch (error) {
    console.log(error);
  }
};

//referral program implementation
export const handleReferral = async (username: string, userEmail: string) => {
  let email = username + "@gmail.com";

  try {
    supabase
      .from("users")
      .update({ referee: email })
      .eq("email", userEmail)
      .select();

    const userData = await fetchUser(email);

    const { referrals } = userData![0];

    let newReferral = parseInt(referrals) + 1;

    supabase
      .from("users")
      .update({ referrals: newReferral })
      .eq("email", email)
      .select();
  } catch (error) {
    console.log(error);
  }
};

//redeem bonus

export const redeemBonus = async (username: string, referral_bonus: string) => {
  let email = username + "@gmail.com";
  try {
    recharge(email, referral_bonus);

    const { data, error } = await supabase
      .from("users")
      .update({ referral_bonus: 0 })
      .eq("email", email)
      .select();

    return { data: data, error: error };
  } catch (error) {
    console.log(error);
  }
};

//fetch notifications

export const fetchNotifications = async () => {
  try {
    const { data, error } = await supabase.from("notifications").select();

    let notifications: notificationTypes[] = data!;

    if (error) {
      console.log(error);
      return;
    }

    return notifications;
  } catch (error) {
    console.log(error);
  }
};

//fetch one notification

export const fetchOneNotification = async (id: number) => {
  try {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", id);

    let notification: notificationTypes[] = notifications!;

    if (error) {
      console.log(error);
      return;
    }

    return notification;
  } catch (error) {
    console.log(error);
  }
};

//handle read notifications
export const readNotifications = async (id: number) => {
  try {
    supabase.from("notifications").update({ read: true }).eq("id", id);

    // let notifications: notificationTypes[] = data!;

    // if (error) {
    //   console.log(error);
    //   return;
    // }

    // return notifications;
  } catch (error) {
    console.log(error);
  }
};

//fetch all transactions

export const fetchTransactions = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select()
      .eq("email", email)
      .order("created_at", { ascending: false });

    let transactions: DBTransactionTypes[] = data!;

    if (error) {
      console.log(error);
      return;
    }

    return transactions;
  } catch (error) {
    console.log(error);
  }
};

//fetch one transaction

export const fetchOneTransaction = async (id: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id);

    let transaction: DBTransactionTypes[] = transactions!;

    if (error) {
      console.log(error);
      return;
    }

    return transaction;
  } catch (error) {
    console.log(error);
  }
};

// fetch recharge history

export const fetchWalletHistory = async (email: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("email", email)
      .eq("purpose", "wallet");

    let transaction: DBTransactionTypes[] = transactions!;

    if (error) {
      console.log(error);
      return;
    }

    return transaction;
  } catch (error) {
    console.log(error);
  }
};

//fetch data transactions

export const fetchDataHistory = async (email: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("email", email)
      .eq("purpose", "data");

    let transaction: DBTransactionTypes[] = transactions!;

    if (error) {
      console.log(error);
      return;
    }

    return transaction;
  } catch (error) {
    console.log(error);
  }
};

//fetch data transactions

export const fetchAirtimeHistory = async (email: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("email", email)
      .eq("purpose", "airtime");

    let transaction: DBTransactionTypes[] = transactions!;

    if (error) {
      console.log(error);
      return;
    }

    return transaction;
  } catch (error) {
    console.log(error);
  }
};

//fetch references

export const fetchRefs = async (reference: string) => {
  try {
    const { data: references, error } = await supabase
      .from("refs")
      .select("ref")
      .eq("ref", reference);

    if (error) {
      console.log(error);
      return;
    }

    let ref = references!;
    return ref;
  } catch (error) {
    console.log(error);
  }
};

// create reference
export const setReference = async (reference: string) => {
  try {
    const { data, error } = await supabase
      .from("refs")
      .insert([
        {
          ref: reference,
        },
      ])
      .select();

    return { data, error };
  } catch (error) {
    console.log(error);
  }
};

//paystack integration

const secretKey: string = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY as string;
const paystackUrl: string = process.env
  .NEXT_PUBLIC_PAYSTACK_PAYMENT_URL as string;

const getPaystackHeaders = () => ({
  Authorization: `Bearer ${secretKey}`,
  "Content-Type": "application/json",
});

//paystack function for initiating payment and generating redirection url

export const paystackPay = async ({
  amount,
  email,
  currency,
  channels,
  callback_url,
  metadata,
}: PaystackParams) => {
  const options = {
    method: "POST",
    headers: getPaystackHeaders(),
    body: JSON.stringify({
      email: `${email}`,
      amount: `${amount * 100}`,
      currency: `${currency}`,
      channels: channels,
      callback_url: callback_url,
      metadata: metadata,
    }),
  };

  try {
    const response = await fetch(
      `${paystackUrl}/transaction/initialize`,
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

//paystack function for confirming payment

export const verifyPaystackTransaction = async (reference: string) => {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer pk_live_e924eb5961cb52bf5f3459bc922905de06443214`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

//paystack function for creating new customer

export const createCustomer = async (data: any) => {
  const options = {
    method: "POST",
    headers: getPaystackHeaders(),
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch(`${paystackUrl}/customer`, options);
    const data = response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//asb data api integration

const asbUrl = process.env.EXPO_PUBLIC_ASB_URL!;
const asbToken = process.env.EXPO_PUBLIC_ASB_AUTH_TOKEN!;

const getASBHeaders = () => ({
  Authorization: `Token ${asbToken}`,
  "Content-Type": "application/json",
});

//get all networks id and data plans

export const getNetworks = async () => {
  const options = {
    method: "GET",
    headers: getASBHeaders(),
  };

  try {
    const res = await axios.get(`${asbUrl}/get/network`, options);

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log(error);
  }
};

//get all data plans

export const getDataPlans = async () => {
  const options = {
    method: "GET",
    headers: getASBHeaders(),
  };
  try {
    const res = await axios.get(`${asbUrl}/network`, options);

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("error" + error);
  }
};

//buy data

export const buyData = async (data: {
  network: string;
  plan: string;
  mobile_number: string;
  Ported_number: boolean;
}) => {
  const input = {
    network: data.network,
    mobile_number: data.mobile_number,
    plan: data.plan,
    Ported_number: true,
  };

  let response = await fetch(`${asbUrl}/data/`, {
    method: "POST",
    headers: getASBHeaders(),
    body: JSON.stringify(input),
  })
    .then((response) => {
      if (!response.ok) {
        // throw new Error("Network response was not ok");
        console.log(response);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });

  return response;
};

//buy airtime

export const buyAirtime = async (data: {
  network: string;
  amount: string;
  mobile_number: string;
  Ported_number: boolean;
  airtime_type: string;
}) => {
  const response = await fetch(`${asbUrl}/topup/`, {
    method: "POST",
    headers: getASBHeaders(),
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        // throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      // console.log(data.error)
      return data;
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });

  return response;
};

export const verifyPayment = async (user: userDataTypes, reference: string) => {
  const response = await verifyPaystackTransaction(reference);

  if (response.data.status === "success") {
    const trans: transactionTypes = {
      email: user.email,
      purpose: "wallet",
      amount: (response.data.amount / 100).toString(),
      status: response.data.status,
      network: response.data.channel,
      planSize: response.data.currency,
      previousBalance: user?.balance,
      newBalance: (
        response.data.amount / 100 +
        parseInt(user?.balance)
      ).toString(),
      phone: reference,
      transactionId: response.data.id,
    };

    const data = await setReference(reference);

    if (data?.data === null) return;

    const rechargeAmount = (parseInt(trans.amount) - 50).toString();

    recharge(user?.email, rechargeAmount);

    setTransaction(trans);
  }

  return "finished";
};

//handle data proccessing

export const handleBuyData = async (
  data: transactionTypes,
  commission: number,
  referee: string | null,
  referral_bonus: string
) => {
  deductBalance(data);

  handleCommission(data, commission, referee, referral_bonus);

  setTransaction(data);
};

export const handleBuyAirtime = async (data: transactionTypes) => {
  deductBalance(data);

  setTransaction(data);
};

export const handleFundWallet = async (
  user: userDataTypes,
  reference: string
) => {
  const refs = await fetchRefs(reference);

  if (!refs) return;

  if (refs?.length > 0) return;

  verifyPayment(user, reference);
};

//monnify authorization

const options = {
  method: "POST",
  headers: {
    Authorization: `Basic ${monnifyEncodedKey}`,
  },
};

//generate authorization token

async function getToken() {
  const response = await fetch(`${monnifyUrl}/api/v1/auth/login`, options);

  const data = await response.json();
  const token = data.responseBody?.accessToken;

  return token;
}

//generate reserved account information

export async function getCustomerAccount(config: any) {
  const token = await getToken();

  if (!token) {
    throw new Error("Failed to get access token");
  }

  const response = await fetch(
    `${monnifyUrl}/api/v2/bank-transfer/reserved-accounts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    }
  );

  const data = await response.json();
  // console.log(data)

  return data.requestSuccessful ? data.responseBody : null;
}

//fetch user reserved accounts
export const fetchUserAccount = async (email: string) => {
  try {
    const { data } = await supabase
      .from("accounts")
      .select()
      .eq("customer_email", email);

    return data;
  } catch (error) {
    console.log(error);
    console.log(error);
  }
};

//post useraccount
export const postUserAccounts = async (accountInfo: AccountType) => {
  try {
    const { data, error } = await supabase
      .from("accounts")
      .insert([accountInfo])
      .select();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

//fetch reserved account transactions
const fetchDeposit = async (reference: string) => {
  try {
    const { data, error } = await supabase
      .from("deposits")
      .select()
      .eq("reference", reference);

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateDeposits = async (reference: string) => {
  try {
    const { data, error } = await supabase
      .from("deposits")
      .insert([{ reference }])
      .select();
  } catch (error) {
    console.log(error);
  }
};

export const fetchLastTransaction = async (reference: string) => {
  const token = await getToken();

  if (!token) {
    throw new Error("Failed to get access token");
  }

  const response = await fetch(
    `${monnifyUrl}/api/v1/bank-transfer/reserved-accounts/transactions?accountReference=${reference}&page=0&size=1`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (data.requestSuccessful) {
    const amount = data.responseBody.content[0].amount;
    const trxRef = data.responseBody.content[0].transactionReference;
    const res = await fetchDeposit(trxRef);
    if (!res || res?.length < 1) {
      recharge(`${reference}@gmail.com`, amount);
      updateDeposits(trxRef);
      return;
    } else {
      console.log("we got some record");
      return;
    }
  } else {
    return;
  }
};

export const changePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return error;
  } catch (error) {
    console.log(error);
  }
};
