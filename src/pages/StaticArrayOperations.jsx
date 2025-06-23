import React, { useState, useRef, useEffect, useContext } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import { ThemeContext } from '../context/ThemeContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IndexDivs from '../components/IndexDivs';

const StaticArrayOperations = () => {
  const [array, setArray] = useState([15, 22, 12, 56, 24]);   // Default array elements
  const [arrayInputs, setArrayInputs] = useState({    // To track inputs
    arrayLength: array.length || '',
    customIdx: '',
    element: ''
  });

  const divRefs = useRef([]);
  const indexdivs = IndexDivs(array.length); // Get index divs for array as per array length

  const [operationIdxVisibility, setOperationIdxVisibility] = useState(false);
  const [operationEleVisibility, setOperationEleVisibility] = useState(false);

  const { detailsState, updateState } = useContext(DetailsStateContext);

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen); // Update context and persist state
  };

  const { theme } = useContext(ThemeContext);

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
      // toast(
      //   <div>
      //     <p>No Array exist, create one</p>
      //     <button className='btn' onClick={createArray}>Create</button>
      //   </div>,
      //   {
      //     autoClose: false
      //   }
      // );

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
    setArrayInputs({ ...arrayInputs, element: '', customIdx: '' });
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
    setArrayInputs({ ...arrayInputs, customIdx: ''});
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
    setArrayInputs({ ...arrayInputs, element: '' });
  };

  //  Delete array
  const removeArray = () => {
    if (!isArrayExist()) return;

    setArray([]);
    toast.success("Array has been successfully deleted.");
    setArrayInputs({
      ...arrayInputs,
      arrayLength: ''
    });
  };

  return (
    // <div className='p-2p bg-white text-gray-700 
    //                 dark:bg-gray-700 dark:text-white 
    //                 md:text-base sm:text-sm text-xs'
    // >
    <div className='p-2p bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 
                    md:text-base sm:text-sm text-xs'
    >

      <TopicCard topicName="Array" /> {/* Defination and Example of array */}
      <TopicCard topicName="Static Array" />  {/* Defination and Example of static array */}
      <details
        className="bg-gradient-to-l from-teal-200 h-fit w-full p-4 dark:from-gray-500 rounded-lg"
        id='staticArrayOp'
        onToggle={(e) => { handleToggle('staticArrayOp', e.target.open) }}
        open={detailsState['staticArrayOp'] !== undefined ? detailsState['staticArrayOp'] : true}
      >
        <summary className="mb-4">Static Array Operations</summary>
        <div className=''>
          <div className='w-full mb-2'>
            <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
              <div className='mr-2'>
                <input
                  name='arrayLength'
                  type="number"
                  value={arrayInputs.arrayLength}
                  min={1}
                  onChange={handleChange}
                  className="opInput w-40p rounded-l-md"
                  // style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                  style={{ border: '1px solid #d1d5db' }}
                  placeholder="Length"
                />
                <button
                  onClick={createArray}
                  className="opBtn bg-teal-600 hover:bg-teal-700 rounded-r-md btnAnimate"
                >
                  Create New array
                </button>
              </div>
              <div className='flex flex-wrap justify-end text-black'>
                <input
                  name='element'
                  type="number"
                  value={arrayInputs.element}
                  onChange={handleChange}
                  className="opInput w-36p rounded-l-md"
                  // style={{border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                  style={{ border: '1px solid #d1d5db' }}
                  placeholder="Enter element"
                />
                <input
                  name='customIdx'
                  type="number"
                  min={0}
                  value={arrayInputs.customIdx}
                  onChange={handleChange}
                  className="opInput w-36p"
                  // style={{border: `${emptyInex ? '2px solid red' : '1px solid #d1d5db'}`}}
                  style={{ border: '1px solid #d1d5db' }}
                  placeholder="Enter index"
                />
                <button
                  onClick={arrayInsert}
                  className="opBtn bg-teal-600 hover:bg-teal-700 rounded-r-md btnAnimate"
                >
                  Insert
                </button>
              </div>

            </div>
            <div className='flex m-2 mx-0 mb-6 bg-white dark:bg-gray-300 dark:text-white border border-gray-300 shadow-xl rounded-md'>
              <div className='w-full p-2 overflow-x-auto'>
                {(array.length != 0) && <p className='md:m-2 font-bold text-teal-800 dark:text-black'>Array</p>}
                <div className="flex">
                  {indexdivs}
                </div>

                <div className="flex">
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
                        animationFillMode: 'both' // the element stays visible after the animation ends 
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
            <div className='flex flex-wrap justify-between'>
              <button
                onClick={deleteByIdx}
                className="opBtn bg-teal-600 hover:bg-teal-700 rounded-md btnAnimate"
              >
                Delete by index
              </button>
              <button
                onClick={deleteByEle}
                className="opBtn bg-teal-600 hover:bg-teal-700 rounded-md btnAnimate shadow-xl"
              >
                Delete by element
              </button>
              <button
                onClick={removeArray}
                className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md btnAnimate shadow-xl"
              >
                Delete array
              </button>
            </div>

          </div>
          {/* <div className=' w-full md:w-28p bg-black md:m-4 md:mr-0 md:ml-2p'>
            <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
              <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
            </div>
          </div> */}
        </div>
      </details>
      <TopicCard topicName="Real-life Use(Static Array)" /> {/* Real-life use and Example of static array */}
    </div>
  );
};

export default StaticArrayOperations;