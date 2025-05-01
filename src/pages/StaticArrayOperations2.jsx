import React, { useState, useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TopicCard from '../components/TopicCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrayComponent from '../components/ArrayComponent';

const StaticArrayOperations2 = () => {
    const arrayRef = useRef();
    const [arrayInputs, setArrayInputs] = useState({    // To track inputs
        arrayLength: '',
        customIdx: '',
        element: ''
    });

    //  Handle input field changes
    const handleChange = (e) => {
        setArrayInputs({
            ...arrayInputs,
            [e.target.name]: e.target.value
        })
    };

    return (
        <div className='p-2p bg-white text-gray-700 
                        dark:bg-gray-700 dark:text-white 
                        md:text-base sm:text-sm text-xs'
        >

            <TopicCard topicName="Array" /> {/* Defination and Example of array */}
            <TopicCard topicName="Static Array" />  {/* Defination and Example of static array */}
            <div className='w-full mb-2'>
                <div className="flex justify-between mb-4 w-full sm:text-base text-sm">
                    <div className='mr-2'>
                        <input
                            name='arrayLength'
                            type="number"
                            value={arrayInputs.arrayLength}
                            min={1}
                            onChange={handleChange}
                            className=" md:p-2 p-1 h-fit w-40p rounded-l-md shadow-inner"
                            // style={{border: `${emptyLength ? '2px solid red' : '1px solid #d1d5db'}`}}
                            style={{ border: '1px solid #d1d5db' }}
                            placeholder="Length"
                        />
                        <button
                            onClick={() => arrayRef.current.createArray()}
                            className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                        >
                            Create New array
                        </button>
                    </div>
                    <div className='flex flex-wrap justify-end text-black'>
                        <input
                            name='element'
                            type="number"
                            value={arrayInputs.element}
                            onChange={handleChange}
                            className="md:p-2 p-1 h-fit w-36p rounded-l-md shadow-inner"
                            // style={{border: `${emptyElement ? '2px solid red' : '1px solid #d1d5db'}`}}
                            style={{ border: '1px solid #d1d5db' }}
                            placeholder="Enter element"
                        />
                        <input
                            name='customIdx'
                            type="number"
                            min={0}
                            value={arrayInputs.customIdx}
                            onChange={handleChange}
                            className="md:p-2 p-1 h-fit w-36p shadow-inner"
                            // style={{border: `${emptyInex ? '2px solid red' : '1px solid #d1d5db'}`}}
                            style={{ border: '1px solid #d1d5db' }}
                            placeholder="Enter index"
                        />
                        <button
                            onClick={async () => {
                                await arrayRef.current.arrayInsert();
                                setArrayInputs(prev => ({ ...prev, element: '', customIdx: '' }));
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 h-fit rounded-r-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                        >
                            Insert
                        </button>
                    </div>

                </div>
                <ArrayComponent
                    // newArray={array}
                    arrayInputs={arrayInputs}
                    ref={arrayRef}
                />
                <div className='flex flex-wrap justify-between'>
                    <button
                        onClick={async () => {
                            await arrayRef.current.deleteByIdx();
                            setArrayInputs({ ...arrayInputs, customIdx: '' });
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                    >
                        Delete by index
                    </button>
                    <button
                        onClick={async () => {
                            await arrayRef.current.deleteByEle();
                            setArrayInputs({ ...arrayInputs, element: '' });
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white lg:font-bold md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                    >
                        Delete by element
                    </button>
                    <button
                        onClick={async () => {
                            await arrayRef.current.removeArray();
                            setArrayInputs({ ...arrayInputs, arrayLength: '' });
                        }}
                        className="border sm:border-2 border-red-500 text-red-500 sm:font-bold hover:bg-red-500 hover:text-white md:p-2 p-1 md:m-0 my-1 h-fit rounded-md transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-102 shadow-xl"
                    >
                        Delete array
                    </button>
                </div>

            </div>
            <TopicCard topicName="Real-life Use(Static Array)" /> {/* Real-life use and Example of static array */}
        </div>
    );
};

export default StaticArrayOperations2;