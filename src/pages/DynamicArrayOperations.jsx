import React, { useContext } from 'react'
import { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IndexDivs from '../components/IndexDivs';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';

export default function DynamicArrayOperations() {
  const [array, setArray] = useState([15, 22, 12, 56, 24]);   // Default array elements
  const [arrayInputs, setArrayInputs] = useState({    // To track inputs
    arrayLength: array.length || '',
    customIdx: '',
    element: ''
  });
  const [oldArray, setOldArray] = useState(false);
  const { theme } = useContext(ThemeContext);

  const divRefs = useRef([]);
  const indexDivs = IndexDivs(array.length);
  const [operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const [operationEleVisibility, setOperationEleVisibility] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //  Handle input field changes
  const handleChange = (e) => {
    setArrayInputs({
      ...arrayInputs,
      [e.target.name]: e.target.value
    })
  };

  //  Create new array
  const createArray = async () => {
    //  validation of input value of array length
    if (arrayInputs.arrayLength === '' || parseInt(arrayInputs.arrayLength) <= 0) {
      toast.error("Array length must be greater than 0.");
      return;
    }

    await delay(200);
    setOldArray(false);
    setArray([]);
    await delay(500);
    setArray(Array(parseInt(arrayInputs.arrayLength)).fill('NULL'));
    toast.success("Array created successfully", { position: 'top-center' });
  };

  const isArrayExist = () => {
    if (array.length === 0) {  // check if array exist
      toast.error("Please create an array first.");
      return false;
    };
    return true;
  }

  //   Push element to array
  function arrayPushOperation() {
    if (!isArrayExist()) return;

    if (arrayInputs.element === '') {
      toast.error("Please enter an element");
      return;
    }
    setOldArray(true);
    setArray([...array, Number(arrayInputs.element)]);
    toast.success("Element successfully pushed into the array.");
    setArrayInputs({ ...arrayInputs, element: '' });
  };

  //  Insert element to array
  const arrayInsert = async () => {
    if (!isArrayExist()) return;

    // Validation of element and index
    if (arrayInputs.element === '' && arrayInputs.customIdx === '') {
      toast.error("Please enter both element and index.");
      return;
    } else if (arrayInputs.element === '') {
      toast.error("Please enter an element.");
      return;
    } else if (arrayInputs.customIdx === '') {
      toast.error("Please enter an index.");
      return;
    }

    if (parseInt(arrayInputs.customIdx) > array.length || parseInt(arrayInputs.customIdx) < 0) {
      toast.error(`Index must be between 0 and ${array.length}.`);
      return;
    }

    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setOperationEleVisibility(true);
    await delay(1000);
    if (parseInt(arrayInputs.customIdx) === array.length) {
      let temp = parseInt(arrayInputs.customIdx) - array.length + 1;
      let newArray = [...array];
      while (temp > 0) {
        if (temp === 1) {
          newArray = [...newArray, Number(arrayInputs.element)]; // Add element to newArray
          temp--;
        } else {
          newArray = [...newArray, 'NULL']; // Add 'Null' to newArray
          temp--;
        }
      }
      setArray(newArray);
    } else {
      setArray(prevArray =>

        prevArray.map((item, i) => (i === parseInt(arrayInputs.customIdx) ? Number(arrayInputs.element) : item))
      );
    }
    toast.success(`"${arrayInputs.element}" inserted at index ${arrayInputs.customIdx}`);
    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);
    setArrayInputs({ ...arrayInputs, element: '' });
    setArrayInputs({ ...arrayInputs, customIdx: '' });
  }

  //  Pop element from array
  function arrayPopOperation() {
    if (!isArrayExist()) return;

    setArray(array.slice(0, -1));
    toast.success("Element popped from the array.");
  }

  //  Delete element from given index
  const removeItemAtIndex = async () => {
    if (!isArrayExist()) return;

    //  Validation of user given index
    if (arrayInputs.customIdx === '') {
      toast.error("Please enter an index");
      return;
    }
    if (parseInt(arrayInputs.customIdx) >= array.length || parseInt(arrayInputs.customIdx) < 0) {
      toast.error(`Index must be between 0 and ${array.length - 1}.`);
      return;
    }

    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setArray(array.filter((_, i) => i !== parseInt(arrayInputs.customIdx)));
    toast.success(`Element deleted from index ${arrayInputs.customIdx}`);
    setOperationIdxVisibility(false);
    setArrayInputs({ ...arrayInputs, customIdx: '' });
  };

  //  Remove user given element
  const removeByEle = () => {
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
    setArrayInputs({ ...arrayInputs, element: '' });
  };

  //  Delete array
  const removeArray = () => {
    if (!isArrayExist()) return;

    setOldArray(false);
    setArray([]);
    toast.success("Array has been successfully deleted.");
    setArrayInputs({
      ...arrayInputs,
      arrayLength: ''
    });
  }

  return (
    <div>
      <Helmet>
        <title>Static & Dynamic Array Operations Simulator | DSA Simulator</title>
        <meta name="description" content="Learn how fixed-size static arrays and auto-resizing dynamic arrays work. Explore memory overflow and array allocations visually." />
        <meta name="keywords" content="dynamic array simulator, dynamic array visualizer, array data structure tool, memory overflow simulation" />
      </Helmet>
      <TopicCard topicName="Dynamic Array" />
      <details className="opSection h-fit w-full p-4 mb-4" open>
        <summary className="sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-ink cursor-pointer">Dynamic array oprations</summary>
        <div className='md:flex pt-2'>
          <div className='w-full mb-2'>

            <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
              <div className='mr-2'>
                <input
                  name='arrayLength'
                  min={1}
                  type="number"
                  value={arrayInputs.arrayLength}
                  onChange={handleChange}
                  className="opInput w-44p rounded-l-md"
                  placeholder="Length"
                />
                <button
                  onClick={createArray}
                  className="opBtn btnAnimate rounded-r-md"
                >
                  Create New array
                </button>
              </div>
              <div className='flex flex-wrap justify-end'>
                <input
                  name='element'
                  type="number"
                  value={arrayInputs.element}
                  onChange={handleChange}
                  className="opInput w-36p rounded-l-md"

                  placeholder="Enter element"
                />
                <button
                  onClick={arrayPushOperation}
                  className="opBtn btnAnimate"
                >
                  Push
                </button>
                <button
                  onClick={() => { arrayPopOperation() }}
                  className="opBtn btnAnimate rounded-r-md"
                >
                  Pop
                </button>
              </div>
            </div>
            <div className='vizCard flex m-2 mx-0 mb-6'>
              <div className='w-full p-2 overflow-x-auto'>
                {(array.length != 0) && <p className='md:m-2 font-semibold text-accent'>Array</p>}
                <div
                  className={`grid grid-rows-3 w-fit`}
                  style={{ gridTemplateColumns: `repeat(${array.length || 1}, auto)` }}
                >

                  {/* ------------------------------- index divs ------------------------------- */}
                  {array.map((ele, index) =>
                    <div key={index} className='arrayDiv'>{index}</div>
                  )}

                  {/* ------------------------------- array element divs ------------------------------- */}
                  {array.map((item, index) => (
                    <div
                      id={item}
                      key={index}
                      ref={divRefs.current[index]}
                      className="cell arrayDiv animate-fadeIn"
                      style={{
                        color: operationIdxVisibility && index === parseInt(arrayInputs.customIdx)
                          ? '#fff'
                          : 'rgb(var(--color-text-primary))',
                        backgroundColor: operationIdxVisibility && index === parseInt(arrayInputs.customIdx)
                          ? 'rgb(var(--color-frontier))'
                          : 'rgb(var(--color-element))',
                        animationDelay: `${index * 0.2}s`, // Stagger the delay by 0.2s per item
                      }}
                    >{item}</div>
                  ))}

                  {/* ------------------------------- operation divs ------------------------------- */}
                  {array.map((item, index) => (
                    <div
                      key={index}
                      ref={divRefs.current[index]}
                      className="arrayDiv font-bold text-accent"
                    >
                      <div style={{ display: operationEleVisibility ? 'block' : 'none' }}>
                        {index === parseInt(arrayInputs.customIdx) && arrayInputs.element}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='visualTag'>
                <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
              </div>
            </div>
            <div className='flex flex-wrap justify-between gap-y-1'>
              <div>
                <input
                  name='customIdx'
                  type="number"
                  min={0}
                  value={arrayInputs.customIdx}
                  onChange={handleChange}
                  className="opInput w-36p"

                  placeholder="Enter index"
                />
                <button
                  onClick={arrayInsert}
                  className="opBtn btnAnimate rounded-r-md"
                >
                  Insert
                </button>
              </div>
              <button
                onClick={removeItemAtIndex}
                className="opBtn btnAnimate rounded-md"
              >
                delete by index
              </button>
              <button
                onClick={removeByEle}
                className="opBtn btnAnimate rounded-md"
              >
                delete by element
              </button>
              <button
                onClick={removeArray}
                className="opBtn-danger btnAnimate"
              >
                delete array
              </button>
            </div>
          </div>
        </div>
      </details>
      <TopicCard topicName="Real-Life Use(Dynamic Array)" />
    </div>
  );
}