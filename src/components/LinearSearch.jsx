// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const LinearSearch = () => {
    const [array, setArray] = useState([22,54,33,12098,9733,44]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState(0);
    // const [searchEle2, setSearchEle2] = useState(0);
    const [idx, setIdx] = useState(0);
    const [cancleFun, setCancleFun] = useState(false);
    const [isFound, setIsFound] = useState('');
    const divRefs = useRef([]);
    const [isVisible, setIsVisible] = useState('false');

    const [divs, setDivs] = useState([]);

    // function LinSearch() {
    //     for(let i = 0; i < array.length; i++) {
    //         if(!isEqual) {
    //             setTimeout(() => {
    //                 setIdx(i);
    //                 if(searchEle == array[i]) {
    //                     setIsEqual(true);
    //                 }
    //             }, i * 1000);
    //         }
    //     }
    // } 

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    
    // const controller = new AbortController();
    // const {signal} = controller;

    const LinSearch = async () => {
        if(array.length === 0) {
            return;
        }
        setIsVisible(true);
        setIsFound('');
        let localIsEqual = false;
        setIsEqual(false);
        // setIdx(0);
        await new Promise((resolve) => setTimeout(resolve, 500));
        for (let i = 0; i < array.length; i++) {
            // if(signal.aborted) {
            //     console.log('hii');
            //     return;
            // }
            if (!localIsEqual) {
                setIdx(i); // Update the index to reflect the current search position
                await delay(1000); // Wait for 1 second before proceeding
    
                if (searchEle == array[i]) {
                    setIsEqual(true);
                    localIsEqual = true;
                    console.log("found");
                    break; // Set isEqual to true if the element is found
                }
            }
            console.log(i);
            // setIsEqual(localIsEqual);
        }
        if(localIsEqual) {
            setIsFound('Found');
        } else {
            setIsFound('Not Found')
        }
    }

    useEffect(() => {
        // if(idx > 0) controller.abort;
        setIsFound('');
        setIdx(0);
        setIsEqual(false);
        setIsVisible(false);
        // LinSearch();
    },[array, searchEle]);

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
    };

    function arrayPushOperation() {
        if(!arrExist) {
            return;
        };
        if(element) {
            setArray([...array, element]);
        }
        setElement('');
        // setCustomIdx(-1);
    };

    function arrayPopOperation() {
    //   console.log(idx);
        if(array.length < 0) {
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
    }

    return ( 
        <div className="md:flex bg-green-100 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
            <div className='md:w-70p w-full mb-2'>
                <h1 className="text-xl font-bold mb-4">Linear Search</h1>
                <div className="flex justify-between mb-4 w-full">
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
                            // value={element}
                            onChange={(e) => setSearchEle(e.target.value)}
                            className="border border-gray-300 md:p-2 p-1 h-fit w-50p rounded-l-md"
                            placeholder="Enter element"
                        />
                        <button
                            onClick={LinSearch}
                            className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md'>
                    <div className='w-full p-2'>
                    <p className='m-2 font-bold'>{arrExist ? 'Arr' : ''}</p>
                        <div className=''>
                            <div className='overflow-x-auto'>
                                <div className="flex md:ml-4">
                                    {array.map((item, index) => (
                                        <div
                                            // id={item}
                                            key={index}
                                            
                                            className='flex items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10'
                                            style={{ color: `${isEqual ? 'red' : 'blue'}`, }}
                                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                        >
                                            {/* <p ref={SearchEleRef} 
                                            style={{ color: `${isEqual ? 'blue' : 'red'}`, }}>  */}
                                            {`${index === idx ? searchEle : ''}`}
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
                                            className="border border-black bg-green-200 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap"
                                            // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                            style={{ color: `${index === idx ? (isEqual ? 'red' : 'black') : 'black'}`,
                                                    fontSize: `${index === idx ? (isEqual ? 'medium' : '') : ''}`,
                                                    fontWeight: `${index === idx ? 'bold' : ''}` }}
                                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                    <p className='m-2 font-bold text-green-500'>{isFound}</p>
                                </div>
                            </div>
                            <div className='p-4'>
                                <p className='font-bold' style={{visibility: `${isVisible ? 'visible' : 'hidden'}`}}>
                                    {searchEle} == Arr[{idx}]({array[idx]})
                                    <span style={{color: `${isEqual ? 'red' : 'blue'}`}}>
                                        {isEqual ? ' ---->Equal' : ' ---->Not Equal'}
                                    </span> 
                                </p>
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
                            onChange={(e) => setElement(e.target.value)}
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
                            onClick={() => {arrayPopOperation()}}
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

export default LinearSearch;
