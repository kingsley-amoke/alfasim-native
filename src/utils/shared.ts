
import Toast from 'react-native-root-toast'

export const actions = [
    {
      id:1,
      name: 'Buy Data',
      icon: "signal-cellular-alt",
      link: 'data'
    },
    {
      id:2,
      name: 'Airtime Topup',
      icon: "add-call",
      link:'airtime'
    },
    {
      id:3,
      name: 'Aitime 2 Cash',
      icon: 'payment',
      link:'aitime-to-cash'
    },
    {
      id:4,
      name: 'Cable Sub',
      icon: "live-tv",
      link:'cable'
    },
    {
      id:5,
      name: 'Electricity SUb',
      icon: "electric-bolt",
      link:'electricity'
    },
    {
      id:6,
      name: 'Scratch Card',
      icon: "airplane-ticket",
      link:'scratch-card'
    },
    
  ]

  //toast

  export const CustomToast = (message: string, bgColor:string, textColor:string) => {

    return (Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor: bgColor,
    textColor: textColor,
    textStyle:{
      fontSize: 16,
      fontWeight: 'bold'
    },
    containerStyle: {
      marginTop:70
    }
  }))
  }