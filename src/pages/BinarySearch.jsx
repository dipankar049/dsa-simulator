import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';

const BinarySearch = () => {
    const [array, setArray] = useState([22, 25, 32, 48, 51, 57, 64, 73]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState('');
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [mid, setMid] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isMidVisible, setIsMidVisible] = useState(false);
    const [isFound, setIsFound] = useState('');
    const [iterations, setIterations] = useState(0);
    const divRefs = useRef([]);
    const [arrayLength, setArrayLength] = useState('');
    const [customIdx, setCustomIdx] = useState('');
    const { theme } = useContext(ThemeContext);
    const { detailsState, updateState } = useContext(DetailsStateContext);

    const handleToggle = (id, isOpen) => {
        updateState(id, isOpen);
    };

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

    const binSearch = async () => {
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
        let currentLow = low;
        let currentHigh = high;
        setIsFound('');
        setIterations(0);
        let localIsEqual = false;
        let i = 0;

        while (currentLow <= currentHigh) {
            if (abortRef.current) {
                setIsRunning(false);
                toast.info("Search aborted.");
                return;
            }
            let midValue = Math.floor((currentLow + currentHigh) / 2);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMid(midValue);
            setIsMidVisible(true);
            setIterations(++i);

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

            setLow(currentLow);
            setHigh(currentHigh);
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
    }, [array, searchEle, abortRef.current]);

    useEffect(() => {
        const newDivs = [];
        for (let i = 0; i < array.length; i++) {
            newDivs.push(
                <div
                    key={i}
                    className="flex items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10"
                >
                    {i}
                </div>
            );
        }
        setDivs(newDivs);
    }, [array]);

    const createArray = async () => {
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

        if (parseInt(customIdx) !== 0 && parseInt(element) < array[parseInt(customIdx) - 1]) {
            toast.info(`Value should be greater than or equal to ${array[parseInt(customIdx) - 1]} to maintain ascending order, as Binary Search works only on sorted arrays`, {
                autoClose: 12000
            });
            return;
        } else if ((parseInt(customIdx) !== 0 && (parseInt(customIdx) !== array.length - 1)) && parseInt(element) > array[parseInt(customIdx) + 1]) {
            toast.info(`Value should be less than or equal to ${array[parseInt(customIdx) + 1]} to maintain ascending order, as Binary Search works only on sorted arrays`, {
                autoClose: 12000
            });
            return;
        } else if (parseInt(customIdx) === 0 && parseInt(element) > array[1]) {
            toast.info(`Value should be less than or equal to ${array[1]} to maintain ascending order, as Binary Search works only on sorted arrays`, {
                autoClose: 12000
            });
            return;
        }

        await delay(1000);

        if (parseInt(customIdx) === array.length) {
            let temp = parseInt(customIdx) - array.length + 1;
            let newArray = [...array];
            while (temp > 0) {
                if (temp === 1) {
                    newArray = [...newArray, parseInt(element)];
                    temp--;
                } else {
                    newArray = [...newArray, 'NULL'];
                    temp--;
                }
            }
            setArray(newArray);
        } else {
            setArray(prevArray =>
                prevArray.map((item, i) => (i === parseInt(customIdx) ? parseInt(element) : item))
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
        if (array.length !== 0 && parseInt(element) < array[array.length - 1]) {
            toast.info(`Value should be greater than or equal to ${array[array.length - 1]} to maintain ascending order, as Binary Search works only on sorted arrays`, {
                autoClose: 12000
            });
            return;
        }
        setEmptyElement(false);
        setOldArray(true);
        setArray([...array, parseInt(element)]);
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
        if (!array.includes(parseInt(element))) {
            toast.error("Element not found.");
            return;
        }

        setArray(prevArray => {
            return prevArray.map((item) => (item === parseInt(element) ? 'NULL' : item));
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
            <Helmet>
                <title>Binary Search Algorithm Simulator | DSA Simulator</title>
                <meta name="description" content="Visualize how binary search divides sorted arrays in half recursively. Learn log(n) divide-and-conquer search concepts interactively." />
                <meta name="keywords" content="binary search visualizer, log n algorithm simulation, sorted array search tool" />
            </Helmet>
            <TopicCard topicName="Binary Search" />
            <details
                className="opSection w-full h-fit p-4 mb-4"
                id='binarySearchOp'
                onToggle={(e) => { handleToggle('binarySearchOp', e.target.open) }}
                open={detailsState['binarySearchOp'] !== undefined ? detailsState['binarySearchOp'] : true}
            >
                <summary className="sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-ink cursor-pointer">Binary Search</summary>
                <div className='w-full mb-2 pt-2'>
                    <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
                        <div>
                            <input
                                name='arrayLength'
                                min={1}
                                type="number"
                                value={arrayLength}
                                onChange={(e) => { setArrayLength(e.target.value) }}
                                className="opInput w-44p rounded-l-md"
                                placeholder="Length"
                                disabled={isRunning}
                            />
                            <button
                                onClick={createArray}
                                className="opBtn btnAnimate rounded-r-md"
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
                                placeholder="Search element"
                                disabled={isRunning}
                            />
                            {isRunning ? (<button
                                onClick={() => abortRef.current = true}
                                className="opBtn-danger btnAnimate rounded-r-md"
                            >
                                Abort Search
                            </button>)
                                : (<button
                                    onClick={binSearch}
                                    className="opBtn btnAnimate rounded-r-md"
                                >
                                    Search
                                </button>)}
                        </div>
                    </div>

                    <div className='vizCard flex m-2 mx-0 mb-6'>
                        <div className='w-full p-2 overflow-x-auto'>
                            <div className='flex justify-between px-2'>
                                <p className='font-semibold' style={{ color: 'rgb(var(--color-text-secondary))' }}>Search element = {searchEle}</p>
                                <p className='font-semibold' style={{ color: 'rgb(var(--color-text-secondary))' }}>Iterations = {iterations}</p>
                            </div>
                            <div className='flex justify-between px-2'>
                                <p className='md:m-2 font-semibold text-accent'>{arrExist ? 'Array' : ''}</p>
                                <p className='md:m-2 font-medium' style={{ color: 'rgb(var(--color-text-secondary))' }}>{"Mid = low + (high - low) / 2"}</p>
                            </div>
                            <div className='w-full p-2 overflow-x-auto'>
                                <div
                                    className={`grid grid-rows-4 w-fit`}
                                    style={{ gridTemplateColumns: `repeat(${array.length || 1}, auto)` }}
                                >
                                    {/* ------------------------------- mid position ------------------------------- */}
                                    {array.map((item, index) => (
                                        <div
                                            key={index}
                                            className='arrayDiv font-semibold'
                                            style={{ color: 'rgb(var(--color-pivot))' }}
                                        >
                                            {`${index === mid ? (isMidVisible ? 'Mid' : '') : ''}`}
                                        </div>
                                    ))}

                                    {/* ------------------------------- low-high position ------------------------------- */}
                                    {array.map((item, index) => (
                                        <div
                                            key={index}
                                            className='arrayDiv font-medium'
                                            style={{ color: 'rgb(var(--color-frontier))' }}
                                        >
                                            {`${index === low ? 'Low' : (index === high ? 'High' : '')}`}
                                        </div>
                                    ))}

                                    {/* ------------------------------- index divs ------------------------------- */}
                                    {array.map((ele, index) =>
                                        <div key={index} className='arrayDiv'>{index}</div>
                                    )}

                                    {/* ------------------------------- array element divs ------------------------------- */}
                                    {array.map((item, index) => (
                                        <div
                                            id={item}
                                            key={index}
                                            ref={divRefs.current[index]}
                                            className="cell arrayDiv animate-fadeIn"
                                            style={{
                                                color: index === mid
                                                    ? (isEqual ? '#fff' : 'rgb(var(--color-text-primary))')
                                                    : 'rgb(var(--color-text-primary))',
                                                backgroundColor: index === mid
                                                    ? (isEqual ? 'rgb(var(--color-sorted))' : 'rgb(var(--color-pivot))')
                                                    : ((index < low || index > high) ? 'rgb(var(--color-bg))' : 'rgb(var(--color-element))'),
                                                borderColor: index === mid
                                                    ? (isEqual ? 'rgb(var(--color-sorted))' : 'rgb(var(--color-pivot))')
                                                    : 'rgb(var(--color-element-border))',
                                                fontWeight: index === mid ? 700 : 500,
                                                opacity: (index < low || index > high) ? 0.4 : 1,
                                                animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <p className='md:m-2 font-semibold' style={{ color: 'rgb(var(--color-sorted))' }}>{isFound}</p>
                            </div>
                            <div className='p-4 font-semibold' style={{ visibility: `${isVisible ? 'visible' : 'hidden'}`, color: 'rgb(var(--color-text-secondary))' }}>
                                <span>Low = {low} </span>
                                <span>{isMidVisible ? `Mid = ${mid}` : ''}  </span>
                                <span>High = {high}</span>
                            </div>
                        </div>
                        <div className='visualTag'>
                            <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-between gap-y-1'>
                        <div>
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
                                className="opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Push
                            </button>
                            <button
                                onClick={() => { arrayPopOperation() }}
                                className="opBtn btnAnimate"
                                disabled={isRunning}
                            >
                                Pop
                            </button>
                            <button
                                onClick={removeByEle}
                                className="opBtn btnAnimate rounded-r-md"
                                disabled={isRunning}
                            >
                                Delete by element
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
                                className="opBtn btnAnimate rounded-r-md"
                                disabled={isRunning}
                            >
                                Insert
                            </button>
                        </div>
                        <button
                            onClick={removeArray}
                            className="opBtn-danger btnAnimate"
                            disabled={isRunning}
                        >
                            Delete array
                        </button>
                    </div>
                </div>
            </details>
            <TopicCard topicName="Real-life Use (Binary Search)" />
        </div>
    );
};

export default BinarySearch;