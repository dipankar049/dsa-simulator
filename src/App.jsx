import { useState } from 'react';
import StaticArrayOperations from './components/StaticArrayOperations'
import DynamicArrayOperations from './components/DynamicArrayOperations'
import MenubarUn from './components/MenubarUn'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LinkedlistOperations2 from './components/LinkedlistOperations2';
import DoublyLinkedlistOperations from './components/DoublyLinkedlistOperations';
import LinearSearch from './components/LinearSearch';
import BinarySearch from './components/BinarySearch';
import Respon from './components/Respon';
import BubbleSort from './components/BubbleSort';
import SelectionSort from './components/SelecionSort';
import MergeSort from './components/MergeSort';
import QuickSort from './components/QuickSort';
import HomePage from './components/HomePage';
import Header from './Header';
import { DetailsProvider } from './context/DetailsContext';
import { ThemeProvider } from './context/ThemeContext';

import "./components/styles/globals.css";

function App() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const handleChangeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  }

  return (
    <ThemeProvider>
    <DetailsProvider>
    <BrowserRouter>
      <div className="w-full h-screen bg-blue-50">
        <Header changeLanguage={handleChangeLanguage}/>

        <div className="w-full flex pt-16 sm:pt-12 lg:pt-16">
          <MenubarUn className/>

          <div className="w-full md:ml-20p">
            <Routes>
              <Route path="/" element={<HomePage language={language} />} />
              <Route path="/arrayOp" element={<><StaticArrayOperations /><DynamicArrayOperations /></>} />
              <Route path="/listOp" element={<><LinkedlistOperations2 /><DoublyLinkedlistOperations /></>} />
              <Route path="/linSearch" element={<LinearSearch />} />
              <Route path="/binSearch" element={<BinarySearch />} />
              <Route path="/bubbleSort" element={<BubbleSort />} />
              <Route path="/mergeSort" element={<MergeSort />} />
              <Route path="/quickSort" element={<QuickSort />} />
              <Route path="/selecionSort" element={<SelectionSort />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
    </DetailsProvider>
    </ThemeProvider>
  );
}

export default App
