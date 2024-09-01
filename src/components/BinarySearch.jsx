// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const BinarySearch = () => {
    const [array, setArray] = useState([22, 25, 32, 48, 51, 57, 64, 73]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState(0);
    const [idx, setIdx] = useState(0);
    const [cancleFun, setCancleFun] = useState(false);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [mid, setMid] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isMidVisible, setIsMidVisible] = useState(false);
    const [isFound, setIsFound] = useState('');
    const [iterations, setIterations] = useState(0);
    const divRefs = useRef([]);

    const [divs, setDivs] = useState([]);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const binSearch = async () => {
        if (array.length === 0) {
            return;
        }
        let currentLow = low;
        let currentHigh = high;
        setIsFound('');
        setIterations(0);
        let localIsEqual = false;
        let i = 0;

        while (currentLow <= currentHigh) {
            let midValue = Math.floor((currentLow + currentHigh) / 2);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMid(midValue);
            setIsMidVisible(true);
            setIterations(++i);
            // Wait for 1 second to simulate delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (searchEle === array[midValue]) {
                localIsEqual = true;
                setIsEqual(true);
                break;
            } else if (searchEle < array[midValue]) {
                currentHigh = midValue - 1;
            } else {
                currentLow = midValue + 1;
            }

            // Update the state after each iteration
            setLow(currentLow);
            setHigh(currentHigh);
            // setIsEqual(localIsEqual);
            // setIterations(iterations + 1);
        }
        if (localIsEqual) {
            setIsFound('Found');
        } else {
            setIsFound('Not Found')
        }
    }

    useEffect(() => {
        if (array.length == 0) {
            setIsVisible(false);
            setHigh(0);

        } else {
            setIsVisible(true);
            setHigh(array.length - 1);
        }
        setIsEqual(false);
        setLow(0);
        setIsMidVisible(false);
        setIsFound('');
        setIterations(0);
    }, [array, searchEle]);

    useEffect(() => {
        const newDivs = [];
        for (let i = 0; i < array.length; i++) {
            newDivs.push(
                <div
                    key={i}
                    className="flex items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10"
                // style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
                >
                    {i}
                </div>
            );
        }
        setDivs(newDivs); // Update the state with new divs
    }, [array]);


    const createArray = () => {
        setArray([]);
        setArrExist(true);
        setIsMidVisible(false);
    };

    function arrayPushOperation() {
        if (!arrExist) {
            return;
        };
        if (element) {
            setArray([...array, element]);
        }
        setElement('');
        // setCustomIdx(-1);
    };

    function arrayPopOperation() {
        //   console.log(idx);
        if (array.length < 0) {
            // console.log("empty array, can't delete");
            return;
        }
        setArray(array.slice(0, -1));
    }

    const removeByEle = () => {
        setArray(array.filter(item => item != element));
    };

    const removeArray = () => {
        setArray([]);
        setArrExist(false);
        setIsVisible(false);
    }

    return (
        <div className="md:flex bg-green-100 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
            <div className='md:w-70p w-full mb-2'>
                <h1 className="text-xl font-bold mb-4">Binary Search</h1>
                <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                    <div className=''>
                        <button
                            onClick={createArray}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-md"
                        >
                            Create New array
                        </button>
                    </div>
                    <div className='flex flex-wrap justify-end'>
                        <input
                            type="number"
                            // value={searchEle}
                            onChange={(e) => setSearchEle(parseInt(e.target.value))}
                            className="border border-gray-300 md:p-2 p-1 h-fit w-50p rounded-l-md"
                            placeholder="Enter element"
                        />
                        <button
                            onClick={binSearch}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md'>
                    <div className='w-full p-2'>
                        <div>
                            <div className='flex justify-between'>
                                <p className='pl-4 font-bold'>Search element = {searchEle}</p>
                                <p className='font-bold'>Iterations = {iterations}</p>
                            </div>
                            <p className='m-2 font-bold'>{arrExist ? 'Arr' : ''}</p>
                            <div className='overflow-x-auto'>
                                <div className="flex md:ml-4">
                                    {array.map((item, index) => (
                                        <div
                                            // id={item}
                                            key={index}

                                            className='flex justify-center pb-2 flex-shrink-0 lg:w-14 md:12 w-10'
                                            style={{ color: `${isEqual ? 'red' : 'blue'}`, }}
                                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                        >
                                            {/* <p ref={SearchEleRef} 
                                                style={{ color: `${isEqual ? 'blue' : 'red'}`, }}>  */}
                                            {`${index === mid ? (isMidVisible ? 'Mid' : '') : ''}`}
                                            {/* </p> */}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex md:ml-4">
                                    {array.map((item, index) => (
                                        <div
                                            // id={item}
                                            key={index}

                                            className='flex justify-center items-center flex-shrink-0 lg:w-14 md:12 w-10'
                                            style={{ color: `${isEqual ? 'blue' : 'blue'}`, }}
                                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                        >
                                            {/* <p ref={SearchEleRef} 
                                                style={{ color: `${isEqual ? 'blue' : 'red'}`, }}>  */}
                                            {`${index === low ? 'Low' : (index === high ? 'High' : '')}`}
                                            {/* </p> */}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex md:ml-4">
                                    {divs}
                                </div>
                                <div className="flex md:ml-4">
                                    {array.map((item, index) => (
                                        <div
                                            id={item}
                                            key={index}
                                            ref={divRefs.current[index]}
                                            className="border border-black bg-green-100 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap"
                                            // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                            style={{
                                                color: `${index === mid ? (isEqual ? 'red' : 'black') : 'black'}`,
                                                fontWeight: `${index === mid ? 'bold' : ''}`
                                            }}
                                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                    <p className='m-2 font-bold text-green-500'>{isFound}</p>
                                </div>
                            </div>
                        </div>
                        <div className='p-4 font-bold' style={{ visibility: `${isVisible ? 'visible' : 'hidden'}` }}>
                            <span>Low = {low} </span>
                            <span>{isMidVisible ? `Mid = ${mid}` : ''}  </span>
                            <span>High = {high}</span>
                        </div>
                    </div>
                    <div className='p-1 text-white md:font-bold text-xs md:text-base bg-gray-800 rounded-r-md'>
                        <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p><p>I</p><p>Z</p><p>E</p><p>D</p><p>S</p><p>A</p>
                    </div>
                </div>
                <div className='flex flex-wrap justify-between'>
                    <div className=''>
                        <input
                            type="number"
                            value={element}
                            onChange={(e) => setElement(parseInt(e.target.value))}
                            className="border border-gray-300 md:p-2 p-1 h-fit w-36p rounded-l-md"
                            placeholder="Enter element"
                        />
                        <button
                            onClick={arrayPushOperation}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit"
                        >
                            Push
                        </button>
                        <button
                            onClick={() => { arrayPopOperation() }}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit"
                        >
                            Pop
                        </button>
                        <button
                            onClick={removeByEle}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
                        >
                            delete by element
                        </button>
                    </div>

                    <button
                        onClick={removeArray}
                        className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md"
                    >
                        delete array
                    </button>
                </div>

            </div>
            <div className='min-h-full w-full md:w-28p bg-black  md:m-4 md:mr-0 md:ml-2p'>
                <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
                    <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                </div>
            </div>
        </div>
    );
};

export default BinarySearch;
