import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslate } from "../assets/TranslationObj";
import { ThemeContext } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async";

export default function HomePage({ language }) {
  const translate = useTranslate(language);
  const { theme } = useContext(ThemeContext);

  // =========================================================
  // Auto-playing Bubble Sort Simulation State
  // =========================================================
  const [demoArray, setDemoArray] = useState([87, 64, 53, 22, 15, 8]);
  const [firstEle, setFirstEle] = useState(-1);
  const [secondEle, setSecondEle] = useState(-1);
  const [isGreater, setIsGreater] = useState(false);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [stepMessage, setStepMessage] = useState("Preparing array...");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let active = true;

    const runSimulation = async () => {
      while (active) {
        // Initial wait with original array state
        setDemoArray([87, 64, 53, 22, 15, 8]);
        setFirstEle(-1);
        setSecondEle(-1);
        setIsGreater(false);
        setSortedIndices([]);
        setStepMessage("Array created: [87, 64, 53, 22, 15, 8]");
        await delay(2000);

        let arr = [87, 64, 53, 22, 15, 8];
        let n = arr.length;

        for (let j = 0; j < n - 1; j++) {
          let swappedInPass = false;

          for (let i = 0; i < n - 1 - j; i++) {
            if (!active) return;

            setFirstEle(i);
            setSecondEle(i + 1);
            setIsGreater(false);
            setStepMessage(`Comparing index ${i} (${arr[i]}) and index ${i + 1} (${arr[i + 1]})`);
            await delay(1000);

            if (arr[i] > arr[i + 1]) {
              setIsGreater(true);
              setStepMessage(`${arr[i]} > ${arr[i + 1]} — Swapping elements`);
              await delay(800);

              let temp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = temp;
              setDemoArray([...arr]);
              swappedInPass = true;
              await delay(600);
            } else {
              setStepMessage(`${arr[i]} ≤ ${arr[i + 1]} — No swap needed`);
              await delay(600);
            }

            setIsGreater(false);
          }

          setSortedIndices((prev) => [...prev, n - j - 1]);
          if (!swappedInPass) {
            setStepMessage("No swaps this pass — stopping early.");
            break;
          }
        }

        if (!active) return;
        setSortedIndices([0, 1, 2, 3, 4, 5]);
        setFirstEle(-1);
        setSecondEle(-1);
        setIsGreater(false);
        setStepMessage("Array successfully sorted!");
        await delay(4500); // Keep sorted state visible
      }
    };

    runSimulation();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full min-h-[92vh] py-8 px-4 sm:px-6 lg:px-8 bg-theme-gradient text-ink flex flex-col justify-start">
      <Helmet>
        <title>DSA Simulator | Interactive Data Structures & Algorithms Visualizer</title>
        <meta
          name="description"
          content="Master Data Structures and Algorithms visually. Interactively simulate arrays, linked lists, searching, and sorting algorithms in real time."
        />
        <meta
          name="keywords"
          content="dsa simulator, algorithm visualizer, learn data structures visually, code simulation tool"
        />
      </Helmet>

      {/* =================================================
          HERO SECTION (Split-screen on Desktop)
      ================================================= */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mt-4 sm:mt-6 lg:mt-12">
        {/* Left Side: Copy and Actions */}
        <div className="lg:col-span-7 flex flex-col space-y-5 sm:space-y-6 text-center lg:text-left items-center lg:items-start animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent rounded-full px-3 py-1 text-[10px] sm:text-sm font-medium w-fit border border-accent/20">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            <span>Interactive Learning Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Master Data Structures & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
              Algorithms Visually
            </span>
          </h1>

          <p className="text-xs sm:text-base text-ink-secondary leading-relaxed max-w-2xl px-2 sm:px-0">
            Forget dry theory. Experience step-by-step visual execution of arrays,
            linked lists, searching, and sorting. Interact directly with memory blocks,
            pointers, and watch state variables update in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto px-4 sm:px-0">
            <Link
              to="/array-operations"
              className="px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/35 transition-all text-center flex items-center justify-center space-x-2 border border-transparent hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <a
              href="#categories"
              className="px-6 py-3 bg-surface border border-border hover:border-border-strong text-ink font-semibold rounded-lg transition-all text-center flex items-center justify-center hover:bg-element"
            >
              Explore Algorithms
            </a>
          </div>

          {/* Inline stats / highlights */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-border w-full">
            <div>
              <p className="text-lg sm:text-2xl font-bold text-accent">100%</p>
              <p className="text-[10px] sm:text-xs text-ink-muted uppercase tracking-tight">Interactive</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-accent">Real-time</p>
              <p className="text-[10px] sm:text-xs text-ink-muted uppercase tracking-tight">Step Control</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-accent">Fast</p>
              <p className="text-[10px] sm:text-xs text-ink-muted uppercase tracking-tight">Visual Engine</p>
            </div>
          </div>
        </div>

        {/* Right Side: High-fidelity App Sorter Simulation */}
        <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
          <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-fadeIn mx-2 sm:mx-0">
            <div className="border-b border-border px-5 py-4 bg-surface/50 flex justify-between items-center">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Live Simulation</span>
            </div>

            <div className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ink tracking-wide">Bubble Sort Simulator</span>
                <span className="text-[11px] text-accent font-medium bg-accent/15 px-2 py-0.5 rounded-full animate-pulse">
                  Live Engine
                </span>
              </div>

              {/* Exact App-Fidelity Visualizer Row */}
              <div className="overflow-x-auto py-3 px-1 border border-dashed border-border rounded-xl bg-bg/40 flex justify-center">
                <div className="w-fit">
                  <div className="grid w-fit grid-rows-2" style={{ gridTemplateColumns: `repeat(${demoArray.length}, auto)` }}>
                    {/* Index row */}
                    {demoArray.map((_, idx) => (
                      <div key={`idx-${idx}`} className="flex h-6 w-12 shrink-0 items-center justify-center text-[10px] font-mono text-ink-muted">
                        {idx}
                      </div>
                    ))}

                    {/* Cells row */}
                    {demoArray.map((val, idx) => {
                      const isComparing = idx === firstEle || idx === secondEle;
                      const isSorted = sortedIndices.includes(idx);

                      let cellStyle = {};
                      let customClasses = "border-borderStrong bg-surface text-ink";

                      if (isComparing) {
                        cellStyle = {
                          backgroundColor: isGreater ? "rgb(var(--color-swapping))" : "rgb(var(--color-comparing))",
                          borderColor: isGreater ? "rgb(var(--color-swapping))" : "rgb(var(--color-comparing))",
                          color: isGreater ? "rgb(var(--color-swapping-text))" : "rgb(var(--color-comparing-text))",
                        };
                        customClasses = "!font-bold";
                      } else if (isSorted) {
                        customClasses = "!border-sorted !bg-sorted/10 !text-sorted";
                      }

                      return (
                        <div
                          key={`cell-${idx}`}
                          style={cellStyle}
                          className={`arrayDiv h-10 w-12 shrink-0 font-semibold border rounded-md flex items-center justify-center text-xs transition-all duration-300 mx-0.5 ${customClasses}`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step Message / Log */}
              <div className="rounded-lg border border-border bg-bg/80 px-3 py-2 text-[11px] sm:text-xs leading-relaxed text-ink-secondary min-h-[40px] flex items-center">
                <p className="font-mono text-center w-full">⚡ {stepMessage}</p>
              </div>

              {/* Navigation Action replacing non-working buttons */}
              <Link
                to="/bubble-sort"
                className="w-full py-2.5 px-4 text-center text-xs sm:text-sm font-semibold bg-accent text-white rounded-lg shadow-lg shadow-accent/15 hover:shadow-accent/30 hover:filter hover:brightness-105 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
              >
                <span>Launch Bubble Sort Visualizer</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          HOW IT WORKS / LEGEND ROW
      ================================================= */}
      <div className="max-w-7xl mx-auto w-full mt-16 lg:mt-24">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
          The Simulator Visual Language
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Comparing Elements", colorBg: "bg-comparing", text: "Evaluating relationship or condition", border: "border-comparing" },
            { label: "Swapping Elements", colorBg: "bg-swapping", text: "Exchanging memory slots/positions", border: "border-swapping" },
            { label: "Sorted / Finished", colorBg: "bg-sorted", text: "Successfully organized elements", border: "border-sorted" },
            { label: "Landmark / Pivot", colorBg: "bg-pivot", text: "Active pointer reference or pivot element", border: "border-pivot" },
          ].map((legend, index) => (
            <div key={index} className="bg-surface border border-border rounded-xl p-4 flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded ${legend.colorBg} ${legend.border} border`}></span>
                <span className="font-semibold text-xs sm:text-sm">{legend.label}</span>
              </div>
              <p className="text-[11px] text-ink-secondary leading-normal">{legend.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =================================================
          CATEGORIES / MODULES GRID
      ================================================= */}
      <div id="categories" className="max-w-7xl mx-auto w-full mt-16 lg:mt-24 mb-12">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Interactive Modules
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto">
            Choose a data structure or algorithm category below to launch its visualizer canvas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Array Operations",
              desc: "Contiguous, index-based collections. Compare Static arrays (fixed capacity) versus Dynamic arrays (automatic scaling & expansion).",
              path: "/array-operations",
              icon: (
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ),
              previewBlocks: ["15", "22", "12", "56"],
            },
            {
              title: "Linked Lists",
              desc: "Node chains connected with dynamic memory references. Step through Singly and Doubly Linked Lists insertion and deletion pointers.",
              path: "/linked-list-operations",
              icon: (
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              ),
              previewBlocks: ["Head", "→", "Node A", "→", "Tail"],
            },
            {
              title: "Searching Algorithms",
              desc: "Look up elements dynamically. Contrast Linear Search scanning index-by-index versus logarithmic Binary Search split logic.",
              path: "/linear-search",
              icon: (
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              previewBlocks: ["L=0", "•", "Mid", "•", "H=N"],
            },
            {
              title: "Sorting Algorithms",
              desc: "Master classical arrangements. Watch Bubble, Selection, Merge, and Quick Sort reorganize element values in real-time.",
              path: "/bubble-sort",
              icon: (
                <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              previewBlocks: ["Swap", "⇌", "Compare", "✓"],
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="bg-surface hover:bg-surface/80 border border-border hover:border-accent/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <div className="p-2 bg-accent/5 w-fit rounded-lg border border-accent/10 group-hover:bg-accent/10 transition-colors">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <span>{item.title}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-accent group-hover:translate-x-1 duration-300">→</span>
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Wireframe miniature elements inside card footer */}
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-center space-x-1.5 text-[9px] font-mono text-ink-muted">
                {item.previewBlocks.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className={`px-1.5 py-0.5 border border-border/80 rounded bg-element/20 font-medium ${
                      b === "→" || b === "⇌" ? "border-transparent bg-transparent" : ""
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
