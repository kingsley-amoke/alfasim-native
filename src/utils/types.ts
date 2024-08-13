

export interface userDataTypes {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username: string;
  balance: string;
  referrals?: string;
  referral_bonus: string;
  referee:string | null;
  is_admin: boolean;
}

//data plan types

export interface planTypes {
  type?: string;
  plan?: string;
  data?: string;
  price: string;
}

export interface dataPlanTypes {
  MTN_PLAN: Plan[];
  GLO_PLAN: Plan[];
  AIRTEL_PLAN: Plan[];
  "9MOBILE_PLAN": Plan[];
}

export interface Plan {
  id: number;
  dataplan_id: string;
  network: number;
  plan_type: PlanType;
  plan_network: PlanNetwork;
  month_validate: MonthValidate;
  plan: string;
  plan_amount: string;
}

export enum MonthValidate {
  MonthValidate1Month = "1 Month",
  MonthValidate30Days = "30 days",
  MonthValidate7Days = "7days",
  The14Days = "14 days",
  The1Month = "1 month",
  The30Days = "30days",
  The30DaysGifting = "30 days{Gifting}",
  The7Days = "7-days",
}

export enum PlanNetwork {
  Airtel = "AIRTEL",
  Glo = "GLO",
  Mtn = "MTN",
  The9Mobile = "9MOBILE",
}

export enum PlanType {
  CorporateGifting = "CORPORATE GIFTING",
  CorporateGifting2 = "CORPORATE GIFTING2",
  DataCoupons = "DATA COUPONS",
  Gifting = "GIFTING",
  SME = "SME",
  Sme2 = "SME2",
}

export interface modalProps {
  title?: string;
  onClose?: () => void;
  onOk?: () => void;
  closeDialog: () => void;
  clickOK?: () => void;
  dialogRef?: React.MutableRefObject<HTMLDialogElement | null>;
  showDialog: string | null;
  children: React.ReactNode;
}

export interface notificationTypes {
  created_at: string;
  id: number;
  message: string;
  read: boolean;
  title: string;
}
export interface transactionTypes {
  id?: string;
  created_at?: string;
  email: string | undefined;
  purpose: string;
  amount: string;
  status: string;
  network?: string | undefined;
  planSize?: string;
  previousBalance: string | undefined;
  newBalance: string | undefined;
  phone?: string;
  transactionId?: string;
}

export interface DBTransactionTypes{
  created_at: string
  email: string
  purpose: string
  amount: string
  id: string
  status: string
  network: string
  plan_size: string
  previous_balance: string
  new_balance: string
  phone: string
  transaction_id: string
}

export interface refsTypes{
  id: number,
  created_at: string,
  ref: string
}

export interface PaystackParams {
  amount: number;
  email: string;
  currency: string;
  channels?: string[];
  callback_url?: string;
  metadata?: object;
}

export interface VerifyParams {
  reference: string;
}

export interface PageProps {
  searchParams?: {
    trxref: string;
    reference: string;
  };
}

export type alertPropsTypes = {
  buttonProps: {
    title:string,
    loading: boolean
      onClick?: () => void,
      
  },
  headerProps: {
      title: string,
      description: string,
  },
  onCancel: () => void,
  onConfirm: () => void,
  }