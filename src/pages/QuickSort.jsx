// src/pages/QuickSort.jsx

import React, { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import StateLegend from '../components/Statelegend';
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const QuickSort = () => {
    const navigate = useNavigate();
    const [array, setArray] = useState([20, 64, 132, 101, 95, 7, 64, 153, 80]);
    const [element, setElement] = useState('');
    const [arrExist, setArrExist] = useState(true);
    const [iterations, setIterations] = useState(0);
    const [comparisons, setComparisons] = useState(0);
    const divRefs = useRef([]);

    const [subArrayInfo, setSubArrayInfo] = useState([{ left: 0, right: array.length - 1 }]);
    const [pivotEle, setPivotEle] = useState(-1);
    const [leftEle, setLefttEle] = useState(-1);
    const [rightEle, setRightEle] = useState(-1);
    const [isGreater, setIsGreater] = useState(false);
    const [isSmaller, setIsSmaller] = useState(false);

    const [queue, setQueue] = useState([0]);
    const [queuePointer, setQueuePointer] = useState(0);

    const [divs, setDivs] = useState([]);
    const [dividedArrays, setDividedArrays] = useState([[]]);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let singleDiv = 0;
    let noOfMultiDiv = 0;
    const divide = async (localQueue, localQueuePointer, newSubArrayInfo) => {
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
            setPivotEle(pivot);
            setLefttEle(m);
            setRightEle(n);
            noOfMultiDiv = 0;
            if (m >= array.length || n >= array.length) {
                i++;
                continue;
            }
            await delay(1000);
            while (m <= n) {
                while (array[m] <= array[pivot] || array[n] > array[pivot]) {
                    if (array[m] > array[pivot]) {
                        setIsGreater(true);
                    } else {
                        while (array[m] <= array[pivot]) {
                            m++;
                            await delay(1000);
                            setLefttEle(m);
                            if (m >= n) break;
                            if (array[m] > array[pivot]) {
                                setIsGreater(true);
                                break;
                            }
                        }
                    }

                    await delay(1000);

                    if (m <= n) {
                        if (array[n] <= array[pivot]) {
                            setIsSmaller(true);
                        } else {
                            while (array[n] > array[pivot]) {
                                n--;
                                await delay(1000);
                                setRightEle(n);
                                if (m >= n) {
                                    if (n > newSubArrayInfo[i].left) n--;
                                    break;
                                }
                                if (array[n] <= array[pivot]) {
                                    setIsSmaller(true);
                                    break;
                                }
                            }
                        }
                    } else {
                        break;
                    }
                    await delay(1000);
                }

                if (m < n) {
                    let temp = array[m];
                    array[m] = array[n];
                    array[n] = temp;
                    m++;
                    n--;
                }
                if (m >= n) {
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

            if (newSubArrayInfo[i].left === newSubArrayInfo[i].right) {
                singleDiv++;
                newSubArrayInfo.push(
                    { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].right }
                );
            } else {
                multiDiv = true;
                if (newSubArrayInfo[i].left + 1 === newSubArrayInfo[i].right) {
                    noOfMultiDiv = 2;
                    newSubArrayInfo.push(
                        { left: newSubArrayInfo[i].left, right: newSubArrayInfo[i].left },
                        { left: newSubArrayInfo[i].right, right: newSubArrayInfo[i].right }
                    );
                } else if (mid >= newSubArrayInfo[i].right) {
                    noOfMultiDiv = 2;
                    newSubArrayInfo.push(
                        { left: newSubArrayInfo[i].left, right: mid - 1 },
                        { left: mid, right: newSubArrayInfo[i].right }
                    );
                } else if (mid <= newSubArrayInfo[i].left) {
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
            i++;
        }

        let k = i;
        let j = (i - localQueuePointer - singleDiv) * noOfMultiDiv + singleDiv;

        while (j > 0) {
            localQueue.push(i++);
            j--;
        }

        setSubArrayInfo(newSubArrayInfo);
        setQueue(localQueue);
        setQueuePointer(k);

        if (multiDiv) {
            await delay(1000);
            divide([...localQueue], k, [...newSubArrayInfo]);
        }
    };

    const runQuickSort = () => {
        if (array.length === 0) return;
        const localQueue = [...queue];
        const localQueuePointer = queuePointer;
        const newSubArrayInfo = [...subArrayInfo];
        divide(localQueue, localQueuePointer, newSubArrayInfo);
    };

    useEffect(() => {
        setSubArrayInfo([{ left: 0, right: array.length - 1 }])
        setDividedArrays([[]]);
        setQueue([0]);
        setQueuePointer(0);
    }, [array]);

    useEffect(() => {
        const newDivs = [];
        for (let i = 0; i < array.length; i++) {
            newDivs.push(<div key={i} className='arrayDiv'>{i}</div>);
        }
        setDivs(newDivs);
    }, [array]);

    useEffect(() => {
        if (queuePointer > 0) {
            const newDivs = [];
            for (let j = queuePointer; j < queue.length; j++) {
                for (let i = subArrayInfo[j].left; i <= subArrayInfo[j].right; i++) {
                    newDivs.push(
                        <div
                            key={i}
                            className="cell arrayDiv"
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

    const createArray = () => {
        setOldArray(false);
        setArray([]);
        setArrExist(true);
    };

    const arrayPushOperation = () => {
        if (!arrExist || element === '') return;
        setOldArray(true);
        setArray([...array, element]);
        setElement('');
    };

    const arrayPopOperation = () => {
        if (array.length <= 0) return;
        setArray(array.slice(0, -1));
    }

    const removeByEle = () => {
        if (element === '') return;
        setArray(array.filter(item => item != element));
        setElement('');
    };

    const removeArray = () => {
        setOldArray(false);
        setArray([]);
        setArrExist(false);
    }

    const cellStyle = (index) => {
        if (index === pivotEle) {
            return {
                backgroundColor: 'rgb(var(--color-pivot))',
                borderColor: 'rgb(var(--color-pivot))',
                color: '#fff',
            };
        }
        if (index === leftEle) {
            return {
                backgroundColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                borderColor: isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                color: '#fff',
            };
        }
        if (index === rightEle) {
            return {
                backgroundColor: isSmaller ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                borderColor: isSmaller ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))',
                color: '#fff',
            };
        }
        return {};
    };

    return (
        <div className="relative w-full">
            <Helmet>
                <title>Quick Sort Visualizer | Pivot Partitioning Simulator</title>
                <meta name="description" content="See how Quick Sort picks a pivot and partitions the array around it, recursively, until the array is sorted." />
                <meta name="keywords" content="quick sort simulator, pivot partitioning visualizer, recursive sorting tool" />
            </Helmet>
            <TopicCard topicName="Quick Sort" />

            <div className="opSection w-full h-fit p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-ink">Quick Sort</h2>
                    <div className="flex gap-4 text-xs sm:text-sm text-secondary">
                        <span>Pass <b className="text-accent font-semibold">{iterations}</b></span>
                        <span>Comparisons <b className="text-accent font-semibold">{comparisons}</b></span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
                    <button onClick={createArray} className="opBtn btnAnimate rounded-md">
                        Create New array
                    </button>
                    <button onClick={runQuickSort} className="opBtn btnAnimate rounded-md">
                        Sort
                    </button>
                </div>

                <div className='vizCard flex m-2 mx-0 mb-2'>
                    <div className='w-full p-2 overflow-x-auto'>
                        {arrExist && array.length > 0 && <p className='md:m-2 font-semibold text-accent'>Array</p>}
                        <div className="flex flex-col items-start gap-3">
                            <div className="flex gap-1">{divs}</div>
                            <div className="flex gap-1">
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
                            <div className="flex flex-col gap-2">
                                {dividedArrays.map((row, index) => (
                                    <div key={index} className='flex gap-1'>{row}</div>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-secondary mt-3">
                            Pivot = <b className="text-ink">{array[pivotEle]}</b>
                        </p>
                    </div>
                    <div className='visualTag'>
                        <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                    </div>
                </div>

                <StateLegend items={[
                    { token: 'pivot', label: 'Pivot' },
                    { token: 'comparing', label: 'Scanning' },
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
                        />
                        <button onClick={arrayPushOperation} className="opBtn btnAnimate">Push</button>
                        <button onClick={arrayPopOperation} className="opBtn btnAnimate">Pop</button>
                        <button onClick={removeByEle} className="opBtn btnAnimate rounded-r-md">Delete by element</button>
                    </div>
                    <button onClick={removeArray} className="opBtn-danger btnAnimate">Delete array</button>
                </div>
            </div>

            <TopicCard topicName="Real-life Use (Quick Sort)" />

            {/* Overlay — algorithm walkthrough still in progress */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50" style={{ background: 'rgb(0 0 0 / 0.5)' }}>
                <div className="vizCard text-center shadow-lg m-6 p-8 max-w-sm">
                    <h2 className="text-xl font-semibold text-ink">Coming Soon</h2>
                    <p className="text-sm text-secondary mt-2">This visualizer is still under construction. Stay tuned!</p>
                    <button
                        onClick={() => { navigate("/") }}
                        className="opBtn btnAnimate rounded-md mt-6"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickSort;