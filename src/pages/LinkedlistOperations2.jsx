import React, { useState, useRef, useContext, useEffect } from 'react';
import { DetailsStateContext } from '../context/DetailsContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';

const OPERATION_TABS = [
  { id: 'create', label: 'Create' },
  { id: 'insert', label: 'Insert' },
  { id: 'delete', label: 'Delete' },
];

export default function SinglyLinkedList() {
  const [list, setList] = useState([23, 52, 76, 18]);
  const [listExist, setListExist] = useState(true);

  const [element, setElement] = useState('');
  const [customIdx, setCustomIdx] = useState('');

  // Sub-modes within the Insert / Delete tabs
  const [insertMode, setInsertMode] = useState('end'); // 'end' | 'index'
  const [deleteMode, setDeleteMode] = useState('end'); // 'end' | 'index' | 'value'

  const [activeTab, setActiveTab] = useState('create');

  const divRefs = useRef([]);
  const { detailsState, updateState } = useContext(DetailsStateContext);

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen);
  };

  // Fall back to Create tab whenever the list is deleted
  useEffect(() => {
    if (!listExist && activeTab !== 'create') {
      setActiveTab('create');
    }
  }, [listExist]); // eslint-disable-line react-hooks/exhaustive-deps

  // =========================================================
  // Helpers
  // =========================================================
  const isListExist = () => {
    if (!listExist) {
      toast.error('Please create a list first.');
      return false;
    }
    return true;
  };

  // =========================================================
  // Create new list
  // =========================================================
  const createList = () => {
    setList([]);
    setListExist(true);
    toast.success('New linked list created');
    setActiveTab('insert');
  };

  // =========================================================
  // Insert at end
  // =========================================================
  function listAppend() {
    if (!isListExist()) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    setList([...list, Number(element)]);
    toast.success(`"${element}" successfully added at the end.`);
    setElement('');
  }

  // =========================================================
  // Insert at index (also handles index === list.length, i.e. append)
  // =========================================================
  function insertInListt() {
    if (!isListExist()) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    if (customIdx === '' || parseInt(customIdx) < 0 || parseInt(customIdx) > list.length) {
      toast.error(`Please enter an index between 0 and ${list.length}.`);
      return;
    }

    const index = parseInt(customIdx);

    setList((prevArray) => [
      ...prevArray.slice(0, index),
      Number(element),
      ...prevArray.slice(index),
    ]);

    toast.success(`"${element}" inserted at index ${customIdx}`);
    setElement('');
    setCustomIdx('');
  }

  // =========================================================
  // Delete from end
  // =========================================================
  function removeFromEnd() {
    if (!isListExist()) return;

    if (list.length === 0) {
      toast.error('List is already empty');
      return;
    }
    setList(list.slice(0, -1));
    toast.success('Last element removed.');
  }

  // =========================================================
  // Delete by index
  // =========================================================
  const removeItemAtIndex = () => {
    if (!isListExist()) return;

    if (list.length === 0) {
      toast.error('Linked List is empty');
      return;
    }

    if (customIdx === '' || parseInt(customIdx) < 0 || parseInt(customIdx) >= list.length) {
      toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
      return;
    }

    const index = parseInt(customIdx);

    setList((prevArray) => [
      ...prevArray.slice(0, index),
      ...prevArray.slice(index + 1),
    ]);
    toast.success(`Element deleted from index ${customIdx}`);
    setCustomIdx('');
  };

  // =========================================================
  // Delete by value
  // =========================================================
  const removeByEle = () => {
    if (!isListExist()) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    const updatedList = list.filter((item) => item !== Number(element));

    if (updatedList.length < list.length) {
      setList(updatedList);
      toast.success(`Element ${element} removed successfully.`);
    } else {
      toast.info(`Element ${element} not found in the list.`);
    }
    setElement('');
  };

  // =========================================================
  // Delete entire list
  // =========================================================
  const removeList = () => {
    if (!isListExist()) return;

    setList([]);
    setListExist(false);
    setElement('');
    setCustomIdx('');
    toast.success('List deleted successfully');
  };

  // =========================================================
  // Render
  // =========================================================
  return (
    <div>
      <Helmet>
        <title>Singly & Doubly Linked List Visualizer | DSA Simulator</title>
        <meta
          name="description"
          content="Simulate pointers, head nodes, node deletion, and insertion in singly and doubly linked lists. Visualize browser history and playlists."
        />
        <meta
          name="keywords"
          content="linked list simulator, doubly linked list animation, node traversal tool, pointer visualization"
        />
      </Helmet>

      <TopicCard topicName="Singly Linked List" />

      <details
        id="singlyLinkedListOp"
        className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
        onToggle={(e) => handleToggle('singlyLinkedListOp', e.target.open)}
        open={detailsState['singlyLinkedListOp'] !== undefined ? detailsState['singlyLinkedListOp'] : true}
      >
        <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
          Singly Linked List Operations
        </summary>

        <div className="px-4 pb-5 sm:px-5">
          {/* =================================================
              OPERATIONS PANEL (tabbed)
          ================================================= */}
          <div className="rounded-lg border border-border bg-bg p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Operations</h3>
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                {listExist ? `${list.length} nodes` : 'No list yet'}
              </span>
            </div>

            {/* Tab bar */}
            <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-0.5 sm:flex-nowrap sm:p-1">
              {OPERATION_TABS.map((tab) => {
                const disabled = tab.id !== 'create' && !listExist;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 basis-[calc(33.33%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'}
                      ${disabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted' : ''}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Create tab */}
            {activeTab === 'create' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-muted">
                  Start a new empty list. Creating a new list replaces the current one.
                </p>
                <button type="button" onClick={createList} className="opBtn w-full whitespace-nowrap sm:w-auto">
                  Create New Linked List
                </button>
              </div>
            )}

            {/* Insert tab */}
            {activeTab === 'insert' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-muted">
                  Add a node at the end, or insert it at a specific position — later nodes shift to make room.
                </p>

                <div className="flex w-full rounded-md border border-borderStrong bg-surface p-1 sm:w-fit">
                  <button
                    type="button"
                    onClick={() => setInsertMode('end')}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${insertMode === 'end' ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
                      }`}
                  >
                    At End
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertMode('index')}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${insertMode === 'index' ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
                      }`}
                  >
                    At Index
                  </button>
                </div>

                {insertMode === 'end' ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      className="opInput w-full sm:flex-1"
                      placeholder="Value"
                    />
                    <button type="button" onClick={listAppend} className="opBtn w-full whitespace-nowrap sm:w-auto">
                      Insert at End
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      className="opInput w-full sm:flex-1"
                      placeholder="Value"
                    />
                    <input
                      type="number"
                      min={0}
                      value={customIdx}
                      onChange={(e) => setCustomIdx(e.target.value)}
                      className="opInput w-full sm:flex-1"
                      placeholder="Index"
                    />
                    <button type="button" onClick={insertInListt} className="opBtn w-full whitespace-nowrap sm:w-auto">
                      Insert
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Delete tab */}
            {activeTab === 'delete' && (
              <div className="flex flex-col gap-4">
                <p className="text-xs leading-relaxed text-muted">
                  Remove the last node, a node at a given index, or the first node matching a value.
                </p>

                <div className="flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-1 sm:w-fit sm:flex-nowrap">
                  {[
                    { id: 'end', label: 'From End' },
                    { id: 'index', label: 'By Index' },
                    { id: 'value', label: 'By Value' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setDeleteMode(mode.id)}
                      className={`flex-1 basis-1/3 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:basis-0 sm:flex-none ${deleteMode === mode.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
                        }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {deleteMode === 'end' && (
                  <button
                    type="button"
                    onClick={removeFromEnd}
                    className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                  >
                    Delete Last Node
                  </button>
                )}

                {deleteMode === 'index' && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      min={0}
                      value={customIdx}
                      onChange={(e) => setCustomIdx(e.target.value)}
                      className="opInput w-full sm:max-w-[180px]"
                      placeholder="Index"
                    />
                    <button
                      type="button"
                      onClick={removeItemAtIndex}
                      className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {deleteMode === 'value' && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      value={element}
                      onChange={(e) => setElement(e.target.value)}
                      className="opInput w-full sm:max-w-[180px]"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={removeByEle}
                      className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-muted">
                    Or remove the whole list and start over.
                  </p>

                  <button
                    type="button"
                    onClick={removeList}
                    className="opBtn-danger w-full whitespace-nowrap sm:w-auto"
                  >
                    Delete Linked List
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              List Visualizer
          ================================================= */}
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
              <div>
                <div className="text-sm font-semibold text-ink">Linked List Visualizer</div>
                <div className="mt-0.5 text-xs text-muted">
                  {listExist ? `${list.length} nodes` : 'No list created'}
                </div>
              </div>
              {listExist && (
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Singly</span>
              )}
            </div>

            <div className="overflow-x-auto p-4 sm:p-5">
              {!listExist ? (
                <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-element text-muted">
                    ∅
                  </div>
                  <p className="text-sm font-medium text-ink">No list to visualize</p>
                  <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                    Create a list above to start experimenting.
                  </p>
                </div>
              ) : list.length === 0 ? (
                <div className="flex min-h-[100px] items-center justify-center">
                  <span className="font-medium text-muted">Head ──➤ NULL</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-y-3 p-1">
                  {list.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center animate-fadeIn"
                      style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'both' }}
                    >
                      <div
                        id={`node-${index}`}
                        ref={(el) => (divRefs.current[index] = el)}
                        className="cell flex h-8 w-10 sm:h-11 sm:w-14 shrink-0 items-center justify-center rounded-l-md font-semibold text-xs sm:text-base"
                      >
                        {item}
                      </div>
                      <div className="flex h-8 w-6 sm:h-11 sm:w-8 shrink-0 items-center justify-center rounded-r-md bg-accent font-bold text-white text-xs sm:text-base">
                        •
                      </div>
                      <span className="mx-1 sm:mx-2 font-medium text-muted text-[10px] sm:text-base">──➤</span>
                      {index === list.length - 1 && (
                        <span className="font-medium text-muted text-[10px] sm:text-base">NULL</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </details>

      <TopicCard topicName="Real-life Use (Singly Linked List)" />
    </div>
  );
}