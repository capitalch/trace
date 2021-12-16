import jsPDF from 'jspdf'

function Comp1() {
    return <div>
        <button onClick={handlePdf}>PDF</button>
    </div>

    function handlePdf(){
        const doc = new jsPDF('p','pt')
        doc.text('this is first line', 20,20)
        // doc.save('demo.pdf')
        window.open(doc.output('bloburl'))
    }
}
export { Comp1 }
