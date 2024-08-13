// src/components/ArrayVisualizer.js

import React, { useState, useRef, useEffect } from 'react';

const StaticArrayOperations = () => {
  const [array, setArray] = useState([]);
  const [element, setElement] = useState('');
  const [arrayLength, setArrayLength] = useState(0);
  const [customIdx, setCustomIdx] = useState(0);
  const [arrExist, setArrExist] = useState(false);
  let idxSpace = [];

  const divRefs = useRef([]);

  const [divs, setDivs] = useState([]);

  useEffect(() => {
    console.log('woring');
    for(let i = 0; i < arrayLength; i++) { 
        idxSpace[i] = array[i] ? array[i].toString().length * 7.7 : 11.7;
    }
  },[array]);


useEffect(() => {
    const newDivs = [];
    for (let i = 0; i < arrayLength; i++) {
      newDivs.push(
        <div
          key={i}
          className="border border-gray-100 text-green-800 py-1 px-3"
          style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
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
    <div className="flex bg-green-100 p-6 h-50p w-full">
      <div className='w-70p'>
        <h1 className="text-xl font-bold m-2 mb-4">Static Array Operations</h1>
        
        <div className="flex justify-between mb-4 w-full">
          <div className='w-full'>
            <input
              type="number"
            //   value={element}
              onChange={(e) => setArrayLength(parseInt(e.target.value))}
              className="border border-gray-300 rounded-l-md px-2 py-1 h-10 w-50p"
              placeholder="Enter Array length"
            />
            <button
              onClick={createArray}
              className="bg-blue-500 text-white  rounded-r-md px-2 py-1 h-10 w-30"
            >
              Create array
            </button>
          </div>
          <div className='w-full'>
            <input
              type="number"
              value={element}
              onChange={(e) => setElement(e.target.value)}
              className="border border-gray-300 rounded-l-md px-2 py-1 h-10 w-30p"
              placeholder="Enter element"
            />
            <input
              type="number"
            //   value={element}
              onChange={(e) => setCustomIdx(parseInt(e.target.value))}
              className="border border-gray-300 px-2 py-1 h-10 w-30p"
              placeholder="Enter index"
            />
            <button
              onClick={arrayInsert}
              className="bg-blue-500 text-white px-3 py-1 h-10 w-30 rounded-r-md"
            >
              Insert
            </button>
          </div> 
          
        </div>
        <div className='h-40p m-2 ml-0 mb-6 p-1 border border-gray-300'>
          <div className="flex ">
            {divs}
            </div>
          <div className="flex flex-wrap">
          <p>{arrExist ? 'arr': ''}</p>
            {array.map((item, index) => (
              <div
                id={item}
                key={index}
                ref={divRefs.current[index]}
                className="border border-black h-10 text-green-800 px-4 py-2"
                // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-between'>
            <button
            onClick={deleteByIdx}
            className="bg-blue-500 text-white px-2 py-1 h-10 w-36 rounded-md"
            >
              delete by index
            </button>
            <button
              onClick={deleteByEle}
              className="bg-blue-500 text-white px-2 py-1 h-10 w-36 rounded-md"
            >
              delete by element
            </button>
            <button
              onClick={removeArray}
              className="border border-2 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white px-4 py-2 rounded-md"
            >
              delete array
            </button>
        </div>
        
      </div>
      <div className='h-full w-30p bg-black m-4 ml-10 mr-0'>

      </div>
    </div>
  );
};

export default StaticArrayOperations;
