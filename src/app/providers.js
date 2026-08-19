"use client";

import { useState, useContext } from "react";
import { DetailsProvider } from "../context/DetailsContext";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import MenubarUn from "../components/MenubarUn";

function InnerShell({ children }) {
    const { theme } = useContext(ThemeContext);
    const [language, setLanguage] = useState(() =>
        typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en"
    );
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const closeSidebar = () => setSidebarOpen(false);
    const handleChangeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem("language", newLanguage);
    };

    return (
        <div className="w-full min-h-screen bg-theme-gradient">
            <ToastContainer limit={3} autoClose={3000} newestOnTop pauseOnHover theme={theme} pauseOnFocusLoss />
            <Header toggleSidebar={toggleSidebar} changeLanguage={handleChangeLanguage} />
            <div className="w-full flex pt-4 md: pt-20">
                <MenubarUn isOpen={sidebarOpen} closeSidebar={closeSidebar} />
                <div className="relative w-full text-ink px-4 md:text-base sm:text-sm text-xs md:ml-[17%]">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function Providers({ children }) {
    return (
        <ThemeProvider>
            <DetailsProvider>
                <InnerShell>{children}</InnerShell>
            </DetailsProvider>
        </ThemeProvider>
    );
}