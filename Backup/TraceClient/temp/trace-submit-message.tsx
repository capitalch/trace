import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useIbuki } from '../common-utils/ibuki'

const SubmitMessage = (props: any) => {
    const { filterOn } = useIbuki()
    const messageObject = {
        success: 'Data saved',
        failure: 'Save Error'
    }
    let [message, setMessage] = useState('')
    let [displayType, setDisplayType] = useState('none')
    useEffect(() => {
        const sub = filterOn('FORM-DATA-SAVED').subscribe((d) => {
            if(d.data.isSuccess){
                setDisplayType('inline-block')
                setMessage(messageObject.success)
                setTimeout(()=>{setDisplayType('none')}, 2000)
            }            
        })
        return (() => {
            sub.unsubscribe()
        })
    }, [])
    return <StyledSubmitMessage displayType={displayType}><label>{message}</label></StyledSubmitMessage>
}

export { SubmitMessage }

const StyledSubmitMessage: any = styled.div`
    background-color: yellow;
    width: 10em;
    height: 3em;
    border-radius: .8em;
    display: ${(props: any) => props.displayType};
    position: fixed;
    z-index: 1000;
    top:5.5em;
    right: 0.5em;
    border: 1px solid green;
    label {       
        margin-left: 1.5em;
        font-weight: bold;
        font-size: 1.2em;
    }
`