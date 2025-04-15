import React from 'react'
import { useState, useRef, useEffect } from 'react';
import TopicCard from './TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DynamicArrayOperations() {
  const [array, setArray] = useState([15, 22, 12, 56, 24]);   // Default array elements
  const [arrayInputs, setArrayInputs] = useState({    // To track inputs
    arrayLength: array.length || '',
    customIdx: '',
    element: ''
  });
  const [oldArray, setOldArray] = useState(false);

  const divRefs = useRef([]);

  const [divs, setDivs] = useState([]);
  const[operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const[operationEleVisibility, setOperationEleVisibility] = useState(false);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //  To create index div dynamically that will be visible with array as index number
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
  
  //  Handle input field changes
  const handleChange = (e) => {
    setArrayInputs({
      ...arrayInputs,
      [e.target.name] : e.target.value
    })
  };

  //  Create new array
  const createArray = async() => {
    //  validation of input value of array length
    if(arrayInputs.arrayLength === '' || arrayInputs.arrayLength <= 0) { 
      toast.error("Enter Valid Length!");
      return;
    }

    await delay(200);
    setOldArray(false);
    setArray([]);
    await delay(500);
    setArray(Array(parseInt(arrayInputs.arrayLength)).fill('NULL'));
  };

  //   Push element to array
  function arrayPushOperation() {
    if(array.length == 0) {  // check if array exist
      toast.error("First create an Array");
      return;
    };

    if(arrayInputs.element === '') {
      toast.error("Please enter an element");
      return;
    }
    setOldArray(true);

    if(arrayInputs.element) {
        setArray([...array, arrayInputs.element]);
    }
    setArrayInputs({...arrayInputs, element: ''});
  };

  //  Insert element to array
  const arrayInsert = async() => {
    if(array.length == 0) {  // check if array exist
      toast.error("First create an Array");
      return;
    };

    // Validation of element and index
    if(arrayInputs.element === '') {
      toast.error('Please enter an element');
      if(arrayInputs.customIdx === '') {
        toast.error('Please enter index');
      }
      return;
    }
    if(arrayInputs.customIdx === '') {
      toast.error('Please enter index');
      return;
    }
    if(parseInt(arrayInputs.customIdx) < 0) {
      toast.error("Invalid index");
      return;
    }

    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setOperationEleVisibility(true);
    await delay(1000);
    if(arrayInputs.element) {
      if(parseInt(arrayInputs.customIdx) >= array.length) {
          let temp = parseInt(arrayInputs.customIdx) - array.length + 1;
          let newArray = [...array];
          while (temp > 0) {
              if (temp === 1) {
                  newArray = [...newArray, arrayInputs.element]; // Add element to newArray
                  temp--;
              } else {
                  newArray = [...newArray, 'NULL']; // Add 'Null' to newArray
                  temp--;
              }
          }
          setArray(newArray);
      } else {
        setArray(prevArray => 
        
          prevArray.map((item, i) => (i === parseInt(arrayInputs.customIdx) ? arrayInputs.element : item))
        );
      }
    }
    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);
    setArrayInputs({...arrayInputs, element: ''});
    setArrayInputs({...arrayInputs, customIdx: ''});
  }

  //  Pop element from array
  function arrayPopOperation() {
      if(array.length <= 0) {
          console.log("empty array, can't delete");
          return;
      }
      setArray(array.slice(0, -1));
  }

  //  Delete element from given index
  const removeItemAtIndex = async() => {
    //  Validation of user given index
    if(arrayInputs.customIdx === '') {
      toast.error("Please enter index");
      return;
    }
    if(parseInt(arrayInputs.customIdx) >= array.length || parseInt(arrayInputs.customIdx) < 0) {
      toast.error("Invalid index");
      return;
    }

    await delay(500);
    setOperationIdxVisibility(true);
    await delay(1000);
    setArray(array.filter((_, i) => i !== parseInt(arrayInputs.customIdx)));
    setOperationIdxVisibility(false);
    setArrayInputs({...arrayInputs, customIdx: ''});
  };

  //  Remove user given element
  const removeByEle = () => {
    if(arrayInputs.element === '') {
      toast.error("Please enter element");
      return;
    }

    setArray(array.filter(item => item !== arrayInputs.element));
    setArrayInputs({...arrayInputs, element: ''});
  };

  //  Delete array
  const removeArray = () => {
    setOldArray(false);
    setArray([]);
  }
  
  return (
    <div className='p-2p'>
      <TopicCard topicName="Dynamic Array" />
      <details className="bg-gradient-to-r from-cyan-200 h-fit w-full p-2p md:text-base sm:text-sm text-xs" open>
        <summary className="text-xl font-bold mb-4">Dynamic array oprations</summary>
          <div className='md:flex'>
          <div className='md:w-70p w-full mb-2'>
            
            <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
              <div className='mr-2'>
                <input
                  name='arrayLength'
                  min={1}
                  type="number"
                  value={arrayInputs.arrayLength}
                  onChange={handleChange}
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
                  name='element'
                  type="number"
                  value={arrayInputs.element}
                  onChange={handleChange}
                  className="md:p-2 p-1 h-fit w-36p rounded-l-md shadow-inner"
                  style={{border: '1px solid #d1d5db' }}
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
              <p className='m-2 font-bold text-cyan-800'>{array.length != 0 ? 'Array': ''}</p>
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
                        color: operationIdxVisibility ? ((index == arrayInputs.customIdx) ? 'red' : 'black') : 'black',
                        backgroundColor: operationIdxVisibility ? ((index == arrayInputs.customIdx) ? 'white' : '#22d3ee') : '#22d3ee',
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
                      <div style={{ visibility: operationEleVisibility ? ((index == arrayInputs.customIdx) ? 'visible' : 'hidden') : 'hidden'
                      }}>
                        {/* <p>New Element</p> */}
                        {arrayInputs.element}
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
                  name='customIdx'
                  type="number"
                  min={0}
                  value={arrayInputs.customIdx}
                  onChange={handleChange}
                  className="md:p-2 p-1 h-fit w-36p shadow-inner"
                  style={{border: '1px solid #d1d5db' }}
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
      </details>
      <TopicCard topicName="Real-Life Use(Dynamic Array)" />
    </div>
  );
}
