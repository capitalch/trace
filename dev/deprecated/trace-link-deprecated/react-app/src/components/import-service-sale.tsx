import { useSharedElements } from '../shared-elements-hook'
import { useImportServiceSale, useStyles } from './import-service-sale-hook'
import { DateRangeSelector } from './date-range-selector'

function ImportSericeSale() {
    const { arbitraryData, DialogBox, TitleAndContinue } = useImportServiceSale()
    const {
        Button,
        DataTable,
        IconButton,
        InputAdornment,
        SearchIcon,
        Typography,
        TextField,
    } = useSharedElements()

    const classes = useStyles()
    return (
        <div className={classes.content}>
            <TitleAndContinue arbitraryDataCurrent={arbitraryData.current} />
            <DateRangeSelector arbitraryDataCurrent={arbitraryData.current} />
            <DialogBox arbitraryDataCurrent={arbitraryData.current}  />
        </div>
    )
}

export { ImportSericeSale }
