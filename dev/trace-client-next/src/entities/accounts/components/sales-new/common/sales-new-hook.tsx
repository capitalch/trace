import { _, Badge, Big, Box, Button, Card, Checkbox, Chip, CloseSharp, FormControlLabel, IconButton, IMegaData, InputAdornment, MegaDataContext, moment, NumberFormat, Radio, RadioGroup, Search, TextField, Typography, useContext, useEffect, useRef, useState, useTheme } from '../redirect'
import { utilMethods } from '../redirect'
function useSalesNew() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    
    useEffect(() => {
        megaData.registerKeyWithMethod('render:salesNew', setRefresh)
    }, [])

}
export { useSalesNew }