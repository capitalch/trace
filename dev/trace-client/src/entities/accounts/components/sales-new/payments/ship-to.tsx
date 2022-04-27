import { _, Avatar, Box, Button, CloseSharp, FormControlLabel, IconButton, IMegaData, LedgerSubledger, ListItem, ListItemAvatar, ListItemText, MegaDataContext, NumberFormat, Radio, RadioGroup, TextField, useIbuki, useTraceMaterialComponents, Typography, useContext, useEffect, useRef, useState, useTheme, utils, utilMethods } from '../redirect'
import { useShipTo } from './ship-to-hook'

function ShipTo() {
    const theme = useTheme()
    const { BasicMaterialDialog } = useTraceMaterialComponents()
    const {allErrors, checkAllErrors, getShipToAsString, handleClear, handleNewClicked, meta } = useShipTo()
    checkAllErrors()

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',mt:1 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 'bold', textDecoration:'underline' }}>Ship to</Typography>
            <Typography sx={{
                border: '1px solid lightGrey', pl: 1,
                borderColor: allErrors['shipToError'] ? theme.palette.error.light : 'lightgrey',
                fontSize: theme.spacing(1.6), ml: 2, mr: 2, height: theme.spacing(3),
                maxWidth: theme.spacing(55), width: theme.spacing(30), overflow: 'hidden', color: theme.palette.common.black,
            }}>{getShipToAsString()}</Typography>
            <Box sx={{ display: 'flex' }}>
                <Button sx={{ mr: 2 }} size='small' color='secondary' variant='outlined' onClick={handleClear}>Clear ship to</Button>
                <Button size='small' color='secondary' variant='outlined' onClick={handleNewClicked} >New / Edit</Button>
            </Box>
            <BasicMaterialDialog parentMeta={meta} />
        </Box>)
}

export { ShipTo }