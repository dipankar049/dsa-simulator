import React from 'react'
import { Link } from 'react-router-dom';

export default function MenubarUn() {
    return (
      <div className="fixed hidden lg:w-1/5 md:block h-screen bg-white pt-4 pl-3 text-base font-medium border-r-2 border-gray-300 drop-shadow-sm dark:bg-gray-800">
   
        {/* Menu Items */}
        <div className="rounded-tl w-full h-full p-2 space-y-1 dark:text-white">
          <MenuItem label="Array" to="/arrayOp" />
          <MenuItem label="Linked List" to="/listOp" />
          <MenuItem label="Linear Search" to="/linSearch" />
          <MenuItem label="Binary Search" to="/binSearch" />
          <MenuItem label="Bubble Sort" to="/bubbleSort" />
          <MenuItem label="Merge Sort" to="/mergeSort" />
          <MenuItem label="Quick Sort" to="/quickSort" />
          <MenuItem label="Selection Sort" to="/selecionSort" />
        </div>
      </div>
    );
  }
  
  // Reusable MenuItem Component
  const MenuItem = ({ label, to }) => (
    <>
      <Link
        to={to}
        className="block w-full p-2 pl-4 text-gray-800 rounded-r-3xl rounded-l-md hover:bg-blue-200 hover:text-blue-600 dark:text-white dark:hover:text-blue-600"
      >
        {label}
      </Link>
      <hr className="border-gray-300 mx-3 my-1" />
    </>
  );