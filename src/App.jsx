import { useState } from 'react';
import StaticArrayOperations from './pages/StaticArrayOperations';
import DynamicArrayOperations from './pages/DynamicArrayOperations'
import MenubarUn from './components/MenubarUn'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoublyLinkedlistOperations from './pages/DoublyLinkedlistOperations';
import BinarySearch from './pages/BinarySearch';
import BubbleSort from './pages/BubbleSort';
import SelectionSort from './pages/SelecionSort';
import MergeSort from './pages/MergeSort';
import QuickSort from './pages/QuickSort';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import { DetailsProvider } from './context/DetailsContext';
import { ToastContainer } from 'react-toastify';
import { ThemeContext } from './context/ThemeContext';
import { useContext } from 'react';
import "./components/styles/globals.css";
import LinearSearch from './pages/LinearSearch';
import SinglyLinkedList from './pages/LinkedlistOperations2';
import './App.css';
import StaticArrayNew from './pages/StaticArrayNew';

function App() {
  const { theme } = useContext(ThemeContext);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChangeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <DetailsProvider>   {/* To track if different summery tags are open or closed by user */}
      <BrowserRouter>
        {/* configure React toastify container */}
        <ToastContainer
          limit={3}
          autoClose={3000}
          newestOnTop={true}
          pauseOnHover
          theme={theme}
          pauseOnFocusLoss
        />
        <div className="w-full h-[100vh] bg-gray-100 dark:bg-gray-900">
          <Header toggleSidebar={toggleSidebar} changeLanguage={handleChangeLanguage} />

          <div className="w-full flex pt-16">
            <MenubarUn isOpen={sidebarOpen} closeSidebar={closeSidebar} />  {/* Left Menubar */}

            <div className="relative w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 md:text-base sm:text-sm text-xs md:ml-[20%]">
              <Routes>
                <Route path="/" element={<HomePage language={language} />} />

                {/* ------------------------------- Array & Linkedlist operations ------------------------------- */}
                <Route path="/arrayOp" element={<><StaticArrayOperations /><DynamicArrayOperations /></>} />
                <Route path="/listOp" element={<><SinglyLinkedList /><DoublyLinkedlistOperations /></>} />

                {/* ------------------------------- Searching operations ------------------------------- */}
                <Route path="/linSearch" element={<LinearSearch />} />
                <Route path="/binSearch" element={<BinarySearch />} />

                {/* ------------------------------- Sorting operations ------------------------------- */}
                <Route path="/bubbleSort" element={<BubbleSort />} />
                <Route path="/mergeSort" element={<MergeSort />} />
                <Route path="/quickSort" element={<QuickSort />} />
                <Route path="/selecionSort" element={<SelectionSort />} />

                {/* ------------------------------- others ------------------------------- */}
                <Route path="/staticArray2.0" element={<StaticArrayNew />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </DetailsProvider>
  );
}

export default App;