import React, { useState, useRef, useContext } from "react";
import TopicCard from "../components/TopicCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import { DetailsStateContext } from "../context/DetailsContext";

export default function DynamicArrayOperations() {
  // =========================================================
  // Array state
  // =========================================================

  const [array, setArray] = useState([
    15,
    22,
    12,
    56,
    24,
  ]);

  // =========================================================
  // Operation-specific inputs
  // =========================================================

  // Create
  const [arrayLength, setArrayLength] = useState(
    String(array.length || "")
  );

  // Push
  const [pushValue, setPushValue] = useState("");

  // Insert
  const [insertValue, setInsertValue] = useState("");
  const [insertIndex, setInsertIndex] = useState("");

  // Delete
  const [deleteMode, setDeleteMode] = useState("index");
  const [deleteIndex, setDeleteIndex] = useState("");
  const [deleteValue, setDeleteValue] = useState("");

  // =========================================================
  // Visualizer state
  // =========================================================

  const divRefs = useRef([]);

  const [operationIdxVisibility, setOperationIdxVisibility] =
    useState(false);

  const [operationEleVisibility, setOperationEleVisibility] =
    useState(false);

  // =========================================================
  // Details state
  // =========================================================

  const { detailsState, updateState } =
    useContext(DetailsStateContext);

  const handleToggle = (id, isOpen) => {
    updateState(id, isOpen);
  };

  // =========================================================
  // Utility
  // =========================================================

  const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const isArrayExist = () => {
    if (array.length === 0) {
      toast.error("Please create an array first.");
      return false;
    }

    return true;
  };

  // =========================================================
  // Create new array
  // =========================================================

  const createArray = async () => {
    if (
      arrayLength === "" ||
      parseInt(arrayLength) <= 0
    ) {
      toast.error(
        "Array length must be greater than 0."
      );
      return;
    }

    await delay(200);

    setArray([]);

    await delay(500);

    setArray(
      Array(parseInt(arrayLength)).fill("NULL")
    );

    toast.success(
      "Array created successfully",
      {
        position: "top-center",
      }
    );
  };

  // =========================================================
  // Push
  // =========================================================

  const arrayPushOperation = () => {
    if (!isArrayExist()) return;

    if (pushValue === "") {
      toast.error("Please enter an element.");
      return;
    }

    setArray((prevArray) => [
      ...prevArray,
      Number(pushValue),
    ]);

    toast.success(
      "Element successfully pushed into the array."
    );

    setPushValue("");
  };

  // =========================================================
  // Pop
  // =========================================================

  const arrayPopOperation = () => {
    if (!isArrayExist()) return;

    if (array.length === 0) {
      toast.error("Array is empty.");
      return;
    }

    setArray((prevArray) =>
      prevArray.slice(0, -1)
    );

    toast.success(
      "Element popped from the array."
    );
  };

  // =========================================================
  // Insert
  // =========================================================

  const arrayInsert = async () => {
    if (!isArrayExist()) return;

    if (insertValue === "") {
      toast.error("Please enter an element.");
      return;
    }

    if (insertIndex === "") {
      toast.error("Please enter an index.");
      return;
    }

    const index = parseInt(insertIndex);

    if (
      index > array.length ||
      index < 0
    ) {
      toast.error(
        `Index must be between 0 and ${array.length}.`
      );
      return;
    }

    // Highlight index
    await delay(500);

    setOperationIdxVisibility(true);

    // Show new element
    await delay(1000);

    setOperationEleVisibility(true);

    await delay(1000);

    // =====================================================
    // Dynamic array insertion
    //
    // Unlike the static array, insertion at the end
    // increases the array length.
    // =====================================================

    if (index === array.length) {
      setArray((prevArray) => [
        ...prevArray,
        Number(insertValue),
      ]);
    } else {
      setArray((prevArray) =>
        prevArray.map((item, i) =>
          i === index
            ? Number(insertValue)
            : item
        )
      );
    }

    toast.success(
      `"${insertValue}" inserted at index ${insertIndex}`
    );

    setOperationIdxVisibility(false);
    setOperationEleVisibility(false);

    setInsertValue("");
    setInsertIndex("");
  };

  // =========================================================
  // Delete by index
  // =========================================================

  const removeItemAtIndex = async () => {
    if (!isArrayExist()) return;

    if (deleteIndex === "") {
      toast.error("Please enter an index.");
      return;
    }

    const index = parseInt(deleteIndex);

    if (
      index >= array.length ||
      index < 0
    ) {
      toast.error(
        `Index must be between 0 and ${array.length - 1}.`
      );
      return;
    }

    await delay(500);

    setOperationIdxVisibility(true);

    await delay(1000);

    setArray((prevArray) =>
      prevArray.filter(
        (_, i) => i !== index
      )
    );

    toast.success(
      `Element deleted from index ${deleteIndex}`
    );

    setOperationIdxVisibility(false);

    setDeleteIndex("");
  };

  // =========================================================
  // Delete by value
  // =========================================================

  const removeByEle = () => {
    if (!isArrayExist()) return;

    if (deleteValue === "") {
      toast.error("Please enter an element.");
      return;
    }

    const value = Number(deleteValue);

    if (!array.includes(value)) {
      toast.error("Element not found.");
      return;
    }

    setArray((prevArray) =>
      prevArray.map((item) =>
        item === value
          ? "NULL"
          : item
      )
    );

    toast.success("Element deleted.");

    setDeleteValue("");
  };

  // =========================================================
  // Delete entire array
  // =========================================================

  const removeArray = () => {
    if (!isArrayExist()) return;

    setArray([]);

    setArrayLength("");

    setPushValue("");

    setInsertValue("");
    setInsertIndex("");

    setDeleteIndex("");
    setDeleteValue("");

    toast.success(
      "Array has been successfully deleted."
    );
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div>
      <Helmet>
        <title>
          Dynamic Array Operations Simulator | DSA Simulator
        </title>

        <meta
          name="description"
          content="Learn how dynamic arrays work with push, pop, insertion and deletion operations through an interactive visual simulator."
        />

        <meta
          name="keywords"
          content="dynamic array simulator, dynamic array visualizer, array operations, push pop array, dynamic array insertion"
        />
      </Helmet>


      {/* =====================================================
          Educational content
      ====================================================== */}

      <TopicCard topicName="Dynamic Array" />


      {/* =====================================================
          Dynamic Array Operations
      ====================================================== */}

      <details
        id="dynamicArrayOp"
        className="
          mb-5
          w-full
          overflow-hidden
          rounded-xl
          border
          border-border
          bg-surface
          text-ink
        "
        onToggle={(e) =>
          handleToggle(
            "dynamicArrayOp",
            e.target.open
          )
        }
        open={
          detailsState["dynamicArrayOp"] !== undefined
            ? detailsState["dynamicArrayOp"]
            : true
        }
      >

        {/* =================================================
            Section header
        ================================================== */}

        <summary
          className="
            cursor-pointer
            select-none
            px-4
            py-4
            sm:px-5
            text-base
            sm:text-lg
            md:text-xl
            font-semibold
            text-ink
            marker:text-accent
            hover:bg-bg/50
            transition-colors
          "
        >
          Dynamic Array Operations
        </summary>


        {/* =================================================
            Section content
        ================================================== */}

        <div className="px-4 pb-5 sm:px-5">


          {/* =================================================
              CREATE + PUSH
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              lg:grid-cols-2
            "
          >

            {/* =================================================
                Create Array
            ================================================== */}

            <div
              className="
                rounded-lg
                border
                border-border
                bg-bg
                p-4
              "
            >

              <div className="mb-3">

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-ink
                  "
                >
                  Create Array
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-muted
                  "
                >
                  Create a new dynamic array
                  with an initial size.
                </p>

              </div>


              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >

                <input
                  type="number"
                  min={1}
                  value={arrayLength}
                  onChange={(e) =>
                    setArrayLength(
                      e.target.value
                    )
                  }
                  className="
                    opInput
                    w-full
                    sm:flex-1
                  "
                  placeholder="Initial length"
                />

                <button
                  type="button"
                  onClick={createArray}
                  className="
                    opBtn
                    w-full
                    whitespace-nowrap
                    sm:w-auto
                  "
                >
                  Create Array
                </button>

              </div>

            </div>


            {/* =================================================
                Push / Pop
            ================================================== */}

            <div
              className="
                rounded-lg
                border
                border-border
                bg-bg
                p-4
              "
            >

              <div className="mb-3">

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-ink
                  "
                >
                  Add or Remove at End
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-muted
                  "
                >
                  Push adds an element to the end.
                  Pop removes the last element.
                </p>

              </div>


              <div
                className="
                  flex
                  flex-col
                  gap-2
                  sm:flex-row
                "
              >

                <input
                  type="number"
                  value={pushValue}
                  onChange={(e) =>
                    setPushValue(
                      e.target.value
                    )
                  }
                  className="
                    opInput
                    w-full
                    sm:flex-1
                  "
                  placeholder="Value"
                />

                <div
                  className="
                    flex
                    w-full
                    gap-2
                    sm:w-auto
                  "
                >

                  <button
                    type="button"
                    onClick={arrayPushOperation}
                    className="
                      opBtn
                      flex-1
                      whitespace-nowrap
                      sm:flex-none
                    "
                  >
                    Push
                  </button>

                  <button
                    type="button"
                    onClick={arrayPopOperation}
                    className="
                      opBtn-secondary
                      flex-1
                      whitespace-nowrap
                      sm:flex-none
                    "
                  >
                    Pop
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              Array Visualizer
          ================================================== */}

          <div
            className="
              mt-5
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-bg
            "
          >

            {/* Visualizer header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-border
                px-4
                py-3
                sm:px-5
              "
            >

              <div>

                <div
                  className="
                    text-sm
                    font-semibold
                    text-ink
                  "
                >
                  Array Visualizer
                </div>

                <div
                  className="
                    mt-0.5
                    text-xs
                    text-muted
                  "
                >
                  {array.length > 0
                    ? `${array.length} elements`
                    : "No array created"}
                </div>

              </div>


              {array.length > 0 && (
                <span
                  className="
                    rounded-full
                    bg-accent/10
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-accent
                  "
                >
                  Dynamic
                </span>
              )}

            </div>


            {/* Visualizer workspace */}

            <div
              className="
                overflow-x-auto
                p-4
                sm:p-5
              "
            >

              {array.length > 0 ? (

                <div className="w-max min-w-full">

                  <div
                    className="
                      grid
                      w-fit
                      grid-rows-3
                    "
                    style={{
                      gridTemplateColumns:
                        `repeat(${array.length}, auto)`,
                    }}
                  >

                    {/* =================================================
                        Index row
                    ================================================== */}

                    {array.map((item, index) => (
                      <div
                        key={`index-${index}`}
                        className="
                          flex
                          h-8
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          text-xs
                          font-medium
                          text-muted
                        "
                      >
                        {index}
                      </div>
                    ))}


                    {/* =================================================
                        Element row
                    ================================================== */}

                    {array.map((item, index) => {

                      const isActive =
                        operationIdxVisibility &&
                        index ===
                        parseInt(
                          insertIndex
                        );

                      return (
                        <div
                          id={`dynamic-array-${index}`}
                          key={`element-${index}`}
                          ref={
                            (el) =>
                            (divRefs.current[index] =
                              el)
                          }
                          className={`
                            cell
                            arrayDiv
                            h-11
                            w-14
                            shrink-0
                            font-semibold
                            ${isActive
                              ? "!border-frontier !bg-frontier text-white"
                              : ""
                            }
                          `}
                        >
                          {item}
                        </div>
                      );
                    })}


                    {/* =================================================
                        Operation indicator
                    ================================================== */}

                    {array.map((item, index) => (
                      <div
                        key={`operation-${index}`}
                        className="
                          flex
                          h-8
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          text-xs
                          font-semibold
                          text-accent
                        "
                      >

                        {operationEleVisibility &&
                          index ===
                          parseInt(
                            insertIndex
                          ) && (
                            <span
                              className="
                                rounded
                                bg-accent/10
                                px-1.5
                                py-0.5
                              "
                            >
                              {insertValue}
                            </span>
                          )}

                      </div>
                    ))}

                  </div>

                </div>

              ) : (

                /* =================================================
                    Empty state
                ================================================== */

                <div
                  className="
                    flex
                    min-h-[150px]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <div
                    className="
                      mb-2
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      bg-element
                      text-muted
                    "
                  >
                    ∅
                  </div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-ink
                    "
                  >
                    No array to visualize
                  </p>

                  <p
                    className="
                      mt-1
                      max-w-xs
                      text-xs
                      leading-relaxed
                      text-muted
                    "
                  >
                    Create an array above to
                    start experimenting.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* =================================================
              INSERT SECTION
          ================================================== */}

          <div
            className="
              mt-5
              rounded-lg
              border
              border-border
              bg-bg
              p-4
            "
          >

            <div className="mb-3">

              <h3
                className="
                  text-sm
                  font-semibold
                  text-ink
                "
              >
                Insert Element
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-muted
                "
              >
                Insert a value at a specific
                index. Dynamic arrays can grow
                when inserting at the end.
              </p>

            </div>


            <div
              className="
                flex
                flex-col
                gap-2
                sm:flex-row
              "
            >

              <input
                type="number"
                value={insertValue}
                onChange={(e) =>
                  setInsertValue(
                    e.target.value
                  )
                }
                className="
                  opInput
                  w-full
                  sm:flex-1
                "
                placeholder="Value"
              />

              <input
                type="number"
                min={0}
                value={insertIndex}
                onChange={(e) =>
                  setInsertIndex(
                    e.target.value
                  )
                }
                className="
                  opInput
                  w-full
                  sm:flex-1
                "
                placeholder="Index"
              />

              <button
                type="button"
                onClick={arrayInsert}
                className="
                  opBtn
                  w-full
                  whitespace-nowrap
                  sm:w-auto
                "
              >
                Insert
              </button>

            </div>

          </div>


          {/* =================================================
              DELETE SECTION
          ================================================== */}

          <div
            className="
              mt-5
              rounded-lg
              border
              border-border
              bg-bg
              p-4
            "
          >

            {/* Delete header */}

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >

              <div>

                <h3
                  className="
                    text-sm
                    font-semibold
                    text-ink
                  "
                >
                  Delete Element
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-muted
                  "
                >
                  Choose how you want to find
                  the element to delete.
                </p>

              </div>


              <button
                type="button"
                onClick={removeArray}
                className="
                  opBtn-danger
                  w-full
                  sm:w-auto
                "
              >
                Delete Array
              </button>

            </div>


            {/* Delete controls */}

            <div
              className="
                mt-4
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
              "
            >

              {/* Delete mode */}

              <div
                className="
                  flex
                  w-full
                  rounded-md
                  border
                  border-borderStrong
                  bg-surface
                  p-1
                  sm:w-auto
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setDeleteMode("index")
                  }
                  className={`
                    flex-1
                    rounded
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    transition-colors
                    sm:flex-none
                    ${deleteMode === "index"
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-element hover:text-ink"
                    }
                  `}
                >
                  By Index
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteMode("value")
                  }
                  className={`
                    flex-1
                    rounded
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    transition-colors
                    sm:flex-none
                    ${deleteMode === "value"
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-element hover:text-ink"
                    }
                  `}
                >
                  By Value
                </button>

              </div>


              {/* Contextual input */}

              {deleteMode === "index" ? (

                <input
                  type="number"
                  min={0}
                  value={deleteIndex}
                  onChange={(e) =>
                    setDeleteIndex(
                      e.target.value
                    )
                  }
                  className="
                    opInput
                    w-full
                    sm:max-w-[180px]
                  "
                  placeholder="Index"
                />

              ) : (

                <input
                  type="number"
                  value={deleteValue}
                  onChange={(e) =>
                    setDeleteValue(
                      e.target.value
                    )
                  }
                  className="
                    opInput
                    w-full
                    sm:max-w-[180px]
                  "
                  placeholder="Value"
                />

              )}


              <button
                type="button"
                onClick={
                  deleteMode === "index"
                    ? removeItemAtIndex
                    : removeByEle
                }
                className="
                  opBtn-secondary
                  w-full
                  whitespace-nowrap
                  sm:w-auto
                "
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      </details>


      {/* =====================================================
          Real-life use
      ====================================================== */}

      <TopicCard
        topicName="Real-Life Use(Dynamic Array)"
      />

    </div>
  );
}