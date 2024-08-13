
// import './App.css'
import StaticArrayOperations from './components/StaticArrayOperations'
import DynamicArrayOperations from './components/DynamicArrayOperations'
import MenubarUn from './components/MenubarUn'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <div className='flex w-full h-full'>
      <MenubarUn />
      <div className='w-full'>
        <Navbar/>
        <div className="h-full">
          {/* <ArrayVisualizer /> */}
          <StaticArrayOperations/>
          <hr className="border-black border-1"></hr>
          <DynamicArrayOperations />
        </div>
      </div>
    </div>
    </BrowserRouter>
  )
}

export default App
