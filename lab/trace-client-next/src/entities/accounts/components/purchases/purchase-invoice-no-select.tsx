import { useState } from '../../../../imports/regular-imports'
import {
    Button, TextField,
    IconButton,
    InputAdornment,
} from '../../../../imports/gui-imports'
import {
    CloseSharp,
    Search,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import {
    usePurchaseInvoiceNoSelect,
    useStyles,
} from './purchase-invoice-no-select-hook'

function PurchaseInvoiceNoSelect({ arbitraryData }: any) {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const {
        handleClear,
        handleSearchInvoice,
        meta,
    } = usePurchaseInvoiceNoSelect(arbitraryData)

    const {
        TraceDialog,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <TextField
                className="purchase-invoice"
                variant='standard'
                label="Purchase invoice"
                disabled={true}
                InputProps={{
                    endAdornment: (
                        <>
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClear}>
                                    {<CloseSharp></CloseSharp>}
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={handleSearchInvoice}>
                                    <Search /> Select
                                </Button>
                            </InputAdornment>
                        </>
                    ),
                }}
                value={arbitraryData.userRefNo}
            />
            <TraceDialog meta={meta} />
        </div>
    )
}

export { PurchaseInvoiceNoSelect }
