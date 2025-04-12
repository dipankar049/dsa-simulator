// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';
import TopicCard from './TopicCard';

const BubbleSort = () => {
    const [array, setArray] = useState([220, 148, 132, 101, 95, 87, 64, 53, 8]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isMidVisible, setIsMidVisible] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [isGreater, setIsGreater] = useState(false);
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [divs, setDivs] = useState([]);
    const [emptyElement, setEmptyElement] = useState(false);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    },[element]);

    const bubbleSort = async () => {
        if (array.length === 0) {
            return;
        }
        for(let j = 0; j < array.length -1; j++) {
            setIterations(j + 1);
        
            for(let i = 0; i < array.length -1 -j; i++) {
                setComparisons(i + 1);
                setFirstEle(i);
                setSeacondEle(i + 1);
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if(array[i] > array[i + 1]) {
                    setIsGreater(true);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    let temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                }

                setIsGreater(false);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
        
    }

    useEffect(() => { 
        setIsGreater(false);
        setIterations(0);
        setComparisons(0);
        setFirstEle(-1);
        setSeacondEle(-1);
        // else {
        //     setIsVisible(true);
        //     setHigh(array.length - 1);
        // }
        // setIsEqual(false);
        // setLow(0);
        // setIsMidVisible(false);
        // setIsFound('');
        // setIterations(0);
    }, [array]);

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
            // console.log("empty array, can't delete");
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
            <TopicCard topicName="Bubble Sort" />
            <div className="md:flex bg-gradient-to-tl from-emerald-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
                <div className='md:w-70p w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Bubble Sort</h1>
                    <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                        <div className=''>
                            <button
                                onClick={createArray}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-md"
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            <button
                                onClick={bubbleSort}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:px-4 p-2 h-fit rounded-md"
                            >
                                Sort
                            </button>
                        </div>
                    </div>
                    <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md shadow-xl'>
                        <div className='w-full p-2'>
                            <div>
                                <div className='flex justify-between'>
                                    <p className='pl-4 font-bold'>Comparisons = {comparisons}</p>
                                    <p className='font-bold'>Iterations = {iterations}</p>
                                </div>
                                <p className='m-2 font-bold'>{arrExist ? 'Arr' : ''}</p>
                                <div className='overflow-x-auto'>
                                    <div className="flex md:ml-4">
                                        {divs}
                                    </div>
                                    <div className="flex md:ml-4">
                                        {array.map((item, index) => (
                                            <div
                                                id={item}
                                                key={index}
                                                ref={divRefs.current[index]}
                                                className="border border-black bg-emerald-300 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                                                // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                                style={{
                                                    color: `${index === firstEle ? (isGreater ? 'red' : 'blue') : (index === seacondEle ? (isGreater ? 'red' : 'blue') : 'black')}`,
                                                    fontWeight: `${index === firstEle ? 'bold' : (index === seacondEle ? 'bold' : '')}`,
                                                    animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`, // Stagger the delay by 0.2s per item
                                                    animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                                                }}
                                            // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-emerald-800 rounded-r-md'>
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
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
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
            <TopicCard topicName="Real-life Use (Bubble Sort)" />
        </div>
    );
};

export default BubbleSort;
