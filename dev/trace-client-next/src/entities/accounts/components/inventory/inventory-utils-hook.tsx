import {manageEntitiesState, useIbuki, utilMethods} from './redirect'
function useInventoryUtils(){
    const {emit} = useIbuki()
    const {execGenericView} = utilMethods()
    const {setInBag} = manageEntitiesState()
    
    async function fetchBrandsCategoriesUnits() {
        emit('SHOW-LOADING-INDICATOR', true)
        const result: any = await execGenericView({
            isMultipleRows: false,
            sqlKey: 'getJson_brands_categories_units',
            args: {
            },
        })

        const brands = (result?.jsonResult?.brands || []).map((x: any) => {
            return {
                label: x.brandName,
                value: x.id,
            }
        })
        setInBag('brands', brands)
        const categories = (result?.jsonResult?.categories || []).map((x: any) => {
            return {
                label: x.catName,
                value: x.id,
            }
        })
        setInBag('categories', categories)
        const units = result?.jsonResult.units
        setInBag('units', units)
        emit('SHOW-LOADING-INDICATOR', false)
    }
    return({fetchBrandsCategoriesUnits})
}
export {useInventoryUtils}