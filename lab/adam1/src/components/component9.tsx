import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import makeData from './makeData'
import {Component10} from './component10'
// import { Table1 } from './table1'

function Component9() {
    return(<div>
      <div>Component 9</div>
      <Component10 />
    </div>)
}

export { Component9 }


