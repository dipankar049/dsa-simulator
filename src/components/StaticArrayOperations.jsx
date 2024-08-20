// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const StaticArrayOperations = () => {
  const [array, setArray] = useState([]);
  const [element, setElement] = useState('');
  const [arrayLength, setArrayLength] = useState(0);
  const [customIdx, setCustomIdx] = useState(0);
  const [arrExist, setArrExist] = useState(false);

  const divRefs = useRef([]);

  const [divs, setDivs] = useState([]);

useEffect(() => {
    const newDivs = [];
    for (let i = 0; i < arrayLength; i++) {
      newDivs.push(
        <div
          key={i}
          className="text-green-800 flex items-center justify-center md:px-4 px-6 w-14"
          // style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
        >
          {i}
        </div>
      );
    }
    setDivs(newDivs); // Update the state with new divs
},[array]);
  

  const createArray = () => {
    if(!arrayLength) {
      return;
    }
      setArray(Array(arrayLength).fill('NULL'));
      setArrExist(true);
  }; 

    function arrayInsert() {
      if(!arrExist) {
        return;
      };
        if(customIdx > arrayLength) {
            console.log("array full, can't insert");
            return;
        }
        if(element) {
            setArray(prevArray => 
                prevArray.map((item, i) => (i === customIdx ? element : item))
            );
        }
        setElement('');
    }

  function deleteByIdx() {
    if(customIdx > arrayLength || customIdx < 0) {
        console.log("Invalid index");
        return;
    }

    setArray(prevArray => 
        prevArray.map((item, i) => (i === customIdx ? 'NULL' : item))
    );
  }

  function deleteByEle() {

    if(element) {
      setArray(prevArray => 
        prevArray.map((item, i) => (item == element ? 'NULL' : item))
      );
    }
    setElement('');
    
  }

  const removeArray = () => {
    setArray([]);
    setArrayLength(0);
    setArrExist(false);
  }

  return (
    <div className="md:flex bg-green-100 h-fit w-full p-2p">
      <div className='md:w-70p w-full mb-2'>
        <h1 className="text-xl font-bold mb-4">Static Array Operations</h1>
        
        <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
          <div className='mr-2'>
            <input
              type="number"
            //   value={element}
              onChange={(e) => setArrayLength(parseInt(e.target.value))}
              className="border border-gray-300 md:p-2 p-1 h-fit w-44p rounded-l-md"
              placeholder="Enter length"
            />
            <button
              onClick={createArray}
              className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
            >
              Create array
            </button>
          </div>
          <div className='flex flex-wrap justify-end'>
            <input
              type="number"
              value={element}
              onChange={(e) => setElement(e.target.value)}
              className="border border-gray-300 md:p-2 p-1 h-fit w-36p rounded-l-md"
              placeholder="Enter element"
            />
            <input
              type="number"
            //   value={element}
              onChange={(e) => setCustomIdx(parseInt(e.target.value))}
              className="border border-gray-300 md:p-2 p-1 h-fit w-36p"
              placeholder="Enter index"
            />
            <button
              onClick={arrayInsert}
              className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
            >
              Insert
            </button>
          </div> 
          
        </div>
        <div className='flex m-2 mx-0 mb-6 border border-gray-300'>
          <div className='w-full p-2'>
            <div className="flex ml-8">
              {divs}
            </div>
            <div className="flex flex-wrap">
            <p className='m-1 font-bold'>{arrExist ? 'Arr': ''}</p>
              {array.map((item, index) => (
                <div
                  id={item}
                  key={index}
                  ref={divRefs.current[index]}
                  className="border border-black flex justify-center md:px-4 px-1 md:py-2 py-1 w-14 mt-1 overflow-hidden whitespace-nowrap"
                  // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className='p-1 text-white md:font-bold text-xs md:text-base bg-gray-800'>
              <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
          </div>
        </div>
        <div className='flex flex-wrap justify-between'>
            <button
            onClick={deleteByIdx}
            className="bg-blue-500 text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md"
            >
              delete by index
            </button>
            <button
              onClick={deleteByEle}
              className="bg-blue-500 text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md"
            >
              delete by element
            </button>
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

export default StaticArrayOperations;
