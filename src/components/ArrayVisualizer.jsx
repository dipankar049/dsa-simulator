// // src/components/ArrayVisualizer.js

// import React, { useState } from 'react';

// const ArrayVisualizer = () => {
//   const [array, setArray] = useState([]);
//   const [newElement, setNewElement] = useState('');

//   const addElement = () => {
//     if (newElement) {
//       setArray(prevArray => [...prevArray, newElement]);
//       setNewElement('');
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Array Insertion Visualizer</h1>
      
//       <div className="flex mb-4">
//         <input
//           type="text"
//           value={newElement}
//           onChange={(e) => setNewElement(e.target.value)}
//           className="border border-gray-300 rounded-l-md px-4 py-2 w-full"
//           placeholder="Enter element"
//         />
//         <button
//           onClick={addElement}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
//         >
//           Add
//         </button>
//       </div>
      
//       <div className="flex flex-wrap gap-2">
//         {array.map((item, index) => (
//           <div
//             key={index}
//             className="bg-green-200 text-green-800 px-4 py-2 rounded-md transition-transform transform"
//             style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
//           >
//             {item}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ArrayVisualizer;
