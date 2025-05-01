import React, { useState, useRef, useImperativeHandle, useContext, forwardRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IndexDivs from './IndexDivs';

const ArrayComponent = forwardRef(({ newArray, arrayInputs }, ref) => {
  const [array, setArray] = useState(newArray || [15, 22, 12, 56, 24]);   // Default array elements

  useImperativeHandle(ref, () => ({
    createArray,
    arrayInsert,
    deleteByIdx,
    deleteByEle,
    removeArray,
  }));

  const divRefs = useRef([]);
  const indexdivs = IndexDivs(array.length); // Get index divs for array as per array length

  const [operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const [operationEleVisibility, setOperationEleVisibility] = useState(false);

  const { theme } = useContext(ThemeContext);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //  Create new array
  const createArray = async () => {
    //  validation of input value of array length
    if (arrayInputs.arrayLength === '' || parseInt(arrayInputs.arrayLength) <= 0) {
      toast.error("Array length must be greater than 0.");
      return;
    }

    setArray([]);
    await delay(500);
    setArray(Array(parseInt(arrayInputs.arrayLength)).fill('NULL'));  //  Fill array with NULL as default
    toast.success("Array created successfully", {
      position: 'top-center'
    });
  };

  const isArrayExist = () => {
    if (array.length === 0) {  // check if array exist
      toast.error("Please create an array first.");
      return false;
    };
    return true;
  }

  //  Insert element in array
  const arrayInsert = async () => {
    if (!isArrayExist()) return;

    //  Validation of user given element and index value
    if (arrayInputs.element === '' && arrayInputs.customIdx === '') {
      toast.error("Please enter both element and index.");
      return;
    }

    if (arrayInputs.element === '') {
      toast.error("Please enter an element.");
      return;
    }

    if (arrayInputs.customIdx === '') {
      toast.error("Please enter an index.");
      return;
    }

    // Check if user given index is Out of Bounds
    if (parseInt(arrayInputs.customIdx) >= array.length || parseInt(arrayInputs.customIdx) < 0) {
      toast.error(`Index must be between 0 and ${array.length - 1}.`);
      return;
    }
    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setOperationEleVisibility(true);
    await delay(1000);

    // Insert element in array
    if (arrayInputs.element) {
      setArray(prevArray =>
        prevArray.map((item, i) => (i === parseInt(arrayInputs.customIdx) ? Number(arrayInputs.element) : item))
      );
    }
    toast.success(`"${arrayInputs.element}" inserted at index ${arrayInputs.customIdx}!`);
    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);
  };

  //  Delete an element by index value
  const deleteByIdx = async () => {
    if (!isArrayExist()) return;

    //   Validation of user given index value
    if (arrayInputs.customIdx === '') {
      toast.error("Please enter an index.");
      return;
    }
    if (parseInt(arrayInputs.customIdx) >= array.length || parseInt(arrayInputs.customIdx) < 0) {
      toast.error(`Please enter an index between 0 and ${array.length - 1}.`);
      return;
    }

    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);

    // Set the element at the specified index to 'NULL'
    setArray(prevArray =>
      prevArray.map((item, i) => (i === parseInt(arrayInputs.customIdx) ? 'NULL' : item))
    );
    toast.success(`Element deleted from index ${arrayInputs.customIdx}`);
    setOperationIdxVisibility(false);
  };

  //  Delete element by value
  const deleteByEle = async () => {
    if (!isArrayExist()) return;

    if (arrayInputs.element === '') {
      toast.error("Please enter an element.");
      return;
    }

    if (!array.includes(Number(arrayInputs.element))) {
      toast.error("Element not found.");
      return; // Return the array unchanged
    }

    // Replace the matching element with 'NULL' in the array
    setArray(prevArray => {
      return prevArray.map((item) => (item === Number(arrayInputs.element) ? 'NULL' : item));
    });
    toast.success("Element deleted.");
  };

  //  Delete array
  const removeArray = () => {
    if (!isArrayExist()) return;

    setArray([]);
    toast.success("Array has been successfully deleted.");
  };

  return (

    <div className=''>
      <div className='flex m-2 mx-0 mb-6 bg-white dark:bg-gray-300 dark:text-white border border-gray-300 shadow-xl rounded-md'>
        <div className='w-full p-2 overflow-x-auto'>
          {(array.length != 0) && <p className='md:m-2 font-bold text-teal-800 dark:text-black'>Array</p>}
          <div className="flex md:ml-4">
            {indexdivs}
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
                  color: operationIdxVisibility ? ((index === parseInt(arrayInputs.customIdx)) ? 'red' : 'black') : 'black',
                  backgroundColor: operationIdxVisibility ? ((index === parseInt(arrayInputs.customIdx)) ? 'white' : '#6ee7b7') : '#6ee7b7',
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
                <div style={{
                  visibility: operationEleVisibility ? ((index === parseInt(arrayInputs.customIdx)) ? 'visible' : 'hidden') : 'hidden'
                }}>
                  {/* <p>New Element</p> */}
                  {arrayInputs.element}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='p-1 text-white md:font-bold text-xs md:text-base bg-teal-700 rounded-r-md'>
          <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
        </div>
      </div>
      <div className=' w-full md:w-28p bg-black md:m-4 md:mr-0 md:ml-2p'>
        <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
          <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
        </div>
      </div>
    </div>
  );
});

export default ArrayComponent;