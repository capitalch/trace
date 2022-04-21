import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'
import { useShipTo } from './ship-to-hook'

function ShipTo() {
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const { handleClear, handleNewClicked, meta } = useShipTo()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, p: 1, border: '1px solid lightGrey' }}>
            <Typography variant='subtitle2'>Ship to</Typography>
            <Box sx={{ display: 'flex' }}>
                <Button sx={{ mr: 2 }} size='small' color='secondary' variant='outlined' onClick={handleClear}>Clear ship to</Button>
                <Button size='small' color='secondary' variant='outlined' onClick={handleNewClicked} >New / Edit</Button>
            </Box>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { ShipTo }