import React, { createContext, useState } from "react";

const DetailsStateContext = createContext();

const DetailsProvider = ({ children }) => {
  const [detailsState, setDetailsState] = useState(
    JSON.parse(localStorage.getItem("detailsState")) || {}
  );

  const updateState = (id, isOpen) => {
    const newState = { ...detailsState, [id]: isOpen };
    setDetailsState(newState);
    localStorage.setItem("detailsState", JSON.stringify(newState)); // Persist to localStorage
  };

  return (
    <DetailsStateContext.Provider value={{detailsState, updateState}}>
        {children}
    </DetailsStateContext.Provider>
  );
};

export { DetailsStateContext,  DetailsProvider };
