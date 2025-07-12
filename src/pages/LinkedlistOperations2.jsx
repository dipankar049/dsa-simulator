import React, { useContext } from 'react'
import { useState, useRef, useEffect } from 'react';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../context/ThemeContext';

export default function SinglyLinkedList() {
  const [list, setList] = useState([23, 52, 76, 18]);
  const [element, setElement] = useState('');
  const [listExist, setListExist] = useState(true);
  const [customIdx, setCustomIdx] = useState('');

  const divRefs = useRef([]);
  const { theme } = useContext(ThemeContext);

  // Create new list
  const createList = () => {
    setList(Array(0).fill('Null'));
    setListExist(true);
    toast.success("New linked list created");
  };

  const isListExist = () => {
    if (!listExist) {
      toast.error("Please create a list first to append element");
    };
    return listExist;
  }

  // Append element in list
  function listAppend() {
    if (!isListExist()) return;

    if (element === '') {
      toast.error("Please enter an element");
      return;
    }

    setList([...list, Number(element)]);
    toast.success(`"${element}" successfully added at the end.`);
    setElement('');
  };

  function insertInListt() {
    if (!isListExist()) return;

    // if(list.length === 0) {
    //   toast.error("Linked List is empty");
    //   return;
    // }

    if (element === '') {
      toast.error("Please enter an element");
      return;
    }

    if (customIdx === '' || parseInt(customIdx) < 0 || parseInt(customIdx) > list.length) {
      console.log(customIdx === '');
      if (list.length == 0 && parseInt(customIdx) !== 0) {
        toast.error("Index must be 0 as linked list is empty");
        return;
      } else {
        toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
        return;
      }
    }

    setList(prevArray => {
      // Create a new list with the element inserted at the specified index
      const newArray = [
        ...prevArray.slice(0, customIdx), // Elements before the index
        Number(element),                    // New element
        ...prevArray.slice(customIdx)      // Elements from the index onward
      ];
      return newArray;
    });
    toast.success(`"${element}" inserted at index ${customIdx}`);
    setElement('');
    setCustomIdx('');
  }

  //  Remove element from emd
  function removeFromEnd() {
    if (!isListExist()) return;

    if (list.length == 0) {
      toast.error("List is already empty");
      return;
    }
    setList(list.slice(0, -1));
    toast.success("Last element removed.");
  };

  const removeItemAtIndex = () => {
    if (!isListExist()) return;

    if (list.length === 0) {
      toast.error("Linked List is empty");
      return;
    }

    if (customIdx === '' || customIdx < 0 || customIdx >= list.length) {
      toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
      return;
    }

    setList(prevArray => [
      ...prevArray.slice(0, customIdx), // Elements before the index
      ...prevArray.slice(customIdx + 1)  // Elements after the index
    ]);
    toast.success(`Element deleted from index ${customIdx}`);
    setCustomIdx('');
  };

  //  Remove user given element
  const removeByEle = () => {
    if (!isListExist()) return;

    if (element === '') {
      toast.error("Please enter an element");
      return;
    }

    const updatedList = list.filter(item => item !== Number(element));

    if (updatedList.length < list.length) {
      setList(updatedList);
      toast.success(`Element ${element} removed successfully.`);
    } else {
      toast.info(`Element ${element} not found in the list.`);
    }
  };

  const removeList = () => {
    if (!isListExist()) return;

    setList([]);
    setListExist(false);
    toast.success("List deleted successfuly");
  };

  return (
    <div>
      <TopicCard topicName="Singly Linked List" />
      <div className={`${theme === 'light' ? 'bg-gradient-to-tl from-sky-200' : 'bg-gray-800'} h-fit w-full p-4 rounded-lg`}>
        <div className='w-full mb-2'>
          <h1 className="sm:mb-2 text-base sm:text-lg md:text-xl font-bold">Singly Linkedlist oprations</h1>
          <div className="flex justify-between mb-4 pt-2 w-full sm:text-base text-sm">
            <div className='mr-2'>
              <button
                onClick={createList}
                className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate rounded-r-md"
              >
                Create New Linkedlist
              </button>
            </div>
            <div className='flex flex-wrap justify-end'>
              <input
                type="number"
                value={element}
                onChange={(e) => setElement(Number(e.target.value))}
                className="opInput w-36p rounded-l-md"
                placeholder="Enter element"
              />
              <button
                onClick={listAppend}
                className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate"
              >
                Insert at end
              </button>
              <button
                onClick={removeFromEnd}
                className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate rounded-r-md"
              >
                delete from end
              </button>
            </div>

          </div>
          <div className='flex m-2 mx-0 mb-6 bg-white dark:bg-gray-600 dark:text-white border border-gray-300 rounded-md shadow-xl'>
            <div className='w-full p-2 overflow-x-auto'>
              {listExist && (<p className='m-2 font-bold dark:text-green-300'>Linkedlist</p>)}
              <div className="flex xl:ml-2">
                {list.map((item, index) => (
                  <div key={index} className='flex'>
                    <div
                      id={item}
                      key={index}
                      ref={divRefs.current[index]}
                      className="flex justify-center rounded-l-sm text-black border border-black bg-green-300 flex-shrink-0 md:px-4 p-2 md:py-2 py-1 mt-2 animate-fadeIn"
                      style={{
                        animationDelay: '0.2s', // Stagger the delay by 0.2s per item
                        animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                      }}
                    >
                      {item}
                    </div>
                    <div 
                      className='flex justify-center rounded-r-sm text-black md:font-bold text-2xl border border-black bg-green-300 flex-shrink-0 md:px-2 px-1 md:py-1 py-0 mt-2 animate-fadeIn'
                    >*</div>
                    <p className='mt-3 md:mt-4 animate-fadeIn'
                      style={{
                        animationDelay: '0.2s', // Stagger the delay by 0.2s per item
                        animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                      }}
                    >──➤</p>
                    <p className='mt-3 md:mt-4 animate-fadeIn'
                      style={{
                        animationDelay: '0.2s', // Stagger the delay by 0.2s per item
                        animationFillMode: 'both' // Ensures the element stays visible after the animation ends
                      }}
                    >{index == list.length - 1 ? 'Null' : ''}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='p-1 text-white md:font-bold text-xs md:text-base bg-sky-700 rounded-r-md'>
              <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
            </div>
          </div>
          <div className='flex flex-wrap justify-between'>
            <div>
              <input
                type="number"
                value={customIdx}
                onChange={(e) => setCustomIdx(parseInt(e.target.value))}
                className="opInput w-48p"
                placeholder="Enter index"
              />
              <button
                onClick={insertInListt}
                className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate rounded-r-md"
              >
                Insert
              </button>
            </div>
            <button
              onClick={removeItemAtIndex}
              className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate rounded-r-md"
            >
              delete by index
            </button>
            <button
              onClick={removeByEle}
              className="bg-sky-600 hover:bg-sky-700 opBtn btnAnimate rounded-r-md"
            >
              delete by element
            </button>
            <button
              onClick={removeList}
              className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 xl:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
            >
              delete Linkedlist
            </button>
          </div>
        </div>
        {/* <div className='min-h-full w-full md:w-28p bg-black md:m-4 md:mr-0 md:ml-2p'>
          <div className='p-1 text-white md:font-bold text-xs md:text-base md:hidden'>
            <p>V</p><p>I</p><p>S</p><p>U</p><p>A</p><p>L</p>
          </div>
        </div> */}
      </div>
      <TopicCard topicName="Real-life Use (Singly Linked List)" />
    </div>
  );
}