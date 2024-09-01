import React from 'react'
import { useState, useRef, useEffect } from 'react';
// import './styles/DSA_styles.css';

export default function DynamicArrayOperations() {
    const [array, setArray] = useState([]);
    const [element, setElement] = useState('');
    const [arrayLength, setArrayLength] = useState('');
    const [arrExist, setArrExist] = useState(false);
    const [customIdx, setCustomIdx] = useState('');
  
    const divRefs = useRef([]);
  
    const [divs, setDivs] = useState([]);
  useEffect(() => {
      const newDivs = [];
      for (let i = 0; i < array.length; i++) {
        newDivs.push(
          <div
            key={i}
            className="flex items-center justify-center flex-shrink-0 lg:w-14 md:12 w-10"
            // style={{ paddingLeft: `${idxSpace[i]}px`, paddingRight: `${idxSpace[i]}px` }}
          >
            {i}
          </div>
        );
      }
      setDivs(newDivs); // Update the state with new divs
  },[array]);
    
  
    const createArray = () => {
        setArray(Array(arrayLength).fill('NULL'));
        setArrExist(true);
        setArrayLength('');
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
                      newArray = [...newArray, 'NULL']; // Add 'Null' to newArray
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
      <div className="md:flex bg-green-100 h-fit w-full p-2p md:text-base sm:text-sm text-xs">
        <div className='md:w-70p w-full mb-2'>
          <h1 className="text-xl font-bold mb-4">Dynamic array oprations</h1>
          <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
            <div className='mr-2'>
              <input
                type="number"
              //   value={element}
                onChange={(e) => setArrayLength(parseInt(e.target.value))}
                className="border border-gray-300 md:p-2 p-1 h-fit w-44p rounded-l-md"
                placeholder="Length"
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
              <button
                onClick={arrayPushOperation}
                className="bg-blue-500 text-white md:p-2 p-1 h-fit transition ease-in delay-150 hover:-translate-y-1 hover:scale-102"
              >
                Push
              </button>
              <button
                onClick={() => {arrayPopOperation()}}
                className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
              >
                Pop
              </button>
            </div>  
          </div>
          <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 rounded-md'>
            <div className='w-full p-2 overflow-x-auto'>
            <p className='m-2 font-bold'>{arrExist ? 'Arr': ''}</p>
              <div className="flex md:ml-4">
                {divs}
              </div>
              <div className="flex md:ml-4">
                
                {array.map((item, index) => (
                  <div
                    id={item}
                    key={index}
                    ref={divRefs.current[index]}
                    className="border border-black bg-green-300 flex justify-center md:w-12 lg:w-14 w-10 flex-shrink-0 md:px-2 px-1 py-1 mt-1 overflow-hidden whitespace-nowrap animate-fadeIn"
                    // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                    style={{
                      animationDelay: `${index * 0.2}s`, // Stagger the delay by 0.2s per item
                      animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className='p-1 text-white md:font-bold text-xs md:text-base bg-gray-800 rounded-r-md'>
              <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
            </div>
          </div>
          <div className='flex flex-wrap justify-between'>
            <div>
              <input
                type="number"
                value={customIdx}
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
              <button
              onClick={removeItemAtIndex}
                className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102"
              >
              delete by index
            </button>
            <button
              onClick={removeByEle}
              className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-md" 
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
}
