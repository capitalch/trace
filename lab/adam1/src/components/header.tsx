import React from 'react'
import { useIbuki } from '../utils/ibuki'

const Header = () => {
    const { emit } = useIbuki()
    return <div>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component1')
        }}>Load component1</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component2')
        }}>Load component2</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component3')
        }}>Load component3</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component4')
        }}>Load component4</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component5')
        }}>Load component5</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component6')
        }}>Load component6</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component7')
        }}>Load component7</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component8')
        }}>Load component8</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component9')
        }}>Load component9</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component10')
        }}>Load component10</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component11')
        }}>Load component11</button><button onClick={e => {
            emit('LOAD-COMPONENT', 'component12')
        }}>Load component12</button>
        <button onClick={e => {
            emit('LOAD-COMPONENT', 'component13')
        }}>Load component13</button>
    </div>
}


export { Header }