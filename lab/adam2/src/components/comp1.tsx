// import { PDFDocument, PDFText, PDFTable, PDFTableRow, PDFTableColumn, PDFColumns, PDFColumn } from 'react-pdfmake';
import { useRef, useState } from 'react'
import { PDFReader } from 'react-read-pdf'
import reactDomServer from 'react-dom/server'
import axios from 'axios'
import { Comp2 } from './comp2'
import {Buffer} from 'buffer'

function Comp1() {
    const [, setrefresh] = useState({})
    const meta: any = useRef({
        objectUrl: undefined
    })
    const pre = meta.current

    return (
        <div>
            {pre.objectUrl && <object data={pre.objectUrl} type="application/pdf" width="100%" height="800">
                <p>Alternative text - include a link <a href="http://localhost:8081/pdf">to the PDF!</a></p>
            </object>}
            <button onClick={handleClick}>Post</button>
        </div>
        // <div style={{width:'100%', height:600}}>
        // <object data="http://localhost:8081/pdf" type="application/pdf" width="100%" height="100%">
        //     <p>Alternative text - include a link <a href="http://localhost:8081/pdf">to the PDF!</a></p>
        // </object>
        //     {/* <PDFReader showAllPage={true} url='http://localhost:8081/pdf/'></PDFReader> */}
        // </div>
    )

    async function handleClick() {
        const htmlString = reactDomServer.renderToString(<Comp2 />)
        const options: any = await axios({
            method: 'post',
            url: 'http://localhost:8081/pdf1',
            headers: { 'Accept': 'application/pdf', 'Content-Type':'application/json' },
            data: {
                template: htmlString
            }
        })
        const opts:any = Buffer.from([options])
        const blob: any = new Blob([options], { type: 'application/pdf' })
        pre.objectUrl = URL.createObjectURL(blob)
        const base64 = options.toString('base64')
        const objUrl = `"data:application/pdf;base64, ${base64}" type="application/pdf"`
        // const arrayBuffer = Buffer.from(options).buffer
        // const blob: any = new Blob([arrayBuffer], { type: 'application/pdf' })
        // pre.objectUrl = URL.createObjectURL(options)
        setrefresh({})
        // console.log(options)

        // axios({
        //     method: 'post',
        //     url: 'http://localhost:8081/pdf1',
        //     // headers: { 'content-type': 'application/x-www-form-urlencoded' },
        //     data: {
        //         template: htmlString
        //     }
        // }).then((opts) => {
        //     console.log(opts)
        // })
        // axios.post('http://localhost:8081/pdf1',{template: htmlString}).then((options:any)=>{
        //     console.log(options)
        // })
        // console.log(htmlString)
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