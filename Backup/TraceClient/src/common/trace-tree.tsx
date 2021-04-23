import React, { useState } from 'react'
import styled from 'styled-components'
import { useIbuki } from '../common-utils/ibuki'

function TraceTree(props: any) {
    return <StyledUl>
        {
            (props.value && props.value.children && props.value.children.length > 0) ? props.value.children.map((item: any, index: number) => {
                return <Node key={index} value={item} parent={props.value.name}></Node>
            }) : null
        }
    </StyledUl>

}

function Node(props: any) {
    let [display, setDisplay] = useState('block')
    let [nodeClass, setNodeClass] = useState('expanded')
    const { emit }: any = useIbuki()
    const children = props.value.children
    return <>
        <StyledLi nodeClass={(children && children.length > 0) ? nodeClass : ''} onClick={e => {
            if (children && children.length > 0) {
                setNodeClass(nodeClass === 'expanded' ? 'collapsed' : 'expanded')
                setDisplay(display === 'block' ? 'none' : 'block')
            } else {
                emit('LOAD-MAIN-COMPONENT-NEW', { componentName: props.value.componentName, args: props.value.args, name: props.parent })
            }

        }}><span>{props.value.label}</span></StyledLi>
        {
            (children && children.length > 0) ? children.map((item: any, index: number) => {
                return <StyledUl key={index} style={{ display: display }}><Node value={item} parent={props.parent}></Node></StyledUl>
            }) : null
        }
    </>
}

interface Props {
    nodeClass: string;
}


/* Explaination
You take input of some arbitrary property and based on value of property set various styles. 
This is how you can simulate the className. Check the use of Interface
*/
export default TraceTree

const StyledUl = styled.ul`
    list-style-type: none;
    color: ${props => props.style ? 'blue' : 'red'};
    margin:5px 0px 0px 0px
    /* padding:10px 0px 0px 0px ; */
`

const StyledLi = styled.li<Props>`
    cursor: pointer;
    user-select: none;
    font-size: 0.8em;
    font-family:sans-serif;
    ${(props: any) => {
        let ret
        if (props.nodeClass === 'expanded') {
            ret = `
                ::before {
                    content: '\\25BE'; // black small
                    color: black;
                    display: inline-block;
                    margin-right: 0.25em;
                }`
        } else if (props.nodeClass === 'collapsed') {
            ret = `
                ::before {
                    content: "\\25B8"; // black small
                    color: black;
                    display: inline-block;
                    margin-right: 0.25em;
                }`
        } else {
            ret = `
                ::before {
                    //content: "\\2500"; // black line
                    //content: "\\26AC";
                    //content:"\\26D4";
                    //content:"\\26CA";
                    content:"\\26A1";
                    color: teal;
                    display: inline-block;
                    margin-right: 0.25em;
                }`
        }
        return ret
    }}`

/*

*/