import React, { useState, useRef, useEffect, useContext } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const SelectionSort = () => {
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const { theme } = useContext(ThemeContext);

    const [isSmaller, setIsSmaller] = useState(false);
    const [min, setMin] = useState(-1);
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
    }, [element]);

    const selectionSort = async () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        setIsVisible(true);
        abortRef.current = false;
        setIsRunning(true);
        for (let j = 0; j < array.length - 1; j++) {
            setFirstEle(j);
            setIterations(j + 1);
            setMin(j);
            let min = j;

            for(let i = j; i < array.length; i++) {
                if (abortRef.current) {
                    setIsRunning(false);
                    toast.info("Sorting aborted.");
                    return;
                }
                setComparisons(i + 1);
                setSeacondEle(i);
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (array[i] < array[min]) {
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

            if (j === array.length - 2) {
                setIsSorted(true);
                setMin(-1);
                setFirstEle(-1);
                setSeacondEle(-1);
            }
        }
        setIsRunning(false);
    }

    useEffect(() => {
        if (array.length == 0) {
            setIsVisible(false);

        }
        setIsSorted(false);
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
        <div>
            <TopicCard topicName="Selection Sort" />
            <div className={`${theme === 'light' ? 'bg-gradient-to-tl from-violet-200' : 'bg-gray-800'} h-fit w-full p-4 rounded-lg`}>
                <div className='w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Selection Sort</h1>
                    <div className="flex justify-between mb-4 w-full">
                        <div className=''>
                        <input
                                name='arrayLength'
                                min={1}
                                type="number"
                                value={arrayLength}
                                onChange={(e) => { setArrayLength(e.target.value) }}
                                className="opInput w-44p rounded-l-md"
                                // style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                                placeholder="Length"
                                disabled={isRunning}
                            />
                            <button
                                onClick={createArray}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate rounded-r-md"
                                disabled={isRunning}
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            {isRunning ? <button
                                onClick={() => abortRef.current = true}
                                className="bg-red-500 hover:bg-red-600 opBtn btnAnimate rounded-md"
                            >
                                Abort Sorting
                            </button>
                            : <button
                                onClick={selectionSort}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate rounded-md"
                            >
                                Sort
                            </button>}
                        </div>
                    </div>
                    <div className='flex m-2 mx-0 mr-4 sm:mr-0 mb-6 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded-md shadow-xl'>
                        <div className='w-full p-2'>

                            <div className='flex justify-between'>
                                <p className='pl-4 font-bold'>Comparisons = {comparisons}</p>
                                <p className='font-bold'>Iterations = {iterations}</p>
                            </div>
                            <p className='m-2 font-bold text-violet-600 dark:text-violet-200'>{arrExist ? 'Array' : ''}</p>
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
                                            className="border border-black bg-violet-300 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                                            // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                            style={{
                                                color: `${index === min ? 'red' : (index === seacondEle ? (isSmaller ? 'red' : 'blue') : 'black')}`,
                                                fontWeight: `${(index === min || index === seacondEle || index === firstEle) ? 'bold' : ''}`,
                                                backgroundColor: `${index === firstEle ? 'white' : ''}`,
                                                animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`, // Stagger the delay by 0.2s per item
                                                animationFillMode: 'both' // Ensures the element stays visible after the animation ends
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
                        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-violet-800 rounded-r-md'>
                            <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p><p>I</p><p>Z</p><p>E</p><p>D</p><p>S</p><p>A</p>
                        </div>
                    </div>
                    <div className='flex flex-wrap justify-between'>
                        <div className=''>
                            <input
                                type="number"
                                value={element}
                                onChange={(e) => setElement(e.target.value)}
                                className="opInput w-36p rounded-l-md"
                                placeholder="Enter element"
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayPushOperation}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate rounded-r-md"
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
                                className="opInput w-36p"
                                placeholder="Enter index"
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayInsert}
                                className="bg-violet-600 hover:bg-violet-700 opBtn btnAnimate rounded-r-md"
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
            <TopicCard topicName="Real-life Use (Selection Sort)" />
        </div>
    );
};

export default SelectionSort;
