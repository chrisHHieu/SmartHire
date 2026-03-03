// Import required modules
"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

// Define the structure of the context
interface ContextTheme {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  language: 'EN' | 'VI';
  setLanguage: Dispatch<SetStateAction<'EN' | 'VI'>>;
}

// Create a context with default values
const GlobalContext = createContext<ContextTheme>({
  isDarkMode: false,
  setIsDarkMode: () => { },
  toggleDarkMode: (): void => { },
  language: 'EN',
  setLanguage: () => { },
});

// ContextProvider component to manage state and effects
export const ContextProvider = ({ children }: any) => {
  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedValue =
      typeof window !== "undefined" ? localStorage.getItem("isDarkMode") : null;
    return storedValue ? JSON.parse(storedValue) : false;
  });

  // State to track language
  const [language, setLanguage] = useState<'EN' | 'VI'>(() => {
    const storedValue =
      typeof window !== "undefined" ? localStorage.getItem("language") : null;
    return (storedValue === 'VI' || storedValue === 'EN') ? storedValue : 'EN';
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Effect to update local storage and apply dark mode class to the document
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  // Effect to update language in local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
  }, [language]);

  // Provide the context to the children components
  return (
    <GlobalContext.Provider
      value={{ isDarkMode, setIsDarkMode, toggleDarkMode, language, setLanguage }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
