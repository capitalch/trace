import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, List, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'

function ShipTo() {
    const theme = useTheme()
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Typography variant='subtitle2'>Ship to</Typography>
            <Box sx={{ display: 'flex' }}>
                <Button size='small' color='secondary' variant='outlined' >New / Edit</Button>
                <Button size='small'  color='secondary' variant='outlined' sx={{ml:2}}>Clear</Button>
            </Box>
        </Box>)
}

export { ShipTo }