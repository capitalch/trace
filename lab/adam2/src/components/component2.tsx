import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import  { Page, Text, View, Document, StyleSheet, PDFViewer,  } from '@react-pdf/renderer'


const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
})

const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
        </Page>
    </Document>
)

function Component2() {
    // return <PDFDownloadLink document={<MyDocument />} fileName='myFile.pdf'>Download now</PDFDownloadLink>
    return(
        <PDFViewer width={1000} height={800}>
            <MyDocument />
        </PDFViewer>
    )
}

export { Component2 }