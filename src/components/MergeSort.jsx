// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const MergeSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [sortedArray, setSortedArray] = useState([]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [isGreater, setIsGreater] = useState(false);
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [subArrayInfo, setSubArrayInfo] = useState([{left: 0, right: array.length -1}]);
    const [mergeArrayInfo, setMergeArrayInfo] = useState([{left: 0, right: array.length -1}]);

    const [midArray, setMidArray] = useState([]);
    const [currentArray, setCurrentArray] = useState(0);
    const [queue, setQueue] = useState([0]);
    const [mergeQueue, setMergeQueue] = useState([0]);
    const [queuePointer, setQueuePointer] = useState(0);
    const [mergeQueuePointer, setMergeQueuePointer] = useState(0);

    const [divs, setDivs] = useState([]);
    const [dividedArrays, setDividedArrays] = useState([[]]);
    const [emptyElement, setEmptyElement] = useState(false);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    },[element]);
    
    let singleDiv = 0;
    const divide = async (localQueue, localQueuePointer, newSubArrayInfo) => {
        // if (singleDiv != (localQueue.length - localQueuePointer)) {
        //     return;
        // }
        let i = localQueuePointer;
        singleDiv = 0;
        let multiDiv = false;
    
        await delay(1000);
    
        while (i < localQueue.length) {
            let mid;
            if (newSubArrayInfo[i].left === newSubArrayInfo[i].right) {
                singleDiv++;
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].right }
                );
            } else {
                multiDiv = true;
                mid = newSubArrayInfo[i].left + Math.floor((newSubArrayInfo[i].right - newSubArrayInfo[i].left) / 2);
                if(newSubArrayInfo[i].left + 1 === newSubArrayInfo[i].right) {
                    multiDiv = false;
                }
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: mid },
                    { left: mid + 1, right: newSubArrayInfo[i].right }
                );
            }
    
            i++;
        }
    
        let k = i;
        let j = (i - localQueuePointer) * 2 - singleDiv;
    
        while (j > 0) {
            localQueue.push(i++);
            j--;
        }
    
        // Update state after processing this iteration
        setSubArrayInfo(newSubArrayInfo);
        setQueue(localQueue);
        setQueuePointer(k);
    
        // Continue recursion if there are further divisions needed
        console.log("queuePointer", k, "Queue", localQueue, "subarray", newSubArrayInfo);
        if (multiDiv) {
            // console.log('no of multidiv', multiDiv);
            await delay(1000);
            await divide([...localQueue], k, [...newSubArrayInfo]); // Pass copies for safety
        } else {
            conquere([...localQueue], k, [...newSubArrayInfo]);
        }
    };

    const conquere = async(localQueue, localQueuePointer, newSubArrayInfo) => {
        // console.log('working conquere', newSubArrayInfo.length);
        let i = localQueuePointer;
        let arr = array;
        // setSortedArray(arr);
        while(i < newSubArrayInfo.length) {
            if(arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
            i = i + 2;
            setSortedArray(arr);
            if(i === newSubArrayInfo.length -1) {
                break;
            }
        }
        const localMergeQueue = [...mergeQueue];
        const localMergeQueuePointer = mergeQueuePointer;
        const newmergeArray = [...mergeArrayInfo];
        
        let j = Math.ceil((newSubArrayInfo.length - localQueuePointer + 1) / 2);
        let k = localQueuePointer;
        // console.log('localQueuePointer: ', localQueuePointer);

        // const updatedArray = [...mergeArrayInfo];

        // Modify the 0th object (making sure not to mutate the original state directly)
        newmergeArray[0] = {
            // ...newmergeArray[0],  // Copy the existing properties of the 0th object
            left: newSubArrayInfo[k].left,       // Update the 'left' property
            right: newSubArrayInfo[k + 1].left      // Update the 'right' property
        };

        // Update the state with the new array
        setMergeArrayInfo(newmergeArray);
        // console.log(k);
        // console.log(newSubArrayInfo[k].left);
        // console.log(newSubArrayInfo[k + 1].left);
        // console.log(newmergeArray);
        j--;
        k = k + 2;
        console.log(newSubArrayInfo.length);
        
        while(j) {
            console.log(k);
            if(k >= newSubArrayInfo.length) {
                console.log(newSubArrayInfo.length);
                newmergeArray.push(
                    {left: newSubArrayInfo[k].left, right: newSubArrayInfo[k].left}
                )
            } else {
                newmergeArray.push(
                    {left: newSubArrayInfo[k].left, right: newSubArrayInfo[k + 1].left}
                )
            }
            j--;
            k = k + 2;
        }
        console.log(newmergeArray);

    }

    // useEffect(() => {
    //     if(queuePointer > 0) {
    //         const newDivs = [];
    //         let k = 0;
    //         for(let j = queuePointer; j < queue.length; j++, k++) {
    //             for (let i = subArrayInfo[j].left; i <= subArrayInfo[j].right; i++) {
    //                 newDivs.push(
    //                     <div
    //                         key={i}
    //                         className="border border-black bg-green-200 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap"
    //                         style={{ marginRight: `${i === subArrayInfo[j]?.right ? (i === subArrayInfo[queue.length - 1]?.right ? '0' : `20`) : '0'}px` }}
    //                     >
    //                         {array[i]}
    //                     </div>
    //                 );
    //             }
    //         } 
    //         setDividedArrays([...dividedArrays, newDivs]);
    //     }
    // }, [queuePointer]);
    
    const mergeSort = async() => {
        if (array.length === 0) {
            return;
        }
    
        const localQueue = [...queue];
        const localQueuePointer = queuePointer;
        const newSubArrayInfo = [...subArrayInfo];
    
        await divide(localQueue, localQueuePointer, newSubArrayInfo);
        
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
        <div className="md:flex bg-gradient-to-tl from-cyan-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
            <div className='md:w-70p w-full mb-2'>
                <h1 className="text-xl font-bold mb-4">Merge Sort</h1>
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
                            onClick={mergeSort}
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
                                                className="border border-black bg-cyan-300 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
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
                            {/* <div>
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
                            </div> */}
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
    );
};

export default MergeSort;
