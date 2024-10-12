import Toast from "react-native-root-toast";

export const actions = [
  {
    id: 1,
    name: "Buy Data",
    icon: "signal-cellular-alt",
    link: "data",
  },
  {
    id: 2,
    name: "Airtime Topup",
    icon: "add-call",
    link: "airtime",
  },
  {
    id: 3,
    name: "Aitime 2 Cash",
    icon: "payment",
    link: "airtime-2-cash",
  },
  {
    id: 4,
    name: "Cable Sub",
    icon: "live-tv",
    link: "cable",
  },
  {
    id: 5,
    name: "Electricity Sub",
    icon: "electric-bolt",
    link: "electricity",
  },
  {
    id: 6,
    name: "Scratch Card",
    icon: "airplane-ticket",
    link: "scratch-card",
  },
];

//toast

export const CustomToast = (
  message: string,
  bgColor: string,
  textColor: string
) => {
  return Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: bgColor,
    textColor: textColor,
    textStyle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    containerStyle: {
      marginTop: 70,
    },
  });
};

export const socialLinks = {
  instagram: {
    link: "https://www.instagram.com/alfasimtelecom?igsh=MTBmMmlxbjd5ZjdpNg==",
    color: "#F560e4",
  },
  facebook: {
    link: "",
    color: "blue",
  },
  whatsapp: {
    link: "https://chat.whatsapp.com/ED3R1xRgcujC2T28KCdCQz",
    color: "green",
  },
  twitter: {
    link: "",
    color: "#000",
  },
  youtube: {
    link: "",
    color: "red",
  },
  chat: "https://whatsapp.com/+2348051525123",
  email: "alfasimdata@gmail.com",
};

export const developerLinks = {
  instagram: {
    link: "",
    color: "#F560e4",
  },
  facebook: {
    link: "https://facebook.com/kingsley.chibuike.54/",
    color: "blue",
  },
  whatsapp: {
    link: "",
    color: "green",
  },
  twitter: {
    link: "",
    color: "#000",
  },
  youtube: {
    link: "",
    color: "red",
  },
  linkedIn: {
    link: "https://linkedin.com/in/kingsley-amoke",
    color: "blue",
  },
  github: {
    link: "https://github.com/kingsley-amoke",
    color: "black",
  },
  website: "https://kingsleyamoke.com.ng/",
  email: "klordbravo@gmail.com",
};
