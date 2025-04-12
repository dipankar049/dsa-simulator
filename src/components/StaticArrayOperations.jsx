import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import { ThemeContext } from '../context/ThemeContext';
import TopicCard from './TopicCard';

const StaticArrayOperations = () => {
  const [array, setArray] = useState([15, 22, 12, 56, 24]);
  const [element, setElement] = useState('');
  const [arrayLength, setArrayLength] = useState('');
  const [customIdx, setCustomIdx] = useState(''); 
  const [arrExist, setArrExist] = useState(true);
  const divRefs = useRef([]);
  const [divs, setDivs] = useState([]);

  const [emptyLength, setEmptyLength] = useState(false);
  const [emptyElement, setEmptyElement] = useState(false);
  const [emptyInex, setEmptyIndex] = useState(false);

  const[operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const[operationEleVisibility, setOperationEleVisibility] = useState(false);

  const {detailsState, updateState} = useContext(DetailsStateContext);
  // const updateState = useDetailsDispatch();

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen); // Update context and persist state
  };

  const { theme } = useContext(ThemeContext);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    setEmptyLength(false);
  },[arrayLength]);

  useEffect(() => {
    setEmptyElement(false);
  },[element]);

  useEffect(() => {
    setEmptyIndex(false);
  },[customIdx]);

  useEffect(() => {
    const newDivs = [];
    for (let i = 0; i < array.length; i++) {
      newDivs.push(
        <div
          key={i}
          className="flex items-center text-black justify-center flex-shrink-0 lg:w-14 md:12 w-10"
          // style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
        >
          {i}
        </div>
      );
    }
    setDivs(newDivs); // Update the state with new divs
  },[array]);

  const createArray = async() => {
    
    if(arrayLength === '') {
      console.log('empty length');
      setEmptyLength(true);
      return;
    }
    if(arrayLength == 0) {
      console.log('zero length');
      return;
    }
    setEmptyLength(false);
    setArray([]);
    setArrExist(false);
    await delay(500);
    setArray(Array(parseInt(arrayLength)).fill('NULL'));
    setArrExist(true);
    setArrayLength('');
  }; 

  const arrayInsert = async() => {
    if(!arrExist) {
      return;
    };
    
    if(element === '') {
      console.log(customIdx);
      if(customIdx === '') {
        setEmptyIndex(true);
      } else {
        setEmptyIndex(false);
      }
      console.log('empty length');
      setEmptyElement(true);
      return;
    }
    setEmptyElement(false);
    if(customIdx === '') {
      setEmptyIndex(true);
      return;
    }
    setEmptyIndex(false);

    if(parseInt(customIdx) >= array.length || parseInt(customIdx) < 0) {
      console.log("Invalid index");
      return;
    }
    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setOperationEleVisibility(true);
    await delay(1000);
    if(element) {
        setArray(prevArray => 
            prevArray.map((item, i) => (i === parseInt(customIdx) ? element : item))
        );
    }
    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);
    setElement('');
    setCustomIdx('');
  }

  const deleteByIdx = async() => {
    if(customIdx === '') {
      setEmptyIndex(true);
      return;
    }
    setEmptyIndex(false);

    if(parseInt(customIdx) >= array.length || parseInt(customIdx) < 0) {
        console.log("Invalid index");
        return;
    }
    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setArray(prevArray => 
        prevArray.map((item, i) => (i === parseInt(customIdx) ? 'NULL' : item))
    );
    setOperationIdxVisibility(false);
    setCustomIdx('');
  }

  const deleteByEle = async() => {
    if(element === '') {
      setEmptyElement(true);
      return;
    }
    setEmptyElement(false);
    if(element) {
      setArray(prevArray => 
        prevArray.map((item, i) => (item == element ? 'NULL' : item))
      );
    }
    setElement('');
  }

  const removeArray = () => {
    setArray([]);
    setArrayLength('');
    setArrExist(false);
  }

  return (
    <div className='p-2p bg-white text-gray-700 
                    dark:bg-gray-700 dark:text-white 
                    md:text-base sm:text-sm text-xs'
      >
      <TopicCard topicName="Array" />
      <TopicCard topicName="Static Array" />
      <details 
       className="bg-gradient-to-l from-teal-200 h-fit w-full p-4 dark:from-gray-500 rounded-lg"
       id='staticArrayOp'
       onToggle={(e) => {handleToggle('staticArrayOp', e.target.open)}}
       open={detailsState['staticArrayOp'] !== undefined ? detailsState['staticArrayOp'] : true }
      >
      <summary className="mb-4">Static Array Operations</summary>
        <div className='md:flex'>
            <div className='md:w-70p w-full mb-2'>
              <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                <div className='mr-2'>
                  <input
                    type="number"
                    value={arrayLength}
                    onChange={(e) => setArrayLength(e.target.value)}
                    className=" md:p-2 p-1 h-fit w-40p rounded-l-md shadow-inner"
                    style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                    placeholder="Length"
                  />
                  <button
                    onClick={createArray}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Create New array
                  </button>
                </div>
                <div className='flex flex-wrap justify-end text-black'>
                  <input
                    type="number"
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    className="md:p-2 p-1 h-fit w-36p rounded-l-md shadow-inner"
                    style={{border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                    placeholder="Enter element"
                  />
                  <input
                    type="number"
                    value={customIdx}
                    onChange={(e) => setCustomIdx(e.target.value)}
                    className="md:p-2 p-1 h-fit w-36p shadow-inner"
                    style={{border: `${emptyInex ? '2px solid red' : '1px solid #d1d5db'}`}}
                    placeholder="Enter index"
                  />
                  <button
                    onClick={arrayInsert}
                    className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                  >
                    Insert
                  </button>
                </div> 
                
              </div>
              <div className='flex m-2 mx-0 mb-6 bg-white dark:bg-gray-300 dark:text-white border border-gray-300 shadow-xl rounded-md'>
                <div className='w-full p-2 overflow-x-auto'>
                  <p className='md:m-2 font-bold text-teal-800 dark:text-black'>{arrExist ? 'Array': ''}</p>
                  <div className="flex md:ml-4">
                    {divs}
                  </div>
                  
                  <div className="flex md:ml-4">
                    {array.map((item, index) => (
                      <div
                        id={item}
                        key={index}
                        ref={divRefs.current[index]}
                        className="border border-black rounded-sm flex justify-center md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 flex-shrink-0 overflow-hidden whitespace-nowrap animate-fadeIn"
                        // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                        style={{
                          color: operationIdxVisibility ? ((index == customIdx) ? 'red' : 'black') : 'black',
                          backgroundColor: operationIdxVisibility ? ((index == customIdx) ? 'white' : '#6ee7b7') : '#6ee7b7',
                          animationDelay: `${index * 0.2}s`, // Stagger the delay by 0.2s per item
                          animationFillMode: 'both' // Ensures the element stays visible after the animation ends 
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex md:ml-4">
                    {array.map((item, index) => (
                      <div
                        key={index}
                        ref={divRefs.current[index]}
                        className="flex items-center font-bold text-red-800 justify-center flex-shrink-0 lg:w-14 md:12 w-10"
                      >
                        <div style={{ visibility: operationEleVisibility ? ((index == customIdx) ? 'visible' : 'hidden') : 'hidden'
                        }}>
                          {/* <p>New Element</p> */}
                          {element}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='p-1 text-white md:font-bold text-xs md:text-base bg-teal-700 rounded-r-md'>
                    <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
                </div>
            </div>
            <div className='flex flex-wrap justify-between'>
                <button
                onClick={deleteByIdx}
                className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                >
                  Delete by index
                </button>
                <button
                  onClick={deleteByEle}
                  className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                >
                  Delete by element
                </button>
                <button
                  onClick={removeArray}
                  className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                >
                  Delete array
                </button>
            </div>
            
          </div>
          <div className=' w-full md:w-28p bg-black md:m-4 md:mr-0 md:ml-2p'>
            <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
                <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
            </div>
          </div>
        </div>
      </details>
      <TopicCard topicName="Real-life Use(Static Array)" />
      
    </div>
  );
};

export default StaticArrayOperations;
