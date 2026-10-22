"use client"

import {useState} from 'react';

export default function counter(){
    const[count, setCount] = useState(0);
    return(
        <>
            <div className="flex flex-col h-174 w-full bg-gradient-to-r from-pink-600 to-violet-800 items-center justify-center">
                <div className="flex flex-col h-72 bg-white w-120 rounded-3xl shadow-lg space-y-8 shadow-pink-1000/40 border-pink-800 items-center justify-center">
                <h1 className="font-extrabold text-7xl text-neutral-800">Count {count}</h1>
                <div className="flex-row space-x-4">
                <button className="bg-yellow-300 p-2 rounded-2xl font-semibold shadow-xs shadow-amber-100/20 border-amber-300 hover:scale-105 duration-100" onClick={()=>setCount(prev=>prev-1)}>Decrement</button>
                <button className="bg-red-500 p-2 rounded-2xl font-semibold shadow-xs shadow-red-100/20 border-red-500 hover:scale-105 duration-100" onClick={()=>setCount(0)}>Reset</button>
                <button className="bg-green-500 p-2 rounded-2xl font-semibold shadow-xs shadow-amber-100/20 border-green-500 hover:scale-105 duration-100" onClick={()=>setCount(prev=>prev+1)}>Increment</button>
                </div>
                </div>
            </div>
        </>
    )
}