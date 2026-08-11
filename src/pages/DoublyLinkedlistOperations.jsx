import React, { useContext } from 'react'
import { useState, useRef } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';

export default function DoublyLinkedlistOperations() {
  const [list, setList] = useState([23, 52, 76, 18]);
  const [element, setElement] = useState('');
  const [listExist, setListExist] = useState(true);
  const [customIdx, setCustomIdx] = useState('');
  const { theme } = useContext(ThemeContext);
  const { detailsState, updateState } = useContext(DetailsStateContext);

  const divRefs = useRef([]);

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen);
  };

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

  function listAppend() {
    if (!isListExist()) return;
    if (element === '') {
      toast.error("Please enter an element");
      return;
    }

    setList([...list, element]);
    toast.success(`"${element}" successfully added at the end.`);
    setElement('');
  };

  function insertInList() {
    if (!listExist) return;
    if (list.length === 0) {
      toast.error("Linked List is empty");
      return;
    }
    if (element === '') {
      toast.error("Please enter an element");
      return;
    }
    if (customIdx == '' || customIdx < 0 || customIdx >= list.length) {
      toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
      return;
    }
    if (element) {
      if (customIdx > list.length) {
        return;
      } else {
        setList(prevArray => {
          const newArray = [
            ...prevArray.slice(0, customIdx),
            element,
            ...prevArray.slice(customIdx)
          ];
          return newArray;
        });
      }
      toast.success(`"${element}" inserted at index ${customIdx}`);
      setElement('');
    }
  }

  function removeFromEnd() {
    if (!isListExist()) return;
    if (list.length == 0) {
      toast.error("List is already empty");
      return;
    }
    setList(list.slice(0, -1));
    toast.success("Last element removed.");
  }

  const removeItemAtIndex = () => {
    if (!isListExist()) return;

    if (list.length === 0) {
      toast.error("Linked List is empty");
      return;
    }

    if (customIdx == '' || customIdx < 0 || customIdx >= list.length) {
      toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
      return;
    }
    setList(prevArray => [
      ...prevArray.slice(0, customIdx),
      ...prevArray.slice(customIdx + 1)
    ]);
    toast.success(`Element deleted from index ${customIdx}`);
  };

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
  }

  return (
    <div>
      <Helmet>
        <title>Singly & Doubly Linked List Visualizer | DSA Simulator</title>
        <meta name="description" content="Simulate pointers, head nodes, node deletion, and insertion in singly and doubly linked lists. Visualize browser history and playlists." />
        <meta name="keywords" content="linked list simulator, doubly linked list animation, node traversal tool, pointer visualization" />
      </Helmet>
      <TopicCard topicName="Doubly Linked List" />
      <details
        className="opSection w-full h-fit p-4 mb-4"
        id='doublyLinkedListOp'
        onToggle={(e) => { handleToggle('doublyLinkedListOp', e.target.open) }}
        open={detailsState['doublyLinkedListOp'] !== undefined ? detailsState['doublyLinkedListOp'] : true}
      >
        <summary className="sm:mb-2 text-base sm:text-lg md:text-xl font-semibold text-ink cursor-pointer">Doubly Linked List Operations</summary>
        <div className='w-full mb-2 pt-2'>
          <div className="flex flex-wrap justify-between gap-y-2 mb-4 w-full sm:text-base text-sm">
            <div className='mr-2'>
              <button
                onClick={createList}
                className="opBtn btnAnimate rounded-md"
              >
                Create Linked List
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
                className="opBtn btnAnimate"
              >
                Insert at end
              </button>
              <button
                onClick={removeFromEnd}
                className="opBtn btnAnimate rounded-r-md"
              >
                Delete from end
              </button>
            </div>
          </div>

          <div className='vizCard flex m-2 mx-0 mb-6'>
            <div className='w-full p-2 overflow-x-auto'>
              {listExist && <p className='md:m-2 font-semibold text-accent'>Linked List</p>}
              <div className="flex flex-wrap items-center gap-y-3 xl:ml-2 p-2">
                {list.length === 0 && (
                  <span className='font-medium' style={{ color: 'rgb(var(--color-text-muted))' }}>NULL ⮜──➤ Head ──➤ NULL</span>
                )}
                {list.map((item, index) => (
                  <div key={index} className='flex items-center animate-fadeIn' style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'both' }}>
                    {index === 0 && (
                      <span className='mr-2 font-medium' style={{ color: 'rgb(var(--color-text-muted))' }}>NULL</span>
                    )}
                    <div className='flex flex-col items-center'>
                      <span className='text-xs mb-0.5' style={{ color: 'rgb(var(--color-text-secondary))' }}>⮜──</span>
                      <div
                        id={item}
                        ref={divRefs.current[index]}
                        className="cell flex justify-center items-center flex-shrink-0 md:px-4 p-2 md:py-2 py-1 rounded-md"
                      >
                        {item}
                      </div>
                      <span className='text-xs mt-0.5' style={{ color: 'rgb(var(--color-text-secondary))' }}>──➤</span>
                    </div>
                    {index === list.length - 1 && (
                      <span className='ml-2 font-medium' style={{ color: 'rgb(var(--color-text-muted))' }}>NULL</span>
                    )}
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
                type="number"
                value={customIdx}
                onChange={(e) => setCustomIdx(parseInt(e.target.value))}
                className="opInput w-48p"
                placeholder="Enter index"
              />
              <button
                onClick={insertInList}
                className="opBtn btnAnimate rounded-r-md"
              >
                Insert
              </button>
            </div>
            <button
              onClick={removeItemAtIndex}
              className="opBtn btnAnimate rounded-md"
            >
              Delete by index
            </button>
            <button
              onClick={removeByEle}
              className="opBtn btnAnimate rounded-md"
            >
              Delete by element
            </button>
            <button
              onClick={removeList}
              className="opBtn-danger btnAnimate"
            >
              Delete Linked List
            </button>
          </div>
        </div>
      </details>
      <TopicCard topicName="Real-life Use (Doubly Linked List)" />
    </div>
  );
}