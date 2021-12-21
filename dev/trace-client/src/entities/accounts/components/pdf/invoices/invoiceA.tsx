import {useSharedElements,} from '../../common/shared-elements-hook'
import {useInvoiceA, invoice} from './invoiceA-hook'

function InvoiceA() {
    const {Document, Line, Page, Svg, Text, View,} = useSharedElements()
    const {Main} = useInvoiceA()

    return (
        <Main />
    )
    
}

export { InvoiceA }