import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('dsa-simulator-theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });    

    useEffect(() => {
        const storedTheme = localStorage.getItem('dsa-simulator-theme') || 'light';
        if (storedTheme !== theme) {
            updateTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);
    
    const updateTheme = (newTheme) =>{
        try {
            if (['light', 'dark'].includes(newTheme)) {
                setTheme(newTheme);
                localStorage.setItem('dsa-simulator-theme', newTheme);
            } else {
                console.warn('Invalid theme:', newTheme);
            }
        } catch(err) {
            console.error(err);
        }
        
    }

    return (
        <ThemeContext.Provider value={{theme, updateTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext, ThemeProvider };