import React, { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import StateLegend from '../components/Statelegend';

const BubbleSort = () => {
    const [array, setArray] = useState([220, 148, 132, 101, 95, 87, 64, 53, 8]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const abortRef = useRef(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSorted, setIsSorted] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [isGreater, setIsGreater] = useState(false);
    const [firstEle, setFirstEle] = useState(-1);
    const [seacondEle, setSeacondEle] = useState(-1);

    const [oldArray, setOldArray] = useState(false);
    const [arrayLength, setArrayLength] = useState('');
    const [customIdx, setCustomIdx] = useState('');

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const bubbleSort = async () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        abortRef.current = false;
        setIsRunning(true);
        setIsSorted(false);
        for (let j = 0; j < array.length - 1; j++) {
            setIterations(j + 1);

            for (let i = 0; i < array.length - 1 - j; i++) {
                if (abortRef.current) {
                    setIsRunning(false);
                    toast.info("Sorting aborted.");
                    return;
                }
                setComparisons(i + 1);
                setFirstEle(i);
                setSeacondEle(i + 1);
                await delay(1000);

                if (array[i] > array[i + 1]) {
                    setIsGreater(true);
                    await delay(1000);
                    let temp = array[i];
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                }

                setIsGreater(false);
                await delay(1000);
            }
        }
        setFirstEle(-1);
        setSeacondEle(-1);
        setIsRunning(false);
        setIsSorted(true);
    }

    useEffect(() => {
        setIsGreater(false);
        setIterations(0);
        setComparisons(0);
        setFirstEle(-1);
        setSeacondEle(-1);
        setIsSorted(false);
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
                newArray = temp === 1 ? [...newArray, Number(element)] : [...newArray, 'NULL'];
                temp--;
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

    const arrayPushOperation = () => {
        if (!arrExist) {
            toast.error("Please create an array first.");
            return;
        }
        if (element === '') {
            toast.error("Please enter an element");
            return;
        }
        setOldArray(true);
        setArray([...array, Number(element)]);
        toast.success("Element successfully pushed into the array.");
        setElement('');
    };

    const arrayPopOperation = () => {
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
            toast.error("Please enter an element.");
            return;
        }
        if (!array.includes(Number(element))) {
            toast.error("Element not found.");
            return;
        }
        setArray(prevArray => prevArray.map((item) => (item === Number(element) ? 'NULL' : item)));
        toast.success("Element deleted.");
        setElement('');
    };

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

    const cellStyle = (index) => {
        const isComparing = index === firstEle || index === seacondEle;
        if (isComparing) {
            return {
                backgroundColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                borderColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                color: '#fff',
            };
        }
        return {};
    };

    return (
        <div>
            <Helmet>
                <title>Bubble Sort Visualizer | Interactive Sorting Simulator</title>
                <meta name="description" content="Simulate the bubble sort algorithm swapping adjacent elements step-by-step. Perfect visual aid for learning O(n²) sorting mechanics." />
                <meta name="keywords" content="bubble sort simulator, interactive sorting visualizer, adjacent element swapping" />
            </Helmet>
            <TopicCard topicName="Bubble Sort" />

            <div className="opSection w-full h-fit p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-ink">Bubble Sort</h2>
                    <div className="flex gap-4 text-xs sm:text-sm text-secondary">
                        <span>Pass <b className="text-accent font-semibold">{iterations}</b></span>
                        <span>Comparisons <b className="text-accent font-semibold">{comparisons}</b></span>
                        {isSorted && <span className="font-semibold" style={{ color: 'rgb(var(--color-sorted))' }}>Sorted ✓</span>}
                    </div>
                </div>

                <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
                    <div className='mr-2'>
                        <input
                            name='arrayLength'
                            min={1}
                            type="number"
                            value={arrayLength}
                            onChange={(e) => { setArrayLength(e.target.value) }}
                            className="opInput w-40p rounded-l-md"
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
                        {isRunning ? (
                            <button
                                onClick={() => abortRef.current = true}
                                className="opBtn-danger btnAnimate"
                            >
                                Abort Sorting
                            </button>
                        ) : (
                            <button
                                onClick={bubbleSort}
                                className="opBtn btnAnimate rounded-md"
                            >
                                Sort
                            </button>
                        )}
                    </div>
                </div>

                <div className='vizCard flex m-2 mx-0 mb-2'>
                    <div className='w-full p-2 overflow-x-auto'>
                        {arrExist && array.length > 0 && <p className='md:m-2 font-semibold text-accent'>Array</p>}
                        <div
                            className="grid grid-rows-2 w-fit"
                            style={{ gridTemplateColumns: `repeat(${array.length || 1}, auto)` }}
                        >
                            {array.map((ele, index) =>
                                <div key={index} className='arrayDiv'>{index}</div>
                            )}

                            {array.map((item, index) => (
                                <div
                                    id={item}
                                    key={index}
                                    ref={divRefs.current[index]}
                                    className="cell arrayDiv animate-fadeIn"
                                    style={{
                                        ...cellStyle(index),
                                        animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='visualTag'>
                        <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                    </div>
                </div>

                <StateLegend items={[
                    { token: 'comparing', label: 'Comparing' },
                    { token: 'swapping', label: 'Swapping' },
                ]} />

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
                        <button onClick={arrayPushOperation} className="opBtn btnAnimate" disabled={isRunning}>Push</button>
                        <button onClick={arrayPopOperation} className="opBtn btnAnimate" disabled={isRunning}>Pop</button>
                        <button onClick={removeByEle} className="opBtn btnAnimate rounded-r-md" disabled={isRunning}>Delete by element</button>
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
                        <button onClick={arrayInsert} className="opBtn btnAnimate rounded-r-md" disabled={isRunning}>Insert</button>
                    </div>
                    <button onClick={removeArray} className="opBtn-danger btnAnimate" disabled={isRunning}>Delete array</button>
                </div>
            </div>

            <TopicCard topicName="Real-life Use (Bubble Sort)" />
        </div>
    );
};

export default BubbleSort;