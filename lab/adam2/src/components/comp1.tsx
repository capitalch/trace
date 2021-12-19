import jsPDF from 'jspdf'
import './comp1.scss'
// import * as html2pdf from 'html2pdf'
// import html from './sample.html'
function Comp1() {
    return (
        <div>
            <button onClick={handlePdf}>PDF</button>
            <MyHtml />
        </div>
    )

    function MyHtml() {
        return (
            <div className="page" id="myId" >
                <div className="info-invoice">
                    <div className="info">
                        <b>Capital</b>
                    </div>
                    <div className="invoice">
                        <b>Bill no:</b>
                    </div>
                </div>
            </div>
        )
    }

    function handlePdf() {
        const html = `
        <div className="page" id="myId" >
            <div className="info-invoice">
                <div className="info">
                    <b>Capital</b>
                </div>
                <div className="invoice">
                    <b>Bill no:</b>
                </div>
            </div>
        </div>
        `
        const doc: any = new jsPDF('p', 'pt', 'a4')

        doc.html(document.getElementById('myId'), {
            callback: (doc: any) => doc.save(),
            margin: 10,
            autoPaging: true,
            // width:595,
            // x:0
        })
        // const options= {
        //     align:'right',
        //     maxWidth:600
        // }
        // doc.text('this is first line', 20,20)
        // doc.cell(100,10,100,12,'Cell',12,'right')
        // doc.cell(100,5,100,12,'Cell',12,'right')
        // doc.save('demo.pdf')
        // window.open(doc.output('bloburl'))
    }
}
export { Comp1 }
