import { useEffect, useRef, useState, } from 'react'
import { Child11 } from './child11'

function Child1({prop1}:any) {
  const [, setRefresh] = useState({})
    const meta: any = useRef({
    counter: 0
  })

  useEffect(() => {
    console.log('Child1 useEffect first time')
    return (() => {
      console.log('unmounted child1')
    })
  }, [])

  useEffect(() => {
    console.log('Child1 useEffect all time')
    return (() => {
      console.log('unmounted child1')
    })
  })

  return (
    <div>
      Child1
      <button onClick={() => {
        meta.current.counter = meta.current.counter + 1
        setRefresh({})
      }}>child1 incr counter and refresh</button>
      <button onClick={() => {
        console.log('counter child1:', meta.current.counter)
      }}>Button child1 log counter</button>
      <Child11 />
    </div>
  )
}
export { Child1 }