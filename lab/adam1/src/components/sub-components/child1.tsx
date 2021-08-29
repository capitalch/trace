import React, { useState, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Child11 } from "./child11";
// import { myAtom, myAtomObj,myCheckCounter } from "../component10";
function Child1() {
  // const [counter, setCounter] = useRecoilState(myAtom)
  // const [counterObj, setCounterObj] = useRecoilState(myAtomObj)

  // const checkCount = useRecoilValue(myCheckCounter)
  return (
    <div>
      <label>This is child1</label>
      <div>
        {/* Counter1: {counter} */}
        {/* CounterObj: {counterObj.count} */}
        <button
          onClick={(e) => {
            // const cnt = counter  + 1;
            // setCounter(cnt);
          }}
        >
          
          Incr1
        </button>
        <button
            onClick={()=>{
                // let obj = JSON.parse(JSON.stringify(counterObj)) 
                // obj.count = obj.count+1
                // setCounterObj(obj)
            }}
        >Incr obj1</button>
      </div>
      <Child11 />
    </div>
  );
}

export { Child1 };
