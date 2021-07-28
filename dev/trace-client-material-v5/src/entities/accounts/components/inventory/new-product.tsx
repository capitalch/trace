import { useState,  } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useNewProduct, useStyles } from './new-product-hook'

function NewProduct({ isIconButton }: any) {    
    const classes = useStyles()
    const { handleAdd, meta } = useNewProduct()

    const {
        AddCircle,
        Button,
        IconButton,
        TraceDialog,
    } = useSharedElements()

    return (
        <span className={classes.content}>
            {isIconButton ? (
                <IconButton size="small" color="secondary" onClick={handleAdd}>
                    <AddCircle style={{ fontSize: '2rem' }} />
                </IconButton>
            ) : (
                <Button className="button" onClick={handleAdd}>
                    New product
                </Button>
            )}
            <TraceDialog meta={meta} />
        </span>
    )
}

export { NewProduct }
