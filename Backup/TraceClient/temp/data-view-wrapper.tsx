import styled from 'styled-components'

const Div = styled.div`
    margin: 1rem;
    height: 83vh;
    width: 98%;
    overflow:auto;
    border: 1px solid green;

    td, tr,th{
        border: 1px solid lightgray;        
        padding: 0.2rem;
        padding-left:.5rem;
        font-size: 0.9rem;
    }

    table {
        border-collapse:collapse;
        text-align:left;
        margin: 1rem;
    }

    td {
        cursor: pointer;
        height: 1rem;
    }

    .numeric-right {
        text-align:right;
    }`

export { Div }