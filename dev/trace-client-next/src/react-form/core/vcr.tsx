import React from "react"

function VCR(props: any):any {
    const status: any = props.status

    function prev() {
        props.prev()
    }

    function save() {
        props.save()
    }

    function next() {
        props.next()
    }

    function submit() {
        props.submit()
    }

    function setStatus():any {        
        const d: any = { 0: 'none', 1: 'inline' }
        for (let a in status) {
            status[a] = d[status[a]]
        }
    }

    setStatus()

    return <>
        <button style={{ display: `${status['p']}` }} onClick={(e:any) => prev()}>Prev</button>
        <button style={{ display: `${status['s']}` }} onClick={(e:any) => save()}>Save</button>
        <button style={{ display: `${status['n']}` }} onClick={(e:any) => next()}>Next</button>
        <button style={{ display: `${status['u']}` }} onClick={(e:any) => submit()}>Submit</button>
    </>
}

export {VCR}