import React, { useState, useEffect, useRef } from 'react'
// import { myAtom } from "../component10";
import { useRecoilState, useRecoilValue } from "recoil";

function Child22(){
    // const counter = useRecoilValue(myAtom)
    return(
        <div>
            {/* <label>This is child22</label> */}
            {/* Counter22: {counter} */}
        </div>
    )
}

export {Child22}