import { useState } from 'react';
import StaticArrayOperations from './pages/StaticArrayOperations';
import DynamicArrayOperations from './pages/DynamicArrayOperations'
import MenubarUn from './components/MenubarUn'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DoublyLinkedlistOperations from './pages/DoublyLinkedlistOperations';
// import LinearSearch from './pages/LinearSearch2';
import BinarySearch from './pages/BinarySearch';
import Respon from './components/Respon';
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
    <DetailsProvider>
      <BrowserRouter>
        <ToastContainer
          limit={3}
          autoClose={3000}
          newestOnTop={true}
          pauseOnHover
          theme={theme}
          pauseOnFocusLoss
        />
        <div className="w-full h-screen bg-blue-50">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} changeLanguage={handleChangeLanguage} />

          <div className="w-full flex pt-16 sm:pt-12 lg:pt-16">
            <MenubarUn isOpen={sidebarOpen} closeSidebar={closeSidebar} />

            <div className="w-full md:ml-[20%]">
              <Routes>
                <Route path="/" element={<HomePage language={language} />} />
                <Route path="/arrayOp" element={<><StaticArrayOperations /><DynamicArrayOperations /></>} />
                <Route path="/listOp" element={<><SinglyLinkedList /><DoublyLinkedlistOperations /></>} />
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
  );
}

export default App;