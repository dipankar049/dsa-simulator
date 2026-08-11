import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';

const LinearSearch = () => {
    const [array, setArray] = useState([22, 54, 33, 12098, 9733, 44]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [isEqual, setIsEqual] = useState(false);
    const [searchEle, setSearchEle] = useState('');
    const [idx, setIdx] = useState(0);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isFound, setIsFound] = useState('');
    const divRefs = useRef([]);
    const [isVisible, setIsVisible] = useState('false');
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
        setIsFound('');
        setIdx(0);
        setIsEqual(false);
        setIsVisible(false);
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

        await delay(1000);

        if (parseInt(customIdx) === array.length) {
            let temp = parseInt(customIdx) - array.length + 1;
            let newArray = [...array];
            while (temp > 0) {
                if (temp === 1) {
                    newArray = [...newArray, Number(element)];
                    temp--;
                } else {
                    newArray = [...newArray, 'NULL'];
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
            return;
        }

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
            <Helmet>
                <title>Linear Search Algorithm Simulator | DSA Simulator</title>
                <meta name="description" content="Watch how linear search checks unsorted lists sequentially element-by-element. Understand O(n) search time complexity." />
                <meta name="keywords" content="linear search animation, sequential search tool, linear search visualizer" />
            </Helmet>
            <TopicCard topicName="Linear Search" />
            <details
                className="opSection w-full h-fit p-4 mb-4"
                id='linearSearchOp'
                onToggle={(e) => { handleToggle('linearSearchOp', e.target.open) }}
                open={detailsState['linearSearchOp'] !== undefined ? detailsState['linearSearchOp'] : true}
            >
                <summary className="sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-ink cursor-pointer">Linear Search</summary>
                <div className='w-full mb-2 pt-2'>
                    <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
                        <div className='mr-2'>
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
                                    onClick={LinSearch}
                                    className="opBtn btnAnimate rounded-r-md"
                                >
                                    Search
                                </button>)
                            }
                        </div>
                    </div>

                    <div className='vizCard flex m-2 mx-0 mb-6'>
                        <div className='w-full p-2 overflow-x-auto'>
                            {arrExist && <p className='md:m-2 font-semibold text-accent'>Array</p>}
                            <div className='w-full p-2 overflow-x-auto'>
                                <div
                                    className={`grid grid-rows-3 w-fit`}
                                    style={{ gridTemplateColumns: `repeat(${array.length || 1}, auto)` }}
                                >
                                    {/* ------------------------------- highlighted search value row ------------------------------- */}
                                    {array.map((item, index) => (
                                        <div
                                            key={index}
                                            className='arrayDiv font-semibold'
                                            style={{ color: isEqual ? `rgb(var(--color-sorted))` : `rgb(var(--color-frontier))` }}
                                        >
                                            {`${index === idx ? searchEle : ''}`}
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
                                                color: index === idx
                                                    ? (isEqual ? '#fff' : 'rgb(var(--color-text-primary))')
                                                    : 'rgb(var(--color-text-primary))',
                                                backgroundColor: index === idx
                                                    ? (isEqual ? 'rgb(var(--color-sorted))' : 'rgb(var(--color-frontier))')
                                                    : 'rgb(var(--color-element))',
                                                borderColor: index === idx
                                                    ? (isEqual ? 'rgb(var(--color-sorted))' : 'rgb(var(--color-frontier))')
                                                    : 'rgb(var(--color-element-border))',
                                                fontWeight: index === idx ? 700 : 500,
                                                animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`,
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ------------------------------- comparison ------------------------------- */}
                            <div className='p-4'>
                                <p className='font-semibold' style={{ visibility: `${isVisible ? 'visible' : 'hidden'}` }}>
                                    {searchEle} == Arr[{idx}]({array[idx]})
                                    <span style={{ color: isEqual ? `rgb(var(--color-sorted))` : `rgb(var(--color-frontier))` }}>
                                        {isEqual ? ' ---->Equal' : ' ---->Not Equal'}
                                    </span>
                                </p>
                            </div>
                            <p className='md:m-2 font-semibold' style={{ color: 'rgb(var(--color-sorted))' }}>{isFound}</p>
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
                                disabled={isRunning}>
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
            <TopicCard topicName="Real-life Use (Linear Search)" />
        </div>
    );
};

export default LinearSearch;