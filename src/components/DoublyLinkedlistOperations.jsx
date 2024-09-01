import React from 'react'
import { useState, useRef, useEffect } from 'react';

export default function DoublyLinkedlistOperations() {
    const [array, setArray] = useState([]);
    const [element, setElement] = useState('');
    const [arrayLength, setArrayLength] = useState(0);
    const [arrExist, setArrExist] = useState(false);
    const [customIdx, setCustomIdx] = useState('');
  
    const divRefs = useRef([]);
  
    const createList = () => {
        setArray(Array(arrayLength).fill('Null'));
        setArrExist(true);
    };
  
    function listAppend() {
      if(!arrExist) {
        return;
      };
      if(element) {
          setArray([...array, element]);
        }
      setElement('');
    };
  
    function arrayInsert() {
      if(!arrExist) {
        return;
      };
      if(element) {
          if(customIdx > array.length) {
            return;
          } else {
            setArray(prevArray => {
                // Create a new array with the element inserted at the specified index
                const newArray = [
                  ...prevArray.slice(0, customIdx), // Elements before the index
                  element,                    // New element
                  ...prevArray.slice(customIdx)      // Elements from the index onward
                ];
                return newArray;
              });
          }
          setElement('');
        }
    }

    function removeFromBeg() {
      //   console.log(idx);
        if(array.length < 0) {
            // console.log("empty array, can't delete");
            return;
        }
        setArray(array.slice(0, -1));
    }
  
      const removeItemAtIndex = () => {
        setArray(prevArray => [
            ...prevArray.slice(0, customIdx), // Elements before the index
            ...prevArray.slice(customIdx + 1)  // Elements after the index
        ]);
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
          <h1 className="text-xl font-bold mb-4">Doubly Linkedlist oprations</h1>
          <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
            <div className='mr-2'>
              <button
                onClick={createList}
                className="bg-blue-500 text-white rounded-r-md md:p-2 p-1"
              >
                Create Linkedlist
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
                onClick={listAppend}
                className="bg-blue-500 text-white md:p-2 p-1 h-fit"
              >
                Insert at end
              </button>
              <button
                onClick={removeFromBeg}
                className="bg-blue-500 text-white md:p-2 p-1 h-fit rounded-r-md"
              >
                delete from end
              </button>
            </div>  
          
          </div>
          <div className='flex m-2 mx-0 mb-6 bg-white border border-gray-300 roumded-md md:text-base sm:text-sm text-xs'>
          <div className='w-full p-2 overflow-x-auto'>
            <p className='m-2 font-bold'>{arrExist ? 'Linkedlist': ''}</p>
            <div className="flex xl:ml-2">
              {array.map((item, index) => (
                <>
                <div
                  id={item}
                  key={index}
                  ref={divRefs.current[index]}
                  className="flex justify-center border border-black bg-green-300 flex-shrink-0 md:px-4 p-2 md:py-2 py-1 mt-2"
                //   style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
                >
                  {item}
                </div>
                <div>
                  <div className='flex'>
                    <p className='mt-1'>──➤</p>
                  </div>
                  <div className='flex'>
                    <p>⮜──</p>
                  </div>
                </div>
                <p className='mt-3 md:mt-4 ml-1'>{index == array.length-1 ? 'Null': ''}</p>
                </>
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
                className="border border-gray-300 md:p-2 p-1 md:m-0 my-1 h-fit w-48p"
                placeholder="Enter index"
              />
              <button
                onClick={arrayInsert}
                className="bg-blue-500 text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-r-md"
              >
                Insert
              </button>
            </div>
              <button
              onClick={removeItemAtIndex}
                className="bg-blue-500 text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md"
              >
              delete by index
            </button>
            <button
              onClick={removeByEle}
              className="bg-blue-500 text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md" 
            >
              delete by element
            </button>
            <button
              onClick={removeArray}
              className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 xl:m-0 mt-1 h-fit rounded-md"
            >
              delete Linkedlist
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
