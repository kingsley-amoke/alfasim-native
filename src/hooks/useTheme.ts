import { useState, useEffect } from "react";
import { useRouter, useGlobalSearchParams } from "expo-router";


export default function useTheme() {
    const router = useRouter()
    const {colorScheme: globalColorScheme} = useGlobalSearchParams()

    const [localColorScheme, setLocalColorScheme] = useState(globalColorScheme || 'light');


useEffect(() => {
    if(globalColorScheme && globalColorScheme !== localColorScheme) {
        setLocalColorScheme(globalColorScheme)
    }

}, [globalColorScheme])

const toggleTheme = () => {
    const newScheme =  localColorScheme === 'light' ? 'dark' : 'light';
    setLocalColorScheme(newScheme);
    router.setParams({colorScheme: newScheme});
}

return {
    colorScheme:localColorScheme,
    toggleTheme,
}
}