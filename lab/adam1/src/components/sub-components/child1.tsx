import { useEffect, useState, } from 'react'
import { Child11 } from './child11'

function Child1({prop1}:any) {
  useEffect(() => {
    console.log('Child1 useEffect first time')
  }, [prop1])

  useEffect(() => {
    console.log('Child1 useEffect all time')
  })

  return (
    <div>
      Child1
      <Child11 />
    </div>
  )
}
export { Child1 }