import { useState } from 'react'
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
        Button,
        CloseIcon,
        IconButton,
        InputAdornment,
        SearchIcon,
        TextField,
        TraceDialog,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <TextField
                className="purchase-invoice"
                label="Purchase invoice"
                disabled={true}
                InputProps={{
                    endAdornment: (
                        <>
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClear}>
                                    {<CloseIcon></CloseIcon>}
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={handleSearchInvoice}>
                                    <SearchIcon /> Select
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
