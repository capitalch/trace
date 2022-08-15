// import { PDFDocument, PDFText, PDFTable, PDFTableRow, PDFTableColumn, PDFColumns, PDFColumn } from 'react-pdfmake';
import { useRef, useState } from 'react'
// import { PDFReader } from 'react-read-pdf'
import reactDomServer from 'react-dom/server'
import axios from 'axios'
import { Comp2 } from './comp2'
import { Buffer } from 'buffer'
import html2Canvas from 'html2canvas'
import jspdf from 'jspdf'
import * as htmlToImage from 'html-to-image'
import { Comp3 } from './Comp3'
import jsPDF from 'jspdf'

function Comp1() {
    const [, setrefresh] = useState({})
    const meta: any = useRef({
        objectUrl: undefined,
    })
    const pre = meta.current

    return (
        <div>
            <Comp3 />
            <button onClick={handleClick2}>HtmlToCanvas</button>
        </div>
    )

    // return (
    //     <div>
    //         {pre.objectUrl && (
    //             <object
    //                 data={pre.objectUrl}
    //                 type="application/pdf"
    //                 width="100%"
    //                 height="800">
    //                 <p>
    //                     Alternative text - include a link{' '}
    //                     <a href="http://localhost:8081/pdf">to the PDF!</a>
    //                 </p>
    //             </object>
    //         )}
    //         <button onClick={handleClick}>Use Puppeteer</button>
    //         <button onClick={handleClick1}>Use html-to-image</button>
    //     </div>
    // )

    async function handleClick1() {}

    async function handleClick2() {
        const input: any = document.getElementById('#comp3')
        const canvas = await html2Canvas(input)
        const imageData:any = canvas.toDataURL('image/png')
        const pdf = new jsPDF()//'p', 'px', 'a4')
        pdf.addImage(imageData,'JPEG',10,10,480,600)
        pdf.save('sample.pdf')
        // pdf.addImage(imageData)
        // pdf.save('test.pdf')
    }

    async function handleClick() {
        const htmlString = reactDomServer.renderToString(<Comp2 />)
        const options: any = await axios({
            method: 'post',
            url: 'http://localhost:8081/pdf1',
            data: {
                template: htmlString,
            },
        })
        const buff = options.data.data
        const buffer = Buffer.from(buff)

        // const blob: any = new Blob([buffer], { type: 'application/pdf' })
        // pre.objectUrl = URL.createObjectURL(blob)

        const base64 = buffer.toString('base64')
        pre.objectUrl = 'data:application/pdf;base64, ' + base64

        setrefresh({})
    }
}

export { Comp1 }
// const base64 = "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UjggMTQgMCBSCj4+CmVuZG9iagoxMyAwIG9iago8PC9UeXBlIC9FeHRHU3RhdGUgL0JNIC9Ob3JtYWwgL09QTSAxIC9USyB0cnVlID4+CmVuZG9iagoxNCAwIG9iago8PC9CYXNlRm9udCAvTExSSUNLK0hlbHZldGljYSAvRm9udERlc2NyaXB0b3IgMTUgMCBSCi9UeXBlIC9Gb250IC9GaXJzdENoYXIgMzIgL0xhc3RDaGFyIDEyMiAvV2lkdGhzIFsyNzggMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDI3OCAzMzMgMjc4IDAgMCA1NTYgNTU2IDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA2NjcgNjY3IDcyMiA3MjIgNjY3IDYxMSAwIDAgMCAwIDAgMCA4MzMgMCA3NzggNjY3IDAgMCA2NjcgNjExIDAgNjY3IDAgMCA2NjcgMCAwIDAgMCAwIDAgMCA1NTYgNTU2IDUwMCA1NTYgNTU2IDI3OCA1NTYgNTU2IDIyMiAyMjIgMCAyMjIgODMzIDU1NiA1NTYgNTU2IDAgMzMzIDUwMCAyNzggNTU2IDUwMCA3MjIgNTAwIDUwMCA1MDAgXQovRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvU3VidHlwZSAvVHlwZTEgPj4KZW5kb2JqCjE1IDAgb2JqCjw8L1R5cGUgL0ZvbnREZXNjcmlwdG9yIC9Gb250TmFtZSAvTExSSUNLK0hlbHZldGljYSAvRm9udEJCb3ggWy0xOCAtMjE4IDc2MiA3NDEgXQovRmxhZ3MgMzIgL0FzY2VudCA3NDEgL0NhcEhlaWdodCA3NDEgL0Rlc2NlbnQgLTIxOCAvSXRhbGljQW5nbGUgMCAvU3RlbVYgMTE0IC9NaXNzaW5nV2lkdGggMjc4IC9YSGVpZ2h0IDUzOSAvQ2hhclNldCAoL0EvQi9DL0QvRS9GL00vTy9QL1MvVC9WL1kvYS9iL2MvY29tbWEvZC9lL2YvZy9oL2h5cGhlbi9pL2ovbC9tL24vby9vbmUvcC9wZXJpb2Qvci9zL3NwYWNlL3QvdHdvL3Uvdi93L3gveS96KS9Gb250RmlsZTMgMTYgMCBSCj4+CmVuZG9iagoxNiAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9T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DrHKEhbqNxT04kYq1llPJXh3n6gbxu2/9cWFvvpfG8f8cv3qAzSAbqU1RlZHXgg75oemIj/aa6TGbF61g7aB3O7avRUHT5649E1ZPRIe31rivmRteECcwjGU2M34yHcrcbbASRSas3qNvWb7XovjbmXxaP7GzJU7hBi+eUf1t+iJAMaUQL2w7T77DeRJ4Dw0iSTPC/K4P09JIISeHPeaM0k/gUuLIPhg4mHuRyPN8K7dxsbdhcYjGOY/S2FNtwplbmRzdHJlYW0KZW5kb2JqCjIgMCBvYmoKPDwKL1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldCi9Gb250IDw8Cj4+Ci9YT2JqZWN0IDw8Ci9UUEwxIDcgMCBSCi9UUEwyIDEwIDAgUgo+Pgo+PgplbmRvYmoKMTcgMCBvYmoKPDwKL0NyZWF0b3IgKE9ubGluZTJQREYuY29tKQovUHJvZHVjZXIgKE9ubGluZTJQREYuY29tKQovQ3JlYXRpb25EYXRlIChEOjIwMjEwODMxMDc1NzQxKzAyJzAwJykKPj4KZW5kb2JqCjE4IDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovT3BlbkFjdGlvbiBbMyAwIFIgL0ZpdEggbnVsbF0KL1BhZ2VMYXlvdXQgL09uZUNvbHVtbgo+PgplbmRvYmoKeHJlZgowIDE5CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDUwNyAwMDAwMCBuIAowMDAwMDA1NjA4IDAwMDAwIG4gCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjU3IDAwMDAwIG4gCjAwMDAwMDAzNjUgMDAwMDAgbiAKMDAwMDAwMDYwMCAwMDAwMCBuIAowMDAwMDAxNjk0IDAwMDAwIG4gCjAwMDAwMDE3MjUgMDAwMDAgbiAKMDAwMDAwMTE1NiAwMDAwMCBuIAowMDAwMDAxNzU2IDAwMDAwIG4gCjAwMDAwMDE3ODggMDAwMDAgbiAKMDAwMDAwMTgyMCAwMDAwMCBuIAowMDAwMDAxODg2IDAwMDAwIG4gCjAwMDAwMDIzMjAgMDAwMDAgbiAKMDAwMDAwMjY2NiAwMDAwMCBuIAowMDAwMDA1NzI3IDAwMDAwIG4gCjAwMDAwMDU4NDIgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxOQovUm9vdCAxOCAwIFIKL0luZm8gMTcgMCBSCi9JRCBbPDMxNUMwRkMzMzE4QzZFRjZDRTMxOTBCNUI1RjU5RDVEPjwzMTVDMEZDMzMxOEM2RUY2Q0UzMTkwQjVCNUY1OUQ1RD5dCj4+CnN0YXJ0eHJlZgo1OTQ2CiUlRU9GCg=="
// console.log(buff)
// const opts:any = Buffer.from([options])
// const blob=new Blob([buff], {type: "application/pdf"});
// const blob: any = new Blob([buff], { type: 'application/pdf' })
// pre.objectUrl = `data:application/pdf;base64,${base64}`
// pre.objectUrl = URL.createObjectURL(blob)
// const base64 = options.toString('base64')
// pre.objectUrl = `"data:application/pdf;base64, ${base64}" type="application/pdf"`

// const arrayBuffer = Buffer.from(options).buffer
// const blob: any = new Blob([arrayBuffer], { type: 'application/pdf' })
// pre.objectUrl = URL.createObjectURL(options)

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
