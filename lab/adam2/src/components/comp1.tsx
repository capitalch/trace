import { PDFDocument, PDFText, PDFTable, PDFTableRow, PDFTableColumn, PDFColumns, PDFColumn } from 'react-pdfmake';

function Comp1() {
    return (
        <div>
            Test
            <PDFDocument
                pageSize='A5'
                pageOrientation="portrait">
                <PDFText>Headers</PDFText>
                You can declare how many rows should be treated as a header. Headers are automatically
                repeated on the following pages
                <PDFText color="gray" italics>
                    Headers
                </PDFText>
                <PDFColumns columnGap={10}>
                    <PDFColumn width="*">Hi</PDFColumn>
                    <PDFColumn width="auto">Hi</PDFColumn>
                </PDFColumns>
            </PDFDocument>
        </div>
    )
}

export { Comp1 }