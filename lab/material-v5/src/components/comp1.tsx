import { Box, Button } from '@mui/material'
import { useTheme} from '@mui/material/styles'

function Comp1({ props }: any) {
    const theme:any = useTheme()
    return (<Box sx={classes.class1}>
        <Button variant='contained' sx={{ color: theme.palette.neutral1.main }}>First</Button>
        <Button sx={{ backgroundColor: { xs: 'secondary.dark', sm: "#0000ff", xl: 'red' } }}>Second</Button>
    </Box>)
}

export { Comp1 }

const classes = {
    class1: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

}