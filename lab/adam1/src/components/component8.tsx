import { useIbuki } from '../utils/ibuki'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'

function Component8({ref}:any) {
    useEffect(() => {}, [])
    const { emit } = useIbuki()
    const componentRef: any = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })


    return (
        <div ref={ref}>
            <div style={{ display: 'none' }}>
                <div ref={componentRef}>
                    <div
                        style={{
                            padding: '15px',
                            backgroundColor: 'yellow',
                        }}>
                        Component8
                    </div>
                    <div>Children of component8</div>
                </div>
            </div>
            <button
                onClick={
                    handlePrint
                    // () => {
                    //     emit('PDF-PRINT', 'abcd')
                    // }
                }>
                React print
            </button>
        </div>
    )
}
export { Component8 }
