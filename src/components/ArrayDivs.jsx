import React from 'react'

export default function ArrayDivs() {
  return (
    <div>
        {array.map((item, index) => (
            <div
            id={item}
            key={index}
            ref={divRefs.current[index]}
            className="border border-black rounded-sm flex justify-center md:w-12 lg:w-14 w-10 md:px-2 px-1 py-1 mt-1 flex-shrink-0 overflow-hidden whitespace-nowrap animate-fadeIn"
            // style={{ transform: `translateX(${index * 10}px)`, transition: 'transform 0.3s' }}
            style={{
                color: operationIdxVisibility ? ((index === parseInt(arrayInputs.customIdx)) ? 'red' : 'black') : 'black',
                backgroundColor: operationIdxVisibility ? ((index === parseInt(arrayInputs.customIdx)) ? 'white' : '#6ee7b7') : '#6ee7b7',
                animationDelay: `${index * 0.2}s`, // Stagger the delay by 0.2s per item
                animationFillMode: 'both' // Ensures the element stays visible after the animation ends 
            }}
            >
            {item}
            </div>
        ))}
    </div>
  )
}
