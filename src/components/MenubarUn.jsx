import React from 'react'
import { Link } from 'react-router-dom';

export default function MenubarUn() {
  return (
    <div className='hidden lg:block w-16p h-screen pt-4 pl-3 text-base font-medium border-r-2 drop-shadow-sm'>
        <p className='text-2xl font-serif font-bold text-center mb-7 mt-1'>DSA Visualizer</p>
          <div className='rounded-tl w-full h-full p-2 divider'>
            {/* <div className='w-full p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md'> */}
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/arrayOp">
                {/* <img src={homeImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Array
            </Link> 
            {/* </div> */}
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/listOp">
                {/* <img src={calenderImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Linked List
            </Link>
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/linSearch">
                {/* <img src={routineImage} className='mb-1 mr-1 mb-2' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Linear Search
            </Link>  
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/binSearch">
                {/* <img src={addTaskImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/>Add New Task */}
                Binary Search
            </Link>
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/bubbleSort">
                {/* <img src={updateTaskImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Bubble sort
            </Link>
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/mergeSort">
                {/* <img src={weeklyImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Merge Sort
            </Link>   
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/quickSort">
                {/* <img src={monthlyImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Quick sort
            </Link> 
            <hr className='border-gray-300 mr-5 my-[2px]'/>
            <Link className='w-full block p-1 pl-2 hover:bg-emerald-100 rounded-r-3xl rounded-l-md' to="/selecionSort">
                {/* <img src={resetTaskImage} className='mb-1 mr-1' style={{height: '20px', width: '20px', display: 'inline'}}/> */}
                Selection sort
            </Link> 
          </div>
          
          
        </div>
  )
}
