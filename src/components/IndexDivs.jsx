import React, { useState, useEffect } from 'react'

export default function IndexDivs(length) {
    const [divs, setDivs] = useState([]);

    useEffect(() => {
        const newDivs = [];
        for (let i = 0; i < length; i++) {
        newDivs.push(
            <div
            key={i}
            className="flex items-center text-black justify-center flex-shrink-0 lg:w-14 md:12 w-10"
            >
            {i}
            </div>
        );
        }
        setDivs(newDivs); // Update the state with new divs
    },[length]);

    return divs;
}
