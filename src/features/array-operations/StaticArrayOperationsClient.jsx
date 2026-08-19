"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import { DetailsStateContext } from "../../context/DetailsContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OPERATION_TABS = [
    { id: "create", label: "Create" },
    { id: "insert", label: "Set Value" },
    { id: "delete", label: "Delete" },
];

const StaticArrayOperationsClient = () => {
    const [array, setArray] = useState([15, 22, 12, 56, 24]);
    const [arrayLength, setArrayLength] = useState(String(array.length || ""));
    const [insertValue, setInsertValue] = useState("");
    const [insertIndex, setInsertIndex] = useState("");
    const [deleteMode, setDeleteMode] = useState("index");
    const [deleteIndex, setDeleteIndex] = useState("");
    const [deleteValue, setDeleteValue] = useState("");
    const [activeTab, setActiveTab] = useState("create");

    useEffect(() => {
        if (array.length === 0 && activeTab !== "create") {
            setActiveTab("create");
        }
    }, [array.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const divRefs = useRef([]);
    const [operationIdxVisibility, setOperationIdxVisibility] = useState(false);
    const [operationEleVisibility, setOperationEleVisibility] = useState(false);

    const { detailsState, updateState } = useContext(DetailsStateContext);
    const handleToggle = (id, isOpen) => updateState(id, isOpen);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const isArrayExist = () => {
        if (array.length === 0) {
            toast.error("Please create an array first.");
            return false;
        }
        return true;
    };

    const createArray = async () => {
        if (arrayLength === "" || parseInt(arrayLength) <= 0) {
            toast.error("Array length must be greater than 0.");
            return;
        }
        setArray([]);
        await delay(500);
        setArray(Array(parseInt(arrayLength)).fill("NULL"));
        toast.success("Array created successfully", { position: "top-center" });
        setActiveTab("insert");
    };

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
        if (index >= array.length || index < 0) {
            toast.error(`Index must be between 0 and ${array.length - 1}.`);
            return;
        }
        await delay(500);
        setOperationIdxVisibility(true);
        await delay(1000);
        setOperationEleVisibility(true);
        await delay(1000);
        setArray((prevArray) => prevArray.map((item, i) => (i === index ? Number(insertValue) : item)));
        toast.success(`"${insertValue}" set at index ${insertIndex}!`);
        setOperationIdxVisibility(false);
        setOperationEleVisibility(false);
        setInsertValue("");
        setInsertIndex("");
    };

    const deleteByIdx = async () => {
        if (!isArrayExist()) return;
        if (deleteIndex === "") {
            toast.error("Please enter an index.");
            return;
        }
        const index = parseInt(deleteIndex);
        if (index >= array.length || index < 0) {
            toast.error(`Please enter an index between 0 and ${array.length - 1}.`);
            return;
        }
        await delay(500);
        setOperationIdxVisibility(true);
        await delay(1000);
        setArray((prevArray) => prevArray.map((item, i) => (i === index ? "NULL" : item)));
        toast.success(`Element deleted from index ${deleteIndex}`);
        setOperationIdxVisibility(false);
        setDeleteIndex("");
    };

    const deleteByEle = async () => {
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
        setArray((prevArray) => prevArray.map((item) => (item === value ? "NULL" : item)));
        toast.success("Element deleted.");
        setDeleteValue("");
    };

    const removeArray = () => {
        if (!isArrayExist()) return;
        setArray([]);
        toast.success("Array has been successfully deleted.");
        setArrayLength("");
        setInsertValue("");
        setInsertIndex("");
        setDeleteIndex("");
        setDeleteValue("");
    };

    const hasArray = array.length > 0;

    return (
        <details
            id="staticArrayOp"
            className="mb-5 w-full overflow-hidden rounded-xl border border-border bg-surface text-ink"
            onToggle={(e) => handleToggle("staticArrayOp", e.target.open)}
            open={detailsState["staticArrayOp"] !== undefined ? detailsState["staticArrayOp"] : true}
        >
            <summary className="cursor-pointer select-none px-4 py-4 sm:px-5 text-base sm:text-lg md:text-xl font-semibold text-ink marker:text-accent hover:bg-bg/50 transition-colors">
                Static Array Operations
            </summary>

            <div className="px-4 pb-5 sm:px-5">
                {/* =================================================
              OPERATIONS PANEL (tabbed)
          ================================================= */}
                <div className="rounded-lg border border-border bg-bg p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink">Operations</h3>
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                            {hasArray ? `${array.length} slots` : "No array yet"}
                        </span>
                    </div>

                    {/* Tab bar */}
                    <div className="mb-4 flex w-full flex-wrap rounded-md border border-borderStrong bg-surface p-0.5 sm:flex-nowrap sm:p-1">
                        {OPERATION_TABS.map((tab) => {
                            const disabled = tab.id !== "create" && !hasArray;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 basis-[calc(33.33%-4px)] m-0.5 rounded px-2 py-1.5 text-[10px] sm:basis-0 sm:m-0 sm:px-3 sm:py-2 sm:text-sm font-medium transition-colors
                      ${activeTab === tab.id ? "bg-accent text-white" : "text-muted hover:bg-element hover:text-ink"}
                      ${disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted" : ""}`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Create tab */}
                    {activeTab === "create" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Set the fixed size of your array. Creating a new array replaces the current one.
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    min={1}
                                    value={arrayLength}
                                    onChange={(e) => setArrayLength(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Array length"
                                />
                                <button type="button" onClick={createArray} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                    Create Array
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Insert / Set Value tab */}
                    {activeTab === "insert" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-xs leading-relaxed text-muted">
                                Static arrays have a fixed size — this replaces the value at a chosen index; it doesn't shift
                                other elements.
                                {hasArray && (
                                    <>
                                        {" "}
                                        Valid index range: <span className="font-medium text-ink">0–{array.length - 1}</span>.
                                    </>
                                )}
                            </p>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="number"
                                    value={insertValue}
                                    onChange={(e) => setInsertValue(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Value"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={insertIndex}
                                    onChange={(e) => setInsertIndex(e.target.value)}
                                    className="opInput w-full sm:flex-1"
                                    placeholder="Index"
                                />
                                <button type="button" onClick={arrayInsert} className="opBtn w-full whitespace-nowrap sm:w-auto">
                                    Set Value
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete tab */}
                    {activeTab === "delete" && (
                        <div className="flex flex-col gap-4">
                            <p className="text-xs leading-relaxed text-muted">
                                Static arrays can't shrink — deleting replaces the value at a slot with{" "}
                                <span className="font-medium text-ink">NULL</span> instead of removing it.
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex w-full rounded-md border border-borderStrong bg-surface p-1 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteMode("index")}
                                        className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${deleteMode === "index" ? "bg-accent text-white" : "text-muted hover:bg-element hover:text-ink"
                                            }`}
                                    >
                                        By Index
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeleteMode("value")}
                                        className={`flex-1 rounded px-3 py-1.5 text-xs font-medium transition-colors sm:flex-none ${deleteMode === "value" ? "bg-accent text-white" : "text-muted hover:bg-element hover:text-ink"
                                            }`}
                                    >
                                        By Value
                                    </button>
                                </div>

                                {deleteMode === "index" ? (
                                    <input
                                        type="number"
                                        min={0}
                                        value={deleteIndex}
                                        onChange={(e) => setDeleteIndex(e.target.value)}
                                        className="opInput w-full sm:max-w-[180px]"
                                        placeholder="Index"
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        value={deleteValue}
                                        onChange={(e) => setDeleteValue(e.target.value)}
                                        className="opInput w-full sm:max-w-[180px]"
                                        placeholder="Value"
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={deleteMode === "index" ? deleteByIdx : deleteByEle}
                                    className="opBtn-secondary w-full whitespace-nowrap sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-relaxed text-muted">
                                    Need a fresh array? Remove the current array and create a new one.
                                </p>

                                <button
                                    type="button"
                                    onClick={removeArray}
                                    className="opBtn-danger w-full whitespace-nowrap sm:w-auto"
                                >
                                    Delete Array
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* =================================================
              Array Visualizer
          ================================================= */}
                <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                        <div>
                            <div className="text-sm font-semibold text-ink">Array Visualizer</div>
                            <div className="mt-0.5 text-xs text-muted">
                                {hasArray ? `${array.length} elements` : "No array created"}
                            </div>
                        </div>
                        {hasArray && (
                            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Static</span>
                        )}
                    </div>

                    <div className="overflow-x-auto p-4 sm:p-5">
                        {hasArray ? (
                            <div className="w-max min-w-full">
                                <div
                                    className="grid w-fit grid-rows-3"
                                    style={{ gridTemplateColumns: `repeat(${array.length}, auto)` }}
                                >
                                    {array.map((item, index) => (
                                        <div
                                            key={`index-${index}`}
                                            className="flex h-6 w-10 shrink-0 items-center justify-center text-[10px] font-medium text-muted sm:h-8 sm:w-14 sm:text-xs"
                                        >
                                            {index}
                                        </div>
                                    ))}

                                    {array.map((item, index) => {
                                        const isActive = operationIdxVisibility && index === parseInt(insertIndex);
                                        const isNull = item === "NULL";

                                        return (
                                            <div
                                                id={`array-element-${index}`}
                                                key={`element-${index}`}
                                                ref={(el) => (divRefs.current[index] = el)}
                                                className={`cell arrayDiv h-8 w-10 shrink-0 text-xs sm:h-11 sm:w-14 sm:text-base font-semibold
                            ${isNull ? "italic font-normal text-muted" : ""}
                            ${isActive ? "!border-frontier !bg-frontier text-frontier-text" : ""}`}
                                                style={{ animationDelay: `${index * 0.2}s` }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}

                                    {array.map((item, index) => (
                                        <div
                                            key={`operation-${index}`}
                                            className="flex h-6 w-10 shrink-0 items-center justify-center text-[10px] font-semibold text-accent sm:h-8 sm:w-14 sm:text-xs"
                                        >
                                            {operationEleVisibility && index === parseInt(insertIndex) && (
                                                <span className="rounded bg-accent/10 px-1 py-0.5 sm:px-1.5 sm:py-0.5">{insertValue}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-element text-muted">
                                    ∅
                                </div>
                                <p className="text-sm font-medium text-ink">No array to visualize</p>
                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
                                    Create an array above to start experimenting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </details>
    );
};

export default StaticArrayOperationsClient;