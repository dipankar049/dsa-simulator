// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';
import TopicCard from './TopicCard';

const BinarySearch = () => {
    const [array, setArray] = useState([22, 25, 32, 48, 51, 57, 64, 73]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState('');
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

    const [emptyElement, setEmptyElement] = useState(false);
    const [emptySearchElement, setEmptySearchElement] = useState(false);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    },[element]);

    useEffect(() => {
        setEmptySearchElement(false);
    },[searchEle]);

    const binSearch = async () => {
        if (array.length === 0) {
            return;
        }
        if(searchEle === '') {
            setEmptySearchElement(true);
            return;
        }
        setEmptySearchElement(false);

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

            if (parseInt(searchEle) === array[midValue]) {
                localIsEqual = true;
                setIsEqual(true);
                break;
            } else if (parseInt(searchEle) < array[midValue]) {
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
        setOldArray(false);
        setArray([]);
        setArrExist(true);
        setIsMidVisible(false);
    };

    function arrayPushOperation() {
        if (!arrExist) {
            return;
        };
        if(element === '') {
            setEmptyElement(true);
            return;
        }
        setEmptyElement(false);
        setOldArray(true);
        if (element) {
            setArray([...array, element]);
        }
        setElement('');
        // setCustomIdx(-1);
    };

    function arrayPopOperation() {
        //   console.log(idx);
        if (array.length <= 0) {
            console.log("empty array, can't delete");
            return;
        }
        setArray(array.slice(0, -1));
    }

    const removeByEle = () => {
        if(element === '') {
            setEmptyElement(true);
            return;
        }
        setEmptyElement(false);
        
        setArray(array.filter(item => item != element));
        setElement('');
    };

    const removeArray = () => {
        setOldArray(false);
        setArray([]);
        setArrExist(false);
        setIsVisible(false);
    }

    return (
        <div className='p-2p'>
            <TopicCard topicName="Binary Search" />
            <div className="md:flex bg-gradient-to-tl from-purple-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
                <div className='md:w-70p w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Binary Search</h1>
                    <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                        <div className=''>
                            <button
                                onClick={createArray}
                                className="bg-purple-500 hover:bg-purple-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-md"
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            <input
                                type="number"
                                value={searchEle}
                                onChange={(e) => setSearchEle(e.target.value)}
                                className="md:p-2 p-1 h-fit w-50p rounded-l-md shadow-inner"
                                style={{border: `${emptySearchElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                                placeholder="Enter element"
                            />
                            <button
                                onClick={binSearch}
                                className="bg-purple-500 hover:bg-purple-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md shadow-xl'>
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

                                                className='flex text-purple-900 justify-center items-center flex-shrink-0 lg:w-14 md:12 w-10'
                                                // style={{ color: `${isEqual ? 'blue' : 'blue'}`, }}
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
                                                className="border border-black bg-purple-300 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                                                // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                                style={{
                                                    color: `${index === mid ? (isEqual ? 'red' : 'black') : 'black'}`,
                                                    fontWeight: `${index === mid ? 'bold' : ''}`,
                                                    animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`, // Stagger the delay by 0.2s per item
                                                    animationFillMode: 'both' // Ensures the element stays visible after the animation ends
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
                        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-purple-800 rounded-r-md'>
                            <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p><p>I</p><p>Z</p><p>E</p><p>D</p><p>S</p><p>A</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-between'>
                        <div className=''>
                            <input
                                type="number"
                                value={element}
                                onChange={(e) => setElement(e.target.value)}
                                className="md:p-2 p-1 h-fit w-36p rounded-l-md shadow-inner"
                                style={{border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                                placeholder="Enter element"
                            />
                            <button
                                onClick={arrayPushOperation}
                                className="bg-purple-500 hover:bg-purple-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-purple-500 hover:bg-purple-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-purple-500 hover:bg-purple-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
                            >
                                delete by element
                            </button>
                        </div>

                        <button
                            onClick={removeArray}
                            className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
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
            <TopicCard topicName="Real-life Use (Binary Search)" />
        </div>
    );
};

export default BinarySearch;
