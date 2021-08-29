import React, { useState, useEffect, useRef, useContext } from "react";
import { MyContext } from './my-context'

function Component10() {

  useEffect(() => {

  }, []);
  const user: any = useContext(MyContext)
  return (
    <div>
      <div>Component 10</div>
      <div>
        <span>Name:{user.name}</span>
        <span>Address:{user.address}</span>
      </div>
    </div >
  );
}

export { Component10 }
