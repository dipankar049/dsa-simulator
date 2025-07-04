import React, { useState, useRef, useEffect, useContext } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const LinearSearch = () => {
    const [array, setArray] = useState([22, 54, 33, 12098, 9733, 44]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState('');
    // const [searchEle2, setSearchEle2] = useState(0);
    const [idx, setIdx] = useState(0);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isFound, setIsFound] = useState('');
    const divRefs = useRef([]);
    const [isVisible, setIsVisible] = useState('false');
    const [arrayLength, setArrayLength] = useState('');
    const [customIdx, setCustomIdx] = useState('');
    const { theme } = useContext(ThemeContext);

    const [divs, setDivs] = useState([]);

    const [emptyElement, setEmptyElement] = useState(false);
    const [emptySearchElement, setEmptySearchElement] = useState(false);

    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        setEmptyElement(false);
    }, [element]);

    useEffect(() => {
        setEmptySearchElement(false);
    }, [searchEle]);

    const LinSearch = async () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        if (searchEle === '') {
            toast.error("Please enter an search element.");
            setEmptySearchElement(true);
            return;
        }
        abortRef.current = false;
        setIsRunning(true);
        setEmptySearchElement(false);
        setIsVisible(true);
        setIsFound('');
        let localIsEqual = false;
        setIsEqual(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
        for (let i = 0; i < array.length; i++) {
            if (abortRef.current) {
                setIsRunning(false);
                toast.info("Search aborted.");
                return;
            }
            if (!localIsEqual) {
                setIdx(i);

                if (parseInt(searchEle) === array[i]) {
                    setIsEqual(true);
                    localIsEqual = true;
                    break; // Set isEqual to true if the element is found
                }
            }
            await delay(1000);
            console.log(i);
        }
        if (localIsEqual) {
            toast.info("Element found");
            setIsFound('Found');
        } else {
            toast.info("Element not found");
            setIsFound('Not Found')
        }
        setIsRunning(false);
    }

    useEffect(() => {
        // if(idx > 0) controller.abort;
        setIsFound('');
        setIdx(0);
        setIsEqual(false);
        setIsVisible(false);
        // LinSearch();
    }, [array, searchEle, abortRef.current]);

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
            <TopicCard topicName="Linear Search" />
            <div className={`${theme === 'light' ? 'bg-gradient-to-tl from-indigo-200' : 'bg-gray-800'} h-fit w-full p-4 rounded-lg`}>
                <div className='w-full mb-2'>
                    <h1 className="text-xl font-bold mb-4">Linear Search</h1>
                    <div className="flex justify-between mb-4 w-full">
                        <div className='mr-2'>
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
                                className="bg-indigo-500 hover:bg-indigo-600 opBtn btnAnimate rounded-r-md"
                                disabled={isRunning}
                            >
                                Create New array
                            </button>
                        </div>
                        <div className='flex flex-wrap justify-end'>
                            <input
                                type="number"
                                value={searchEle}
                                onChange={(e) => setSearchEle(e.target.value)}
                                className="opInput w-50p rounded-l-md"
                                // style={{ border: `${emptySearchElement ? '2px solid red' : '1px solid #d1d5db'}` }}
                                placeholder="Search element"
                                disabled={isRunning}
                            />
                            {isRunning ? (<button
                                onClick={() => abortRef.current = true}
                                className="bg-red-500 hover:bg-red-600 opBtn btnAnimate rounded-r-md"
                            >
                                Abort Search
                            </button>)
                                : (<button
                                    onClick={LinSearch}
                                    className="bg-indigo-500 hover:bg-indigo-600 opBtn btnAnimate rounded-r-md"
                                >
                                    Search
                                </button>)
                            }
                        </div>
                    </div>
                    <div className='flex m-2 mx-0 mb-6 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded-md shadow-xl'>
                        <div className='w-full p-2'>
                            <p className='m-2 font-bold text-indigo-700 dark:text-indigo-200'>{arrExist ? 'Array' : ''}</p>
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
                                                className="border border-black bg-indigo-300 flex justify-center flex-shrink-0 md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                                                // style={{ color: `${index === idx ? 'blue' : 'black'}`, }}
                                                style={{
                                                    color: `${index === idx ? (isEqual ? 'red' : 'black') : 'black'}`,
                                                    fontSize: `${index === idx ? (isEqual ? 'medium' : '') : ''}`,
                                                    fontWeight: `${index === idx ? 'bold' : ''}`,
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
                                <div className='p-4'>
                                    <p className='font-bold' style={{ visibility: `${isVisible ? 'visible' : 'hidden'}` }}>
                                        {searchEle} == Arr[{idx}]({array[idx]})
                                        <span style={{ color: `${isEqual ? 'red' : 'blue'}` }}>
                                            {isEqual ? ' ---->Equal' : ' ---->Not Equal'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-indigo-800 rounded-r-md'>
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
                                // style={{ border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}` }}
                                placeholder="Enter element"
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayPushOperation}
                                className="bg-indigo-500 hover:bg-indigo-600 opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="bg-indigo-500 hover:bg-indigo-600 opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="bg-indigo-500 hover:bg-indigo-600 opBtn btnAnimate rounded-r-md"
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
                                className="opInput w-36p shadow-inner"
                                // style={{ border: '1px solid #d1d5db' }}
                                placeholder="Enter index"
                                disabled={isRunning}
                            />
                            <button
                                onClick={arrayInsert}
                                className="bg-indigo-500 hover:bg-indigo-600 rounded-r-md opBtn btnAnimate"
                                disabled={isRunning}>
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
            </div>
            <TopicCard topicName="Real-life Use (Linear Search)" />
        </div>
    );
};

export default LinearSearch;