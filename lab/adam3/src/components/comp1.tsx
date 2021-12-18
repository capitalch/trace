const PDFDocument = require('pdfkit')
const blobStream  = require('blob-stream')

function Comp1(){
    const doc = new PDFDocument;
    doc.text('Hello world!')
    // pipe the document to a blob
    const stream = doc.pipe(blobStream());

    doc.end()
    stream.on('finish', function() {
        // get a blob you can do whatever you like with
        const blob = stream.toBlob('application/pdf');
      
        // or get a blob URL for display in the browser
        const url = stream.toBlobURL('application/pdf');
        // iframe.src = url;
      })

      return <div>
          Comp1
      </div>
}

export {Comp1}