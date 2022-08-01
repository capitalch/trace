// import { PDFDocument, PDFText, PDFTable, PDFTableRow, PDFTableColumn, PDFColumns, PDFColumn } from 'react-pdfmake';
import { PDFReader } from 'react-read-pdf'
import reactDomServer from 'react-dom/server'
import axios from 'axios'
import {Comp2} from './comp2'

function Comp1() {
    return (
        <div>
            {/* <iframe title='xxx' src='http://localhost:8081/pdf' width='100%' height='800' /> */}
            <object data="http://localhost:8081/pdf1" type="application/pdf" width="100%" height="800">
                <p>Alternative text - include a link <a href="http://localhost:8081/pdf">to the PDF!</a></p>
            </object>
            <button onClick={handleClick}>Post</button>
        </div>
        // <div style={{width:'100%', height:600}}>
        // <object data="http://localhost:8081/pdf" type="application/pdf" width="100%" height="100%">
        //     <p>Alternative text - include a link <a href="http://localhost:8081/pdf">to the PDF!</a></p>
        // </object>
        //     {/* <PDFReader showAllPage={true} url='http://localhost:8081/pdf/'></PDFReader> */}
        // </div>
    )

    function handleClick(){
        const htmlString = reactDomServer.renderToString(<Comp2 />)
        axios({
            method:'post',
            url:'http://localhost:8081/pdf1',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data:{
                template: htmlString
            }
        }).then((opts)=>{
            console.log(opts)
        })
        // axios.post('http://localhost:8081/pdf1',{template: htmlString}).then((options:any)=>{
        //     console.log(options)
        // })
        console.log(htmlString)
    }
}

export { Comp1 }

/* <PDFDocument
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
            </PDFDocument> */