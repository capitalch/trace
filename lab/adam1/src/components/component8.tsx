import React, { useEffect, useRef, useState, useCallback } from 'react'
import moment from 'moment'
import { Button, TextField } from '@material-ui/core'
import { InputMask } from 'primereact/inputmask'
// import InputMask from 'react-input-mask'
import { useGlobal } from '../utils/global-hook'
import { Component9 } from './component9'
import {
    Page,
    Document,
    View,
    Text,
    Image,
    PDFDownloadLink,
    StyleSheet,
    PDFViewer,
} from '@react-pdf/renderer'
import ReactPDF from '@react-pdf/renderer'

const dateFormat = 'DD/MM/YYYY'
const isoDateFormat = 'YYYY-MM-DD'
function Component8() {
    useEffect(() => {

    }, [])

    const MyDocument = () => (
        // <PDFViewer>
        <Document>
            <Page size="A4">
                <View>
                    <Text>Section #1</Text>
                </View>
                <View>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
        // </PDFViewer>
    )

    // return(<MyDocument />)
    return <div>
        <PDFDownloadLink document={<MyDocument />} fileName="somename.pdf">
            {({ loading }) => (loading ? 'Loading document...' : 'Download now!')}
        </PDFDownloadLink>
    </div>
}
export { Component8 }

