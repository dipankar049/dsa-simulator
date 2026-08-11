// src/pages/MergeSort.jsx

import React, { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import StateLegend from '../components/Statelegend';
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const MergeSort = () => {
    const navigate = useNavigate();
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

    const [subArrayInfo, setSubArrayInfo] = useState([{ left: 0, right: array.length - 1 }]);
    const [mergeArrayInfo, setMergeArrayInfo] = useState([{ left: 0, right: array.length - 1 }]);

    const [queue, setQueue] = useState([0]);
    const [mergeQueue, setMergeQueue] = useState([0]);
    const [queuePointer, setQueuePointer] = useState(0);
    const [mergeQueuePointer, setMergeQueuePointer] = useState(0);

    const [divs, setDivs] = useState([]);
    const [dividedArrays, setDividedArrays] = useState([[]]);
    const [oldArray, setOldArray] = useState(false);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let singleDiv = 0;
    const divide = async (localQueue, localQueuePointer, newSubArrayInfo) => {
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
                if (newSubArrayInfo[i].left + 1 === newSubArrayInfo[i].right) {
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

        setSubArrayInfo(newSubArrayInfo);
        setQueue(localQueue);
        setQueuePointer(k);

        if (multiDiv) {
            await delay(1000);
            await divide([...localQueue], k, [...newSubArrayInfo]);
        } else {
            conquere([...localQueue], k, [...newSubArrayInfo]);
        }
    };

    const conquere = async (localQueue, localQueuePointer, newSubArrayInfo) => {
        let i = localQueuePointer;
        let arr = array;
        while (i < newSubArrayInfo.length) {
            if (arr[i] > arr[i + 1]) {
                let temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
            i = i + 2;
            setSortedArray(arr);
            if (i === newSubArrayInfo.length - 1) {
                break;
            }
        }
        const newmergeArray = [...mergeArrayInfo];

        let j = Math.ceil((newSubArrayInfo.length - localQueuePointer + 1) / 2);
        let k = localQueuePointer;

        newmergeArray[0] = {
            left: newSubArrayInfo[k].left,
            right: newSubArrayInfo[k + 1].left
        };

        setMergeArrayInfo(newmergeArray);
        j--;
        k = k + 2;

        while (j) {
            if (k >= newSubArrayInfo.length) {
                newmergeArray.push(
                    { left: newSubArrayInfo[k].left, right: newSubArrayInfo[k].left }
                )
            } else {
                newmergeArray.push(
                    { left: newSubArrayInfo[k].left, right: newSubArrayInfo[k + 1].left }
                )
            }
            j--;
            k = k + 2;
        }
    }

    const mergeSort = async () => {
        if (array.length === 0) {
            return;
        }
        const localQueue = [...queue];
        const localQueuePointer = queuePointer;
        const newSubArrayInfo = [...subArrayInfo];
        await divide(localQueue, localQueuePointer, newSubArrayInfo);
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

    return (
        <div className="relative w-full">
            <Helmet>
                <title>Merge Sort Visualizer | Divide &amp; Conquer Simulator</title>
                <meta name="description" content="Watch Merge Sort split an array into halves and merge them back together in sorted order." />
                <meta name="keywords" content="merge sort simulator, divide and conquer visualizer, recursive sorting tool" />
            </Helmet>
            <TopicCard topicName="Merge Sort" />

            <div className="opSection w-full h-fit p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-ink">Merge Sort</h2>
                    <div className="flex gap-4 text-xs sm:text-sm text-secondary">
                        <span>Pass <b className="text-accent font-semibold">{iterations}</b></span>
                        <span>Comparisons <b className="text-accent font-semibold">{comparisons}</b></span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
                    <button onClick={createArray} className="opBtn btnAnimate rounded-md">
                        Create New array
                    </button>
                    <button onClick={mergeSort} className="opBtn btnAnimate rounded-md">
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
                                            backgroundColor: index === firstEle || index === seacondEle
                                                ? (isGreater ? 'rgb(var(--color-swapping))' : 'rgb(var(--color-comparing))')
                                                : undefined,
                                            color: index === firstEle || index === seacondEle ? '#fff' : undefined,
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
                        />
                        <button onClick={arrayPushOperation} className="opBtn btnAnimate">Push</button>
                        <button onClick={arrayPopOperation} className="opBtn btnAnimate">Pop</button>
                        <button onClick={removeByEle} className="opBtn btnAnimate rounded-r-md">Delete by element</button>
                    </div>
                    <button onClick={removeArray} className="opBtn-danger btnAnimate">Delete array</button>
                </div>
            </div>

            <TopicCard topicName="Real-life Use (Merge Sort)" />

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

export default MergeSort;