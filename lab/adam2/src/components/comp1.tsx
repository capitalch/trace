import jsPDF from 'jspdf'

function Comp1() {
    return <div>
        <button onClick={handlePdf}>PDF</button>
    </div>

    function handlePdf(){
        const doc = new jsPDF('p','mm')
        // const options= {
        //     align:'right',
        //     maxWidth:600
        // }
        doc.text('this is first line', 20,20)
        doc.cell(100,10,100,12,'Cell',12,'right')
        doc.cell(100,5,100,12,'Cell',12,'right')
        // doc.save('demo.pdf')
        window.open(doc.output('bloburl'))
    }
}
export { Comp1 }
