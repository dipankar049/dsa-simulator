import React from 'react'
import { useState, useRef, useEffect } from 'react';
// import './styles/DSA_styles.css';

export default function DynamicArrayOperations() {
  const [array, setArray] = useState([15, 22, 12, 56, 24]);
  const [element, setElement] = useState('');
  const [arrayLength, setArrayLength] = useState(0);
  const [arrExist, setArrExist] = useState(true);
  const [customIdx, setCustomIdx] = useState(''); 
  const [oldArray, setOldArray] = useState(false);

  // const [emptyLength, setEmptyLength] = useState(false);
  const [emptyElement, setEmptyElement] = useState(false);
  const [emptyInex, setEmptyIndex] = useState(false);

  const divRefs = useRef([]);

  const [divs, setDivs] = useState([]);
  const[operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const[operationEleVisibility, setOperationEleVisibility] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // useEffect(() => {
  //   setEmptyLength(false);
  // },[arrayLength]);

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
          className="flex text-cyan-800 items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10"
          // style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
        >
          {i}
        </div>
      );
    }
    setDivs(newDivs); // Update the state with new divs
  },[array]);
  

  const createArray = async() => {

    let  length = arrayLength;
    
    if(length === '') {
      // setArrayLength(0);
      length = 0;
      console.log('length',arrayLength);
    }
    await delay(200);
    console.log('length',arrayLength);
    setOldArray(false);
    setArray([]);
    setArrExist(false);
    await delay(500);
    setArray(Array(parseInt(length)).fill('NULL'));
    setArrExist(true);
    setArrayLength(0);
  };

  function arrayPushOperation() {
    if(!arrExist) {
      return;
    };

    if(element === '') {
      setEmptyElement(true);
      return;
    }
    setEmptyElement(false);
    setOldArray(true);

    if(element) {
        setArray([...array, element]);
    }
    setElement('');
    // setCustomIdx(-1);
  };

  const arrayInsert = async() => {
    if(!arrExist) {
      return;
    };

    if(element === '') {
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

    if(parseInt(customIdx) < 0) {
      console.log("Invalid index");
      return;
    }
    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setOperationEleVisibility(true);
    await delay(1000);
    if(element) {
      if(parseInt(customIdx) >= array.length) {
          let temp = parseInt(customIdx) - array.length + 1;
          let newArray = [...array];
          while (temp > 0) {
              if (temp === 1) {
                  newArray = [...newArray, element]; // Add element to newArray
                  temp--;
              } else {
                  newArray = [...newArray, 'NULL']; // Add 'Null' to newArray
                  temp--;
              }
          }
          setArray(newArray);

          // return;
      } else {
        setArray(prevArray => 
        
          prevArray.map((item, i) => (i === parseInt(customIdx) ? element : item))
        );
      }
    }
    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);
    setElement('');
    setCustomIdx('');
  }

  function arrayPopOperation() {
    //   console.log(idx);
      if(array.length <= 0) {
          console.log("empty array, can't delete");
          return;
      }
      setArray(array.slice(0, -1));
  }

  const removeItemAtIndex = async() => {

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
    setArray(array.filter((_, i) => i !== parseInt(customIdx)));
    setOperationIdxVisibility(false);
    setCustomIdx('');
  };

  const removeByEle = () => {

    if(element === '') {
      setEmptyElement(true);
      return;
    }
    setEmptyElement(false);

    setArray(array.filter(item => item !== element));
    setElement('');
  };

  const removeArray = () => {
    setOldArray(false);
    setArray([]);
    setArrExist(false);
  }
  
    return (
      <div className="md:flex bg-gradient-to-r from-cyan-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
        <div className='md:w-70p w-full mb-2'>
          <h1 className="text-xl font-bold mb-4">Dynamic array oprations</h1>
          <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
            <div className='mr-2'>
              <input
                type="number"
                // value={element}
                onChange={(e) => setArrayLength(e.target.value)}
                className="border border-gray-300 md:p-2 p-1 h-fit w-44p rounded-l-md shadow-inner"
                // style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                placeholder="Length"
              />
              <button
                onClick={createArray}
                className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
              >
                Create New array
              </button>
            </div>
            <div className='flex flex-wrap justify-end'>
              <input
                type="number"
                value={element}
                onChange={(e) => setElement(e.target.value)}
                className="md:p-2 p-1 h-fit w-36p rounded-l-md shadow-inner"
                style={{border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                placeholder="Enter element"
              />
              <button
                onClick={arrayPushOperation}
                className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit transition ease-in delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
              >
                Push
              </button>
              <button
                onClick={() => {arrayPopOperation()}}
                className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
              >
                Pop
              </button>
            </div>  
          </div>
          <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md shadow-xl'>
            <div className='w-full p-2 overflow-x-auto'>
            <p className='m-2 font-bold text-cyan-800'>{arrExist ? 'Arr': ''}</p>
              <div className="flex md:ml-4">
                {divs}
              </div>
              <div className="flex md:ml-4">
                {array.map((item, index) => (
                  <div
                    id={item}
                    key={index}
                    ref={divRefs.current[index]}
                    className="border border-black flex justify-center md:w-12 lg:w-14 w-10 flex-shrink-0 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn rounded-sm"
                    // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                    style={{
                      color: operationIdxVisibility ? ((index == customIdx) ? 'red' : 'black') : 'black',
                      backgroundColor: operationIdxVisibility ? ((index == customIdx) ? 'white' : '#22d3ee') : '#22d3ee',
                      animationDelay: `${(oldArray ? '0.2' : `${index * 0.2}`)}s`, // Stagger the delay by 0.2s per item
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
            <div className='p-1 text-white md:font-bold text-xs md:text-base bg-cyan-900 rounded-r-md'>
              <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
            </div>
          </div>
          <div className='flex flex-wrap justify-between'>
            <div>
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
                className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
              >
                Insert
              </button>
            </div>
              <button
              onClick={removeItemAtIndex}
                className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
              >
              delete by index
            </button>
            <button
              onClick={removeByEle}
              className="bg-cyan-700 hover:bg-cyan-800 lg:font-bold text-white md:p-2 p-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl" 
            >
              delete by element
            </button>
            <button
              onClick={removeArray}
              className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
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
}
