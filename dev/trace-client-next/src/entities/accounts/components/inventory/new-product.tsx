import { useSharedElements } from '../common/shared-elements-hook'
import { useNewProduct, useStyles } from './new-product-hook'
import { Button, IconButton } from '../../../../imports/gui-imports'
import { AddCircle } from '../../../../imports/icons-import'
function NewProduct({ isIconButton }: any) {
    const classes = useStyles()
    const { handleAdd, meta } = useNewProduct()

    const { TraceDialog } = useSharedElements()

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
