
// import './App.css'
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

function App() {

  return (
    <BrowserRouter>
    <div className='flex w-full h-fit'> 
      <MenubarUn />
      <div className='w-full'>
        <Navbar/>
        <div className="h-full w-full"> 
          {/* <ArrayVisualizer /> */}
          {/* <StaticArrayOperations/>
          <hr className="border-black border-1"></hr>
          <DynamicArrayOperations /> */} 
          
          <Routes>
            {/* <Route path="/" element={<TaskManagerHome2 ref={childARef}/>} /> */}
            <Route path="/arrayOp" element={<><StaticArrayOperations/><DynamicArrayOperations /></>} />
            <Route path="/listOp" element={<><LinkedlistOperations2 /><DoublyLinkedlistOperations/></>} />
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
  )
}

export default App
