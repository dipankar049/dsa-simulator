import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MenubarUn({ isOpen, closeSidebar }) {
  const location = useLocation();

  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Array", to: "/arrayOp" },
    { label: "Linked List", to: "/listOp" },
    { label: "Linear Search", to: "/linSearch" },
    { label: "Binary Search", to: "/binSearch" },
    { label: "Bubble Sort", to: "/bubbleSort" },
    { label: "Merge Sort", to: "/mergeSort" },
    { label: "Quick Sort", to: "/quickSort" },
    { label: "Selection Sort", to: "/selecionSort" },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block fixed w-1/5 h-screen bg-white pt-4 pl-3 border-r-2 border-gray-300 drop-shadow-sm dark:bg-gray-800 dark:text-white">
        <div className="p-2 space-y-1">
          {menuItems.map(({ label, to }) => (
            <MenuItem key={to} label={label} to={to} />
          ))}
        </div>
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed z-40 top-16 left-0 w-4/5 max-w-xs h-full bg-white border-r border-gray-300 shadow-lg md:hidden dark:bg-gray-800 dark:text-white transition-all">
          <div className="p-2 space-y-1">
            {menuItems.map(({ label, to }) => (
              <MenuItem key={to} label={label} to={to} onClick={closeSidebar} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const MenuItem = ({ label, to, onClick }) => (
  <>
    <Link
      to={to}
      className="block w-full p-2 pl-4 text-gray-800 rounded-r-3xl rounded-l-md hover:bg-blue-200 hover:text-blue-600 dark:hover:text-blue-600"
      onClick={onClick}
    >
      {label}
    </Link>
    <hr className="border-gray-300 mx-3 my-1" />
  </>
);
