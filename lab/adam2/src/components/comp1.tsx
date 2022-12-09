import { useRef, useState } from 'react'


function Comp1() {
    const [, setRefresh] = useState({})
    const textRef: any = useRef()
    const meta: any = useRef({
        text2: '',
        childText2: '',
        setRefresh: setRefresh
    })

    return (
        <div style={{ margin: 5 }}>
            {/* <span>Parent</span> */}
            <input type='text' ref={textRef} onChange={handleOnChange1} />
            <input type='text' onChange={handleOnChange2}  />
            <Comp1Child parentMeta={meta} />
        </div>
    )

    function handleOnChange1(e: any) {

        console.log(textRef.current.value)
    }

    function handleOnChange2(e: any) {
        meta.current.text2 = e.target.value
        console.log(meta.current.text2)
        setRefresh({})
    }

}

export { Comp1 }

function Comp1Child({ parentMeta }: any) {
    const textRef: any = useRef()
    const pre = parentMeta.current
    return (<div>
        <input type='text' ref={textRef} onChange={handleOnChange1} />
        <input type='text' onChange={handleOnChange2} />
    </div>)

    function handleOnChange1(e:any){
        pre.setRefresh({})
        console.log(e.target.value)
    }

    function handleOnChange2(e:any){
        pre.childText2 = e.target.value
        pre.setRefresh({})
        console.log(e.target.value)
    }
}
