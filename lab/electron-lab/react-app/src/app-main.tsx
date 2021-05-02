import React from 'react';
import { InventoryExport } from './components/inventory-export';
import { useInventoryExport } from './components/inventory-export-hook'
function AppMain() {
    return (
        <div>
            <InventoryExport />
        </div>
    )
}

export { AppMain }