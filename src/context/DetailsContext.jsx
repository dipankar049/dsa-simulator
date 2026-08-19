"use client";

import React, { createContext, useState, useEffect } from "react";

const DetailsStateContext = createContext();

const DetailsProvider = ({ children }) => {
    // 1. Initialize with an empty object (matches server rendered state)
    const [detailsState, setDetailsState] = useState({});

    // 2. Sync with localStorage once mounted on the client
    useEffect(() => {
        try {
            const savedState = localStorage.getItem("detailsState");
            if (savedState) {
                setDetailsState(JSON.parse(savedState));
            }
        } catch (error) {
            console.error("Error loading detailsState from localStorage:", error);
        }
    }, []);

    // 3. Update state and keep localStorage in sync
    const updateState = (id, isOpen) => {
        setDetailsState((prevState) => {
            const newState = { ...prevState, [id]: isOpen };
            try {
                localStorage.setItem("detailsState", JSON.stringify(newState));
            } catch (error) {
                console.error("Error saving detailsState to localStorage:", error);
            }
            return newState;
        });
    };

    return (
        <DetailsStateContext.Provider value={{ detailsState, updateState }}>
            {children}
        </DetailsStateContext.Provider>
    );
};

export { DetailsStateContext, DetailsProvider };