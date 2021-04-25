import react from 'react'
import { useSharedElements } from '../shared-elements-hook'
import { useTopMenu, useStyles } from './top-menu-hook'

function TopMenu() {
    const { handleButtonClick, meta, setRefresh } = useTopMenu()
    const { Button } = useSharedElements()
    const classes = useStyles()
    return (
        <div className={classes.content}>
            <Button
                className="menu-button"
                onClick={(e) => {
                    handleButtonClick('trackSaleSms')
                }}>
                Track+ sale SMS
            </Button>
            <Button
                className="menu-button"
                onClick={(e) => {
                    handleButtonClick('trackSaleImport')
                }}>
                Track+ sale import
            </Button>
            <Button
                className="menu-button"
                onClick={(e) => {
                    handleButtonClick('serviceSaleImport')
                }}>
                Service+ sale import
            </Button>
        </div>
    )
}

export { TopMenu }
