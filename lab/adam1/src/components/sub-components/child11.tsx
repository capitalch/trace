import React, { useState, useEffect, useRef } from "react";
import { myAtom, myAtomObj } from "../component10";
import { useRecoilState, useRecoilValue } from "recoil";

function Child11() {
    const counter= useRecoilValue(myAtom);
    const [counterObj,] = useRecoilState(myAtomObj)
    
  return (
    <div>
      <label>This is child11</label>
      <div>
          Counter11: {counter}
          {/* CounterObj11: {counterObj.count} */}
      </div>
    </div>
  );
}

export { Child11 };
