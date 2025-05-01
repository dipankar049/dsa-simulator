import React, { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';

const BubbleSort = () => {
    const [array, setArray] = useState([220, 148, 132, 101, 95, 87, 64, 53, 8]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [isGreater, setIsGreater] = useState(false);
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [divs, setDivs] = useState([]);
    const [emptyElement, setEmptyElement] = useState(false);
    const [oldArray, setOldArray] = useState(false);
    const [arrayLength, setArrayLength] = useState('');
    const [customIdx, setCustomIdx] = useState('');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    },[element]);

    const bubbleSort = async () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        abortRef.current = false;
        setIsRunning(true);
        for(let j = 0; j < array.length -1; j++) {
            setIterations(j + 1);
        
            for(let i = 0; i < array.length -1 -j; i++) {
                if (abortRef.current) {
                    setIsRunning(false);
                    toast.info("Sorting aborted.");
                    return;
                }
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
            setIsRunning(false);
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
    }, [array, abortRef.current]);

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


    const createArray = async () => {
            //  validation of input value of array length
            if (arrayLength === '' || parseInt(arrayLength) <= 0) {
                toast.error("Array length must be greater than 0.");
                return;
            }
    
            await delay(200);
            setOldArray(false);
            setArray([]);
            setArrExist(true);
            await delay(500);
            setArray(Array(parseInt(arrayLength)).fill('NULL'));
            toast.success("Array created successfully", { position: 'top-center' });
        };
    

    //  Insert element to array
        const arrayInsert = async () => {
            if (!arrExist) {
                toast.error("Please create an array first.");
                return;
            }
    
            // Validation of element and index
            if (element === '' && customIdx === '') {
                toast.error("Please enter both element and index.");
                return;
            } else if (element === '') {
                toast.error("Please enter an element.");
                return;
            } else if (customIdx === '') {
                toast.error("Please enter an index.");
                return;
            }
    
            if (parseInt(customIdx) > array.length || parseInt(customIdx) < 0) {
                toast.error(`Index must be between 0 and ${array.length}.`);
                return;
            }
    
            await delay(1000);
    
            if (parseInt(customIdx) === array.length) {
                let temp = parseInt(customIdx) - array.length + 1;
                let newArray = [...array];
                while (temp > 0) {
                    if (temp === 1) {
                        newArray = [...newArray, Number(element)]; // Add element to newArray
                        temp--;
                    } else {
                        newArray = [...newArray, 'NULL']; // Add 'Null' to newArray
                        temp--;
                    }
                }
                setArray(newArray);
            } else {
                setArray(prevArray =>
    
                    prevArray.map((item, i) => (i === parseInt(customIdx) ? Number(element) : item))
                );
            }
    
            toast.success(`"${element}" inserted at index ${customIdx}`);
            setElement('');
            setCustomIdx('');
        }
    
        function arrayPushOperation() {
            if (!arrExist) {
                toast.error("Please create an array first.");
                return;
            }
            if (element === '') {
                toast.error("Please enter an element");
                return;
            }
            setEmptyElement(false);
            setOldArray(true);
            setArray([...array, Number(element)]);
            toast.success("Element successfully pushed into the array.");
            setElement('');
        };
    
        function arrayPopOperation() {
            if (!arrExist) {
                toast.error("Please create an array first.");
                return;
            }
            setArray(array.slice(0, -1));
            toast.success("Element popped from the array.");
        }
    
        const removeByEle = () => {
            if (!arrExist) {
                toast.error("Please create an array first.");
                return;
            }
    
            if (element === '') {
                setEmptyElement(true);
                toast.error("Please enter an element.");
                return;
            }
            setEmptyElement(false);
            if (!array.includes(Number(element))) {
                toast.error("Element not found.");
                return; // Return the array unchanged
            }
    
            // Replace the matching element with 'NULL' in the array
            setArray(prevArray => {
                return prevArray.map((item) => (item === Number(element) ? 'NULL' : item));
            });
            toast.success("Element deleted.");
            setElement('');
        };
    
        //  Delete array
        const removeArray = () => {
            if (!arrExist) {
                toast.error("Please create an array first.");
                return;
            }
    
            setOldArray(false);
            setArray([]);
            setArrExist(false);
            toast.success("Array has been successfully deleted.");
            setElement('');
            setCustomIdx('');
        }

    return (
        <div className='p-2p'>
            <TopicCard topicName="Bubble Sort" />
            <div className="md:flex bg-gradient-to-tl from-emerald-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
                <div className='w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Bubble Sort</h1>
                    <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                        <div className=''>
                        <input
                                name='arrayLength'
                                min={1}
                                type="number"
                                value={arrayLength}
                                onChange={(e) => { setArrayLength(e.target.value) }}
                                className="border border-gray-300 md:p-2 p-1 h-fit w-44p rounded-l-md shadow-inner"
                                // style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                                placeholder="Length"
                                disabled={isRunning}
                            />
                            <button
                                onClick={createArray}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
                                disabled={isRunning}
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            {isRunning ? <button
                                onClick={() => abortRef.current = true}
                                className="bg-red-500 hover:bg-red-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:px-4 p-2 h-fit rounded-md"
                            >
                                Abort Sorting
                            </button>
                            : <button
                                onClick={bubbleSort}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:px-4 p-2 h-fit rounded-md"
                            >
                                Sort
                            </button>}
                        </div>
                    </div>
                    <div className='flex m-2 mx-0 mr-4 sm:mr-0 mb-6 bg-white border border-gray-300 rounded-md shadow-xl'>
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
                            <div className='mt-4'>
                                <p className='text-blue-700'>🔵 ──➤ Comparing</p>
                                <p className='text-red-600'>🔴 ──➤ Swapping</p>
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
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayPushOperation}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                                disabled={isRunning}
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit"
                                disabled={isRunning}
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white lg:font-bold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl md:p-2 p-1 h-fit rounded-r-md"
                                disabled={isRunning}
                            >
                                delete by element
                            </button>
                        </div>
                        <div>
                            <input
                                name='customIdx'
                                type="number"
                                min={0}
                                value={customIdx}
                                onChange={(e) => { setCustomIdx(e.target.value) }}
                                className="md:p-2 p-1 h-fit w-36p shadow-inner"
                                style={{ border: '1px solid #d1d5db' }}
                                placeholder="Enter index"
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayInsert}
                                className="bg-emerald-500 hover:bg-emerald-600  lg:font-bold text-white md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                                disabled={isRunning}
                            >
                                Insert
                            </button>
                        </div>
                        <button
                            onClick={removeArray}
                            className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                            disabled={isRunning}
                        >
                            delete array
                        </button>
                    </div>

                </div>
                {/* <div className='min-h-full w-full md:w-28p bg-black  md:m-4 md:mr-0 md:ml-2p'>
                    <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
                        <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                    </div>
                </div> */}
            </div>
            <TopicCard topicName="Real-life Use (Bubble Sort)" />
        </div>
    );
};

export default BubbleSort;
