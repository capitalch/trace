import { useEffect, useState, } from 'react'

function Child11() {
  useEffect(() => {
    console.log('Child11 useEffect first time')
  }, [])

  useEffect(() => {
    console.log('Child11 useEffect all time')
  })
  return (
    <div>
      Child11
    </div>
  );
}

export { Child11 };
