import React from 'react'
import { useState, useRef, useEffect } from 'react';

export default function DynamicArrayOperations() {
    const [array, setArray] = useState([]);
    const [element, setElement] = useState('');
    const [arrayLength, setArrayLength] = useState(0);
    const [arrExist, setArrExist] = useState(false);
    const [customIdx, setCustomIdx] = useState('');
  let idxSpace = [];
  
    const divRefs = useRef([]);
  
    const [divs, setDivs] = useState([]);
  
    useEffect(() => {
      for(let i = 0; i < array.length; i++) { 
          idxSpace[i] = array[i] ? array[i].toString().length * 7.7 : 11.7;
      }
    },[array]);
  
  
  useEffect(() => {
      const newDivs = [];
      for (let i = 0; i < array.length; i++) {
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
        setArray(Array(arrayLength).fill('Null'));
        setArrExist(true);
    };
  
    function arrayPushOperation() {
      if(!arrExist) {
        return;
      };
      if(element) {
          setArray([...array, element]);
      }
      setElement('');
      // setCustomIdx(-1);
    };
  
    function arrayInsert() {
      if(!arrExist) {
        return;
      };
      if(element) {
          if(customIdx > array.length) {
              let temp = customIdx - array.length + 1;
              let newArray = [...array];
              while (temp > 0) {
                  if (temp === 1) {
                      newArray = [...newArray, element]; // Add element to newArray
                      temp--;
                  } else {
                      newArray = [...newArray, 'Null']; // Add 'Null' to newArray
                      temp--;
                  }
              }
              setArray(newArray);

              // return;
          } else {
            setArray(prevArray => 
            
              prevArray.map((item, i) => (i === customIdx ? element : item))
            );
          }
          setElement('');
          // setCustomIdx(-1);
        }
    }

    function arrayPopOperation() {
      //   console.log(idx);
        if(array.length < 0) {
            // console.log("empty array, can't delete");
            return;
        }
        setArray(array.slice(0, -1));
    }
  
      const removeItemAtIndex = () => {
        setArray(array.filter((_, i) => i !== customIdx));
      };

      const removeByEle = () => {
        setArray(array.filter(item => item !== element));
      };

      const removeArray = () => {
        setArray([]);
        setArrExist(false);
      }
  
  
    return (
      <div className="flex bg-green-100 p-6 h-50p w-full">
        <div className='w-70p'>
          <h1 className="text-xl font-bold mb-4">Dynamic array oprations</h1>
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
              <button
                onClick={arrayPushOperation}
                className="bg-blue-500 text-white px-3 py-1 h-10 w-30"
              >
                Push
              </button>
              <button
                onClick={() => {arrayPopOperation()}}
                className="bg-blue-500 text-white px-3 py-1 h-10 w-30 rounded-r-md"
              >
                Pop
              </button>
            </div>  
          
          </div>
          <div className='h-40p m-2 ml-0 mb-6 p-1 border border-gray-300'>
            <div className="flex ">
              <p>{arrExist ? 'arr': ''}</p>
              {divs}
            </div>
            <div className="flex flex-wrap">
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
            <div>
              <input
                type="number"
                value={customIdx}
                onChange={(e) => setCustomIdx(parseInt(e.target.value))}
                className="border border-gray-300 px-2 py-1 h-10 w-50p"
                placeholder="Enter index"
              />
              <button
                onClick={arrayInsert}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
              >
                Insert
              </button>
            </div>
              <button
              onClick={removeItemAtIndex}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
              >
            
              delete by index
            </button>
            <button
              onClick={removeByEle}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md" 
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
        <div className='h-full w-30p bg-black m-4 mr-0 ml-10'>

        </div>
      </div>
    );
}
