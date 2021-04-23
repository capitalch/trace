import React, { useState, useRef, useEffect } from 'react'
import { useInventoryExport } from './inventory-export-hook'
function InventoryExport() {
    const {handleExport, meta } = useInventoryExport()
    const [, setRefresh] = useState({})
    return (
        <div>
            <span>Inventory export: </span>
            <input placeholder='Source DB' type='text' value={meta.current.sourceDb}
                onChange={(e: any) => {
                    meta.current.sourceDb = e.target.value
                    setRefresh({})
                }}
            />
            <input placeholder='Destination db' type='text' value={meta.current.destinationDb}
                onChange={(e: any) => {
                    meta.current.destinationDb = e.target.value
                    setRefresh({})
                }}
            />
            <button
                onClick={handleExport}
            >Start export</button>
        </div>)
}

export { InventoryExport }