// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const SelectionSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [isSmaller, setIsSmaller] = useState(false);
    const [min, setMin] = useState(-1);
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [divs, setDivs] = useState([]);

    // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const selectionSort = async () => {
        if (array.length === 0) {
            return;
        }
        setIsVisible(true);
        for(let j = 0; j < array.length -1; j++) {
            setFirstEle(j);
            setIterations(j + 1);
            setMin(j);
            let min = j;
        
            for(let i = j; i < array.length; i++) {
                setComparisons(i + 1);
                setSeacondEle(i);
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if(array[i] < array[min]) {
                    setIsSmaller(true);
                    min = i;
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    
                } else {
                    setIsSmaller(false);
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                setMin(min);
            }
            let temp = array[j];
            array[j] = array[min];
            array[min] = temp;

            if(j === array.length -2) {
                setIsSorted(true);
                setMin(-1);
                setFirstEle(-1);
                setSeacondEle(-1);
            }
        } 
    }

    useEffect(() => {
        if (array.length == 0) {
            setIsVisible(false);

        }
        setIsSorted(false);
    }, [array]);

    useEffect(() => {
        const newDivs = [];
        for (let i = 0; i < array.length; i++) {
            newDivs.push(
                <div
                    key={i}
                    className="text-green-800 flex items-center justify-center md:px-4 px-6 w-14"
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
        // setIsMidVisible(false);
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
        <div className="md:flex bg-green-100 h-fit w-full p-2p">
            <div className='md:w-70p w-full mb-2'>
                <h1 className="text-xl font-bold mb-4">Selection Sort</h1>
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
                        <button
                            onClick={selectionSort}
                            className="bg-blue-500 text-white md:px-4 p-2 h-fit rounded-md"
                        >
                            Sort
                        </button>
                    </div>
                </div>
                <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md'>
                    <div className='w-full p-2'>
                        <div>
                            <div className='flex justify-between'>
                                <p className='pl-4 font-bold'>Comparisons = {comparisons}</p>
                                <p className='font-bold'>Iterations = {iterations}</p>
                            </div>
                            <div className="flex ml-10">
                                {divs}
                            </div>
                            <div className="flex flex-wrap">
                                <p className='m-2 font-bold'>{arrExist ? 'Arr' : ''}</p>
                                {array.map((item, index) => (
                                    <div
                                        id={item}
                                        key={index}
                                        ref={divRefs.current[index]}
                                        className="border border-black bg-green-200 flex justify-center md:px-4 px-1 md:py-2 py-1 w-14 mt-1 overflow-hidden whitespace-nowrap"
                                        // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                        style={{
                                            color: `${index === min ? 'red' : (index === seacondEle ? (isSmaller ? 'red' : 'blue') : 'black')}`,
                                            fontWeight: `${(index === min || index === seacondEle || index === firstEle) ? 'bold' : ''}`,
                                            backgroundColor: `${index === firstEle ? 'white' : ''}`
                                        }}
                                    // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                    >
                                        {item}
                                    </div>
                                ))}
                                <p className='m-2 font-bold text-green-500'>{isSorted ? 'Sorted' : ''}</p>
                            </div>
                        </div>
                        <div className='p-4 font-bold' style={{ visibility: `${isVisible ? 'visible' : 'hidden'}` }}>
                            <span>Min = {array[min]} </span>
                            {/* <span>{isMidVisible ? `Mid = ${mid}` : ''}  </span>
                            <span>High = {high}</span> */}
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

export default SelectionSort;
