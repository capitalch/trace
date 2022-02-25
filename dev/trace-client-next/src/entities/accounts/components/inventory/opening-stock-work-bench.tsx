import { useSharedElements } from "../common/shared-elements-hook"
import {
    Box,
    Card,
    TextField,
    Theme,
    Typography,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { useOpeningStockWorkBench } from "./opening-stock-work-bench-hook"

function OpeningStockWorkBench() {
    const { getFromBag, ReactSelect } = useSharedElements()
    const stock = getFromBag('stock')
    const categories = stock?.categories || []
    const brands = stock?.brands || []
    const products = stock?.products || []
    // To reduce space between two items of drop down
    const styles = {
        option: (base: any) => ({
            ...base,
            padding: '.1rem',
            paddingLeft: '0.5rem',
            // width: '20rem'
        }),
        // control:()=>({
        //     // width: 100,
        // })
    }
    // const {} = useOpeningStockWorkBench()
    return (<Box sx={{ display: 'flex', border: '4px solid green', flexDirection: 'column', mt: 1, mb: 3, p: 3 }}>
        <Box></Box>
        <Box sx={{ display: 'flex', columnGap: 1 }}>
            <ReactSelect options={categories} maxMenuHeight={250} placeholder='Category'
                menuPlacement="auto" styles={styles}   />
            <ReactSelect options={brands} maxMenuHeight={250} placeholder='Brand'
                menuPlacement="auto" />
            <ReactSelect options={[]} maxMenuHeight={250} placeholder='Product label'
                menuPlacement="auto" />
        </Box>
    </Box>)
}

export { OpeningStockWorkBench }