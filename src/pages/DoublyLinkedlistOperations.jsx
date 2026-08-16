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

// Nodes carry a stable id so React keys survive shifts caused by insert/delete
// at arbitrary positions — this is what makes the fade-in / fade-out animation
// land on the node that actually changed, instead of on whatever node happens
// to now sit at the end of the array.
let nodeIdSeed = 0;
const makeNode = (value) => ({ id: ++nodeIdSeed, value });

export default function DoublyLinkedlistOperations() {
  const [list, setList] = useState(() => [23, 52, 76, 18].map(makeNode));
  const [listExist, setListExist] = useState(true);

  const [element, setElement] = useState('');
  const [customIdx, setCustomIdx] = useState('');

  const [insertMode, setInsertMode] = useState('end'); // 'end' | 'index'
  const [deleteMode, setDeleteMode] = useState('end'); // 'end' | 'index' | 'value'

  const [activeTab, setActiveTab] = useState('create');

  // Busy while a node is animating in or out — prevents overlapping edits
  // from corrupting the in-flight animation.
  const [isBusy, setIsBusy] = useState(false);
  const [enteringId, setEnteringId] = useState(null);
  const [leavingId, setLeavingId] = useState(null);

  const divRefs = useRef([]);
  const { detailsState, updateState } = useContext(DetailsStateContext);

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  async function listAppend() {
    if (!isListExist() || isBusy) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    const node = makeNode(Number(element));
    setIsBusy(true);
    setList((prev) => [...prev, node]);
    setEnteringId(node.id);
    toast.success(`"${element}" successfully added at the end.`);
    setElement('');
    await delay(600);
    setEnteringId(null);
    setIsBusy(false);
  }

  // =========================================================
  // Insert at index (also handles index === list.length, i.e. append)
  // =========================================================
  async function insertInList() {
    if (!isListExist() || isBusy) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    if (customIdx === '' || parseInt(customIdx) < 0 || parseInt(customIdx) > list.length) {
      toast.error(`Please enter an index between 0 and ${list.length}.`);
      return;
    }

    const index = parseInt(customIdx);
    const node = makeNode(Number(element));

    setIsBusy(true);
    setList((prevList) => [...prevList.slice(0, index), node, ...prevList.slice(index)]);
    setEnteringId(node.id);

    toast.success(`"${element}" inserted at index ${customIdx}`);
    setElement('');
    setCustomIdx('');
    await delay(600);
    setEnteringId(null);
    setIsBusy(false);
  }

  // =========================================================
  // Delete from end
  // =========================================================
  async function removeFromEnd() {
    if (!isListExist() || isBusy) return;

    if (list.length === 0) {
      toast.error('List is already empty');
      return;
    }

    const target = list[list.length - 1];
    setIsBusy(true);
    setLeavingId(target.id);
    await delay(300);
    setList((prev) => prev.slice(0, -1));
    setLeavingId(null);
    setIsBusy(false);
    toast.success('Last element removed.');
  }

  // =========================================================
  // Delete by index
  // =========================================================
  const removeItemAtIndex = async () => {
    if (!isListExist() || isBusy) return;

    if (list.length === 0) {
      toast.error('Linked List is empty');
      return;
    }

    if (customIdx === '' || parseInt(customIdx) < 0 || parseInt(customIdx) >= list.length) {
      toast.error(`Please enter an index between 0 and ${list.length - 1}.`);
      return;
    }

    const index = parseInt(customIdx);
    const target = list[index];

    setIsBusy(true);
    setLeavingId(target.id);
    await delay(300);
    setList((prevList) => [...prevList.slice(0, index), ...prevList.slice(index + 1)]);
    setLeavingId(null);
    setIsBusy(false);
    toast.success(`Element deleted from index ${customIdx}`);
    setCustomIdx('');
  };

  // =========================================================
  // Delete by value
  // =========================================================
  const removeByEle = async () => {
    if (!isListExist() || isBusy) return;

    if (element === '') {
      toast.error('Please enter an element');
      return;
    }

    const target = list.find((node) => node.value === Number(element));

    if (!target) {
      toast.info(`Element ${element} not found in the list.`);
      return;
    }

    setIsBusy(true);
    setLeavingId(target.id);
    await delay(300);
    setList((prev) => prev.filter((node) => node.id !== target.id));
    setLeavingId(null);
    setIsBusy(false);
    toast.success(`Element ${element} removed successfully.`);
    setElement('');
  };

  // =========================================================
  // Delete entire list
  // =========================================================
  const removeList = () => {
    if (!isListExist() || isBusy) return;

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

      <TopicCard topicName="Doubly Linked List" />

      <details
        id="doublyLinkedListOp"
        className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
        onToggle={(e) => handleToggle('doublyLinkedListOp', e.target.open)}
        open={detailsState['doublyLinkedListOp'] !== undefined ? detailsState['doublyLinkedListOp'] : true}
      >
        <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
          Doubly Linked List Operations
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
                    disabled={disabled || isBusy}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 basis-[calc(33.33%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'}
                      ${disabled || isBusy ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted' : ''}`}
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
                <button type="button" onClick={createList} disabled={isBusy} className="opBtn w-full whitespace-nowrap sm:w-auto">
                  Create Linked List
                </button>
              </div>
            )}

            {/* Insert tab */}
            {activeTab === 'insert' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs leading-relaxed text-muted">
                  Add a node at the end, or insert it at a specific position. Each new node links both forward and
                  backward to its neighbors.
                </p>

                <div className="flex w-full rounded-md border border-borderStrong bg-surface p-1 sm:w-fit">
                  <button
                    type="button"
                    onClick={() => setInsertMode('end')}
                    disabled={isBusy}
                    className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${insertMode === 'end' ? 'bg-accent text-white' : 'text-muted hover:bg-element hover:text-ink'
                      }`}
                  >
                    At End
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsertMode('index')}
                    disabled={isBusy}
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
                      disabled={isBusy}
                    />
                    <button type="button" onClick={listAppend} disabled={isBusy} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                      disabled={isBusy}
                    />
                    <input
                      type="number"
                      min={0}
                      value={customIdx}
                      onChange={(e) => setCustomIdx(e.target.value)}
                      className="opInput w-full sm:flex-1"
                      placeholder="Index"
                      disabled={isBusy}
                    />
                    <button type="button" onClick={insertInList} disabled={isBusy} className="opBtn w-full whitespace-nowrap sm:w-auto">
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
                      disabled={isBusy}
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
                    disabled={isBusy}
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
                      disabled={isBusy}
                    />
                    <button
                      type="button"
                      onClick={removeItemAtIndex}
                      disabled={isBusy}
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
                      disabled={isBusy}
                    />
                    <button
                      type="button"
                      onClick={removeByEle}
                      disabled={isBusy}
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
                    disabled={isBusy}
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
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Doubly</span>
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
                  <span className="font-medium text-muted">NULL ⮜──➤ Head ──➤ NULL</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-y-4 p-1">
                  {list.map((node, index) => (
                    <React.Fragment key={node.id}>
                      {/* NULL + arrows before first node */}
                      {index === 0 && (
                        <>
                          <span className="mr-1 font-medium text-muted text-[10px] sm:text-base">NULL</span>

                          <div className="mx-0.5 sm:mx-1 flex h-8 w-8 sm:h-11 sm:w-10 shrink-0 flex-col items-center justify-center text-[10px] sm:text-xs leading-none text-muted">
                            <span>⮜──</span>
                            <span>──➤</span>
                          </div>
                        </>
                      )}

                      {/* Node */}
                      <div
                        className={`cell flex h-8 w-10 sm:h-11 sm:w-14 shrink-0 items-center justify-center rounded-md font-semibold transition-all duration-300 text-xs sm:text-base
                          ${node.id === enteringId ? 'animate-fadeIn' : ''}
                          ${node.id === leavingId ? '!scale-75 !opacity-0 !border-swapping' : ''}`}
                        id={`node-${node.id}`}
                        ref={(el) => (divRefs.current[index] = el)}
                        style={
                          node.id === enteringId
                            ? { animationFillMode: 'both' }
                            : undefined
                        }
                      >
                        {node.value}
                      </div>

                      {/* Links between nodes */}
                      {index < list.length - 1 && (
                        <div className="mx-0.5 sm:mx-1 flex h-8 w-8 sm:h-11 sm:w-10 shrink-0 flex-col items-center justify-center text-[10px] sm:text-xs leading-none text-muted">
                          <span>⮜──</span>
                          <span>──➤</span>
                        </div>
                      )}

                      {/* Arrows + NULL after last node */}
                      {index === list.length - 1 && (
                        <>
                          <div className="mx-0.5 sm:mx-1 flex h-8 w-8 sm:h-11 sm:w-10 shrink-0 flex-col items-center justify-center text-[10px] sm:text-xs leading-none text-muted">
                            <span>⮜──</span>
                            <span>──➤</span>
                          </div>

                          <span className="ml-1 font-medium text-muted text-[10px] sm:text-base">NULL</span>
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </details>

      <TopicCard topicName="Real-life Use (Doubly Linked List)" />
    </div>
  );
}