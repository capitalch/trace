import { _, IMegaData, MegaDataContext, useContext, useEffect, useState, } from './redirect'

function useSalesNew() {
    const [, setRefresh] = useState({})
    const megaData: IMegaData = useContext(MegaDataContext)
    
    useEffect(() => {
        megaData.registerKeyWithMethod('render:salesNew', setRefresh)
    }, [])

}
export { useSalesNew }