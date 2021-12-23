import { useSharedElements } from '../../common/shared-elements-hook'
import { useInvoiceA, invoice } from './invoiceA-hook'

function InvoiceA({ invoice }: any) {
    const { Document, Line, Page, Svg, Text, View } = useSharedElements()
    const { Main } = useInvoiceA(invoice)

    return <Main />
}

export { InvoiceA }
