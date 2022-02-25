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

function WorkBench() {
    const {getFromBag,  } = useSharedElements()
    return(<Box sx = {{display:'flex', flexDirection:'column'}}>
        <Box></Box>
        <Box sx={{display:'flex'}}>

        </Box>
    </Box>)
}

export { WorkBench }