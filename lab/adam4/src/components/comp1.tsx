import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Comp1Child } from './comp1-child'
import styles from './comp1.module.scss'

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
        </div>
    )


}

export { Comp1 }