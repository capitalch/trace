import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'
import { useShipTo } from './ship-to-hook'

function ShipTo() {
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { handleNewClicked, meta } = useShipTo()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1,p:1, border: '1px solid lightGrey' }}>
            <Typography variant='subtitle2'>Ship to</Typography>
            <Box sx={{ display: 'flex' }}>
                <Button size='small' color='secondary' variant='outlined' onClick={handleNewClicked} >New / Edit</Button>
                <Button size='small' color='secondary' variant='outlined' sx={{ ml: 2 }}>Clear</Button>
            </Box>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { ShipTo }