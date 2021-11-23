from flask import Flask, render_template, make_response
import sass
import pdfkit
from invoice import invoice

app = Flask(__name__)

sass.compile(dirname=('templates/scss',
             'static'))

companyInfo = invoice.get('companyInfo', {})


@app.route("/")
def template_test():
    return render_template('bill-template1.html', companyInfo=companyInfo , invoice=invoice)


@ app.route('/pdf')
def pdf():
    options = {
        'enable-local-file-access': None,
        'header_html':render_template('header.html')
    }

    html = render_template('bill-template1.html', companyInfo=companyInfo, invoice=invoice)
    pdf = pdfkit.from_string(html, False, options=options)
    response = make_response(pdf)
    response.headers["Content-Type"] = "application/pdf"
    response.headers["Content-Disposition"] = "inline; filename=output.pdf"
    return(response, 200)


if __name__ == '__main__':
    app.run(debug=True)
