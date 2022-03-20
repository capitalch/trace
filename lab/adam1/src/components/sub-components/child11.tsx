import { useRef, useEffect, useState, } from 'react'

function Child11() {
  const [, setRefresh] = useState({})
  const meta: any = useRef({
    counter: 0
  })
  useEffect(() => {
    console.log('Child11 useEffect first time')
  }, [])

  useEffect(() => {
    console.log('Child11 useEffect all time')
  })
  return (
    <div>
      Child11
      <button onClick={() => {
        meta.current.counter = meta.current.counter + 1
        setRefresh({})
      }}>child11 incr counter and refresh</button>
      <button onClick={() => {
        console.log('counter child11:', meta.current.counter)
      }}>Button child11 log counter</button>
    </div>
  );
}

export { Child11 };
