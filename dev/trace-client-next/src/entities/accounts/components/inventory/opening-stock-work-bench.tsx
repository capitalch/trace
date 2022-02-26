import { useSharedElements } from "../common/shared-elements-hook"
import { NumberFormat, } from '../../../../imports/regular-imports'
import {
    Box,
    Button,
    Card,
    Input,
    TextField,
    Theme,
    Typography,
    useTheme,
} from '../../../../imports/gui-imports'
import { useOpeningStockWorkBench } from "./opening-stock-work-bench-hook"

function OpeningStockWorkBench() {
    const { getFromBag, ReactSelect } = useSharedElements()
    const theme = useTheme()
    const stock = getFromBag('stock')
    const categories = stock?.categories || []
    const brands = stock?.brands || []
    const products = stock?.products || []
    // To reduce space between two items of drop down
    const style1 = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
        }),
        control: (provided: any) => ({
            ...provided,
            width: '350px',
        })
    }
    const style2 = {
        
    }

    const style3 = {
        control: (provided: any) => ({
            ...provided,
            width: '300px',
        })
    }
    // const {} = useOpeningStockWorkBench()
    return (<Box >
        {/* sx={{ display: 'flex', border: '4px solid green', flexDirection: 'column', mt: 1, mb: 3, p: 3 }} */}
        <Box sx={{ display: 'flex', border: '4px solid green', rowGap: 3, flexDirection: 'column',  p: 3, w:30 }}>
            <ReactSelect options={categories} maxMenuHeight={250} placeholder='Category'
                menuPlacement="auto" styles={style1} />
            <ReactSelect options={brands} maxMenuHeight={250} placeholder='Brand'
                menuPlacement="auto" styles={style1} />
            <ReactSelect options={[]} maxMenuHeight={250} placeholder='Product label'
                menuPlacement="auto" styles={style1} />


            <NumberFormat
                placeholder="Qty"
                sx={{ width: theme.spacing(8), '& input': { textAlign: 'center' },  }}
                // variant='standard'
                allowNegative={false}
                {...{ label: 'Qty' }}
                error={true}
                className=""
                customInput={Input}
                decimalScale={2}
                fixedDecimalScale={true}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onBlur={() => {

                }}
                // error={item.gst.rate > 30 ? true : false}
                onValueChange={(values: any) => {

                }}
                thousandSeparator={true}
            // value={item.gst.rate || 0.0}
            />
            <NumberFormat
                placeholder="Opening price"
                sx={{ width: theme.spacing(14), '& input': { textAlign: 'center' },  }}
                // variant='standard'
                allowNegative={false}
                {...{ label: 'Opening price' }}
                error={true}
                className=""

                customInput={Input}
                decimalScale={2}
                fixedDecimalScale={true}
                onFocus={(e: any) => {
                    e.target.select()
                }}
                onBlur={() => {

                }}
                // error={item.gst.rate > 30 ? true : false}
                onValueChange={(values: any) => {

                }}
                thousandSeparator={true}
            // value={item.gst.rate || 0.0}
            />
            <TextField
            error={true}
                // error={isInvalidDate(arbitraryData.header.tranDate)}
                sx={{}}
                variant='standard'
                placeholder="Last pur date"
                helperText='Last pur date'
                // label='jkjkjkk'
                // helperText={
                //     isInvalidDate(arbitraryData.header.tranDate)
                //         ? accountsMessages.dateRangeAuditLockMessage
                //         : undefined
                // }
                type="date"
                // onChange={(e: any) => {
                //     arbitraryData.header.tranDate = e.target.value
                //     emit('CROWN-REFRESH', '')
                //     setRefresh({})
                // }}
                onFocus={(e: any) => e.target.select()}
            // value={arbitraryData.header.tranDate || ''}
            />
            <Button variant="contained" color="success" size='medium' >
                Submit
            </Button>
            <Button variant="contained" color="warning" size='medium'>
                Reset
            </Button>
            <Button variant="contained" color="info" size='medium' >
                New product
            </Button>
        </Box>
    </Box>)
}

export { OpeningStockWorkBench }