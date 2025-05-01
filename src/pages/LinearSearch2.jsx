import React, { useState, useEffect } from 'react';

const LinearSearchComponent2 = ({ array }) => {
    const [searchValue, setSearchValue] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [foundIndex, setFoundIndex] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (searchValue === '') return;

        setIsSearching(true);
        setFoundIndex(null);
        for (let i = 0; i < array.length; i++) {
            setCurrentIndex(i);
            await new Promise(resolve => setTimeout(resolve, 600)); // Animation delay

            if (parseInt(array[i]) === parseInt(searchValue)) {
                setFoundIndex(i);
                break;
            }
        }
        setIsSearching(false);
    };

    useEffect(() => {
        if (!isSearching) {
            setCurrentIndex(null);
        }
    }, [isSearching]);

    return (
        <div className="flex flex-col items-center gap-4 my-6">
            <div className="flex gap-2">
                <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="p-2 border rounded shadow-inner"
                    placeholder="Search element"
                />
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded shadow-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105"
                >
                    {isSearching ? "Searching..." : "Start Search"}
                </button>
            </div>

            {/* Array Animation View */}
            <div className="flex flex-wrap justify-center gap-2">
                {array.map((ele, idx) => (
                    <div
                        key={idx}
                        className={`w-10 h-10 flex justify-center items-center border rounded-md
                            ${idx === foundIndex ? 'bg-green-500 text-white' :
                              idx === currentIndex ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-600'}
                            shadow-md transition-all duration-300`}
                    >
                        {ele !== null ? ele : '-'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinearSearchComponent2;
