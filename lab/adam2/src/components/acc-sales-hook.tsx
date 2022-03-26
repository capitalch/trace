import { Box, Button, FormControlLabel, MegaDataContext, Radio, TextField, Typography, useContext,useState, useTheme } from './redirect'

function useAccSales(){
    const [, setRefresh] = useState({})
    const megaData = useContext(MegaDataContext)
    const sales = megaData.accounts.sales

    function handleTextChanged( propName: string, e: any) {
        sales[propName] = e.target.value
        setRefresh({})
    }

    return({handleTextChanged})
}
export {useAccSales}