// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';
import TopicCard from './TopicCard';

const QuickSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [subArrayInfo, setSubArrayInfo] = useState([{left: 0, right: array.length -1}]);
    const [pivotEle, setPivotEle] = useState(-1);
    const [leftEle, setLefttEle] = useState(-1);
    const [rightEle, setRightEle] = useState(-1);
    const [isGreater, setIsGreater] = useState(false);
    const [isSmaller, setIsSmaller] = useState(false);

    const [midArray, setMidArray] = useState([]);
    const [currentArray, setCurrentArray] = useState(0);
    const [queue, setQueue] = useState([0]);
    const [queuePointer, setQueuePointer] = useState(0);

    const [divs, setDivs] = useState([]);
    const [dividedArrays, setDividedArrays] = useState([[]]);
    const [emptyElement, setEmptyElement] = useState(false);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    },[element]);
    
    let singleDiv = 0;
    let noOfMultiDiv = 0;
    const divide = async (localQueue, localQueuePointer, newSubArrayInfo) => {
        // if (singleDiv != (localQueue.length - localQueuePointer)) {
        //     return;
        // }
        let i = localQueuePointer;
        singleDiv = 0;
        noOfMultiDiv = 0;
        let multiDiv = false;
        setIsSmaller(false);
        setIsGreater(false);
    
        await delay(1000);
    
        while (i < localQueue.length) {

            if (newSubArrayInfo[i].left === newSubArrayInfo[i].right) {
                singleDiv++;
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].right }
                );
                i++;
                continue;
            } 

            let mid;
            let pivot = newSubArrayInfo[i].left;
            let m = newSubArrayInfo[i].left + 1;
            let n = newSubArrayInfo[i].right;
            console.log("Before ----> pivot: ",pivot,"leftEle: ",m,"rightEle: ",n);
            setPivotEle(pivot);
            setLefttEle(m);
            setRightEle(n);
            noOfMultiDiv = 0;
            if(m >= array.length || n >= array.length) {
                i++;
                continue;
            }
            await delay(1000);
            // console.log(array[m], array[pivot], array[n]);
            while(m <= n) {

                // console.log("yeah 0");
                while(array[m] <= array[pivot] || array[n] > array[pivot]) {
                    // console.log("yeah 1");
                    if(array[m] > array[pivot]) {
                        setIsGreater(true);
                    } else {
                        while(array[m] <= array[pivot]) {
                            m++;
                            await delay(1000);
                            setLefttEle(m);
                            if(m >= n) {
                                break;
                            }
                            if(array[m] > array[pivot]) {
                                
                                setIsGreater(true);
                                console.log("greater");
                                // setLefttEle(m);
                                break;
                                // await delay(500);
                            }
                            
                        }
                    }
                    
                    await delay(1000);
                    
                    if(m <= n) {
                        if(array[n] <= array[pivot]) {
                            setIsSmaller(true);
                        } else {
                            while(array[n] > array[pivot]) {
                                n--;
                                await delay(1000);
                                setRightEle(n);
                                if(m >= n) {
                                    if(n > newSubArrayInfo[i].left) {
                                        n--;
                                    }
                                    break;
                                }
                                if(array[n] <= array[pivot]) {
                                    setIsSmaller(true);
                                    break;
                                    // await delay(500);
                                }
                            }
                        }
                        
                    } else {
                        break;
                    }
                    console.log("Inside ----> pivot: ",pivot,"leftEle: ",m,"rightEle: ",n);
                    // setLefttEle(m);
                    // setRightEle(n);
                    await delay(1000);
                    
                }

                if(m < n) {
                    let temp = array[m];
                    array[m] = array[n];
                    array[n] = temp;
                    m++;
                    n--;
                } 
                if(m >= n) {
                    let temp = array[pivot];
                    array[pivot] = array[n];
                    array[n] = temp;
                    mid = n;
                    setLefttEle(m);
                    setRightEle(n);
                    await delay(1000);
                    setIsSmaller(false);
                    setIsGreater(false);
                    break;
                }
                setLefttEle(m);
                setRightEle(n);
                await delay(1000);
                setIsSmaller(false);
                setIsGreater(false);
            }
            console.log("After ----> pivot: ",pivot,"leftEle: ",m,"rightEle: ",n);
            if (newSubArrayInfo[i].left === newSubArrayInfo[i].right) {
                singleDiv++;
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].right }
                );
            } else {

                multiDiv = true;
                // mid = Math.floor((newSubArrayInfo[i].left + newSubArrayInfo[i].right) / 2);
                if(newSubArrayInfo[i].left + 1 === newSubArrayInfo[i].right) {
                    noOfMultiDiv = 2;
                    newSubArrayInfo.push(
                        { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].left },
                        { left: newSubArrayInfo[i].right, right: newSubArrayInfo[i].right }
                    );
                } else {
                    if(mid >= newSubArrayInfo[i].right) {
                        noOfMultiDiv = 2;
                        newSubArrayInfo.push(
                            { left: newSubArrayInfo[i].left, right: mid - 1 },
                            { left: mid, right: newSubArrayInfo[i].right }
                        );
                    } else if(mid <= newSubArrayInfo[i].left) {
                        noOfMultiDiv = 2;
                        newSubArrayInfo.push(
                            { left: newSubArrayInfo[i].left, right: mid },
                            { left: mid + 1, right: newSubArrayInfo[i].right }
                        );
                    } else {
                        noOfMultiDiv = 3;
                        newSubArrayInfo.push(
                            { left: newSubArrayInfo[i].left, right: mid - 1 },
                            { left: mid, right: mid },
                            { left: mid + 1, right: newSubArrayInfo[i].right }
                        );
                    } 
                } 
            }
            i++;
        }
    
        let k = i;
        let j = (i - localQueuePointer - singleDiv) * noOfMultiDiv + singleDiv;
    
        while (j > 0) {
            localQueue.push(i++);
            j--;
        }
    
        // Update state after processing this iteration
        setSubArrayInfo(newSubArrayInfo);
        setQueue(localQueue);
        setQueuePointer(k);
    
        // Continue recursion if there are further divisions needed
        if (multiDiv) {
            // console.log('no of singlediv', singleDiv);
            multiDiv = false;
            await delay(1000);
            divide([...localQueue], k, [...newSubArrayInfo]); // Pass copies for safety
        }
    };
    
    const QuickSort = () => {
        if (array.length === 0) {
            return;
        }
    
        const localQueue = [...queue];
        const localQueuePointer = queuePointer;
        const newSubArrayInfo = [...subArrayInfo];
    
        divide(localQueue, localQueuePointer, newSubArrayInfo);
    };

    const getSpacingX = () => {
        const screenWidth = window.innerWidth;
    
        if (screenWidth >= 1024) {
          // Large screens (e.g., desktops)
          return 25; // Custom padding for large screens
        } else if (screenWidth >= 768) {
          // Medium screens (e.g., tablets)
          return 20; // Custom padding for medium screens
        } else {
          // Small screens (e.g., mobile)
          return 15; // Custom padding for small screens
        }
      };
    //   console.log(getSpacingX());

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
                    className="flex items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10"
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
            let k = 0;
            for(let j = queuePointer; j < queue.length; j++, k++) {
                // console.log(j, queuePointer, queue);
                for (let i = subArrayInfo[j].left; i <= subArrayInfo[j].right; i++) {
                    newDivs.push(
                        <div
                            key={i}
                            className="border border-black bg-green-200 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap"
                            style={{ marginRight: `${i === subArrayInfo[j]?.right ? (i === subArrayInfo[queue.length - 1]?.right ? '0' : `20`) : '0'}px` }}
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
        setOldArray(false);
        setArray([]);
        setArrExist(true);
        setIsMidVisible(false);
        // setDividedArrays([[]]);
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
        // setDividedArrays([[]]);
    }

    return (
        <div className='p-2p'>
            <TopicCard topicName="Quick Sort" />
            <div className="md:flex bg-gradient-to-tl from-cyan-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
                <div className='md:w-70p w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Quick Sort</h1>
                    <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                        <div className=''>
                            <button
                                onClick={createArray}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-md"
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            <button
                                onClick={QuickSort}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:px-4 p-2 h-fit rounded-md"
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
                                <div className='flex'>
                                    <div className='overflow-x-auto grid place-items-center'>
                                        <div className="flex md:ml-12 m-4">
                                            {divs}
                                        </div>
                                        <div className="flex md:ml-12 m-4 my-0">
                                            {array.map((item, index) => (
                                                <div
                                                    id={item}
                                                    key={index}
                                                    ref={divRefs.current[index]}
                                                    className="border border-black flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                                                    // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                                    style={{
                                                        color: `${index === leftEle ? (isGreater ? 'red' : 'blue') : (index === rightEle ? (isSmaller ? 'red' : 'blue') : 'black')}`,
                                                        backgroundColor: `${index === pivotEle ? 'white' : '#67e8f9'}`,
                                                        fontWeight: `${index === leftEle ? 'bold' : (index === rightEle ? 'bold' : '')}`,
                                                        animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`, // Stagger the delay by 0.2s per item
                                                        animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                                                    }}
                                                // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="md:ml-7 grid place-items-center">
                                            
                                            {/* <div className="inline-block"> */}
                                                {dividedArrays.map((item, index) => (
                                                    <div
                                                        // id={item}
                                                        key={index}
                                                        className='flex mt-3'
                                                        // style={{marginLeft: `${(35 - (index * 5))}px`}}
                                                        // style={{marginLeft: `${15 - (index * 5)}px`}}
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
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                pivot element = {array[pivotEle]}, {pivotEle}, {leftEle}, {rightEle}
                                    {/* {subArrayInfo.map((item, index) => (
                                        <div
                                            // id={item}
                                            key={index}
                                            // className='flex'
                                            // style={{marginLeft: `${(29 - (index * 4))}px`}}
                                        >
                                            index-{index} {item.left}{item.right} {queue} {queuePointer}
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-cyan-800 rounded-r-md'>
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
                                className="bg-cyan-600 hover:bg-cyan-700 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
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
            <TopicCard topicName="Real-life Use (Quick Sort)" />
        </div>
    );
};

export default QuickSort;