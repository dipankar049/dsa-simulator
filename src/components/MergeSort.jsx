// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const MergeSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
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

    const [subArrayInfo, setSubArrayInfo] = useState([{left: 0, right: array.length -1}]);
    const [midArray, setMidArray] = useState([]);
    const [currentArray, setCurrentArray] = useState(0);
    const [queue, setQueue] = useState([0]);
    const [queuePointer, setQueuePointer] = useState(0);

    const [divs, setDivs] = useState([]);
    const [dividedArrays, setDividedArrays] = useState([[]]);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    

    const divide = async () => {

        let i = queuePointer;
        let newSubArrayInfo = [...subArrayInfo]; // Local copy to avoid state update issues
        let localQueue = [...queue]; // Local copy to avoid state update issues
        let singleDiv = 0;
        let multiDiv = false;
        await delay(1000);
        while (i < localQueue.length) {
            let mid;
            if(newSubArrayInfo[i].left === newSubArrayInfo[i].right) {
                singleDiv++;
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].right }
                );
            } else {
                console.log("gettingtrue");
                multiDiv = true;
                mid = Math.floor((newSubArrayInfo[i].left + newSubArrayInfo[i].right) / 2);
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: mid },
                    { left: mid + 1, right: newSubArrayInfo[i].right }
                );
            }
            console.log("Mid value calculated:", mid);  
            
            i++;
        }
    
        let k = i;
        let j = (i - queuePointer) * 2 - singleDiv;
    
        while (j > 0) {
            localQueue.push(i++);
            j--;
        }
    
        setSubArrayInfo(newSubArrayInfo);
        setQueue(localQueue);
        setQueuePointer(k);

        // await Promise.resolve();
        // if (multiDiv) {
        //     await divide(); // Trigger another call to divide if necessary
        // }
    };

    const mergeSort = () => {
        if (array.length === 0) {
            return;
        }
        // while(multiDiv) {
        // //     console.log('working');
        //     multiDiv = false;
            divide();
        //     console.log("No of multiDivs",multiDiv);
        // }
    }

    useEffect(() => { 
        setSubArrayInfo([{left: 0, right: array.length -1}])
        setDividedArrays([[]]);
        setQueue([0]);
        setQueuePointer(0);
        // setIsGreater(false);
        // setIterations(0);
        // setComparisons(0);
        // setFirstEle(-1);
        // setSeacondEle(-1);
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

    // const makeDivs = () => {
    useEffect(() => {
        if(queuePointer > 0) {
            const newDivs = [];
            for(let j = queuePointer; j < queue.length; j ++) {
                for (let i = subArrayInfo[j].left; i <= subArrayInfo[j].right; i++) {
                    newDivs.push(
                        <div
                            key={i}
                            className="border border-black flex justify-center md:px-4 px-1 md:py-2 py-1 w-14 mt-5 overflow-hidden whitespace-nowrap"
                            style={{ marginRight: `${i === subArrayInfo[j]?.right ? (i === subArrayInfo[queue.length - 1]?.right ? '0' : '20') : '0'}px` }}
                        >
                            {array[i]}
                        </div>
                    );
                }
            } 
            setDividedArrays([...dividedArrays, newDivs]);
        }
    }, [queuePointer]);
    // }


    const createArray = () => {
        setArray([]);
        setArrExist(true);
        setIsMidVisible(false);
        // setDividedArrays([[]]);
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
        // setDividedArrays([[]]);
    }

    return (
        <div className="md:flex bg-green-100 h-fit w-full p-2p">
            <div className='md:w-70p w-full mb-2'>
                <h1 className="text-xl font-bold mb-4">Merge Sort</h1>
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
                            onClick={mergeSort}
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
                            <div className="flex ml-16">
                                {divs}
                            </div>
                            <div className="flex flex-wrap ml-6">
                                <p className='m-2 font-bold'>{arrExist ? 'Arr' : ''}</p>
                                {array.map((item, index) => (
                                    <div
                                        id={item}
                                        key={index}
                                        ref={divRefs.current[index]}
                                        className="border border-black flex justify-center md:px-4 px-1 md:py-2 py-1 w-14 mt-1 overflow-hidden whitespace-nowrap"
                                        // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                        style={{
                                            color: `${index === firstEle ? (isGreater ? 'red' : 'blue') : (index === seacondEle ? (isGreater ? 'red' : 'blue') : 'black')}`,
                                            fontWeight: `${index === firstEle ? 'bold' : (index === seacondEle ? 'bold' : '')}`
                                        }}
                                    // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="">
                                {dividedArrays.map((item, index) => (
                                    <div
                                        // id={item}
                                        key={index}
                                        className='flex'
                                        style={{marginLeft: `${(59 - (index * 5))}px`}}
                                    >
                                        {item}
                                    </div>
                                ))}
                                {/* {dividedArrays.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex">
                                    {row.map((cell, colIndex) => (
                                        <div key={colIndex} >
                                        {cell}
                                        </div>
                                    ))}
                                    </div>
                                ))} */}
                            </div>
                            <div>
                                {subArrayInfo.map((item, index) => (
                                    <div
                                        // id={item}
                                        key={index}
                                        // className='flex'
                                        // style={{marginLeft: `${(29 - (index * 4))}px`}}
                                    >
                                        index-{index} {item.left}{item.right} {queue} {queuePointer}
                                    </div>
                                ))}
                            </div>
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

export default MergeSort;
