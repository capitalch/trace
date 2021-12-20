import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Comp1Child } from './comp1-child'
import styles from './comp1.module.scss'
import axios from 'axios'

function Comp1() {
    const childRef: any = useRef()
    const handlePrint = useReactToPrint({
        content: () => childRef.current,

    })

    return (
        <div className={styles.myClass}>
            <div>Not to print</div>
            <div ref={childRef}>
                <Comp1Child />
            </div>
            <button onClick={handlePrint}>Pdf</button>
            <button onClick={handlePup}>Puppetter</button>
        </div>
    )

    function handlePup(event:any) {
        axios.get('http://localhost:5001', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        }).then((response) => {
            const blob:any = new Blob([response.data], { type: 'application/pdf' })
            const fileURL = URL.createObjectURL(blob)
            const w:any = window.open(fileURL, "_blank", "height=400,width=600,top=200, left=200")
            
            w.print()
            // w.close()
            
            // const link = document.createElement('a')
            // link.href = window.URL.createObjectURL(blob)
            // link.download = `your-file-name.pdf`
            // link.click()

            // event.preventDefault()
            // window.open(blob, "PRINT", "height=400,width=600")
        })
    }

}

export { Comp1 }