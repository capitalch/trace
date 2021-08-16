import _ from 'lodash'
import Paper from '@material-ui/core/Paper'
import React, { useState, useEffect } from 'react'
import { useIbuki } from '../utils/ibuki'
import { Grid, Table, TableHeaderRow, TableSummaryRow } from '@devexpress/dx-react-grid-material-ui'
// import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
// import { Send } from '@material-ui/icons'
// import mock from '../data/mockData.json'

import './component4.scss'

import { Button } from '@material-ui/core'
import { IntegratedSummary, SummaryState } from '@devexpress/dx-react-grid'
import { ComputerTwoTone } from '@material-ui/icons'

const Component4 = () => {
    const [, setRefresh] = useState({})
    const { emit, filterOn } = useIbuki()
    useEffect(() => {
    }, [])


    return (
        <div>
            <CompA />
            <CompB />
            <CompC />
        </div>
    )


    function useComp() {
        const [, setRefresh] = useState({})
        console.log('comp hook body')
        useEffect(() => {
            console.log('Comp hook useeffect')
            const subs1 = filterOn('COMP-HOOK-MESSAGE').subscribe(() => {
                setRefresh({})
            })
            return (() => {
                console.log('Hook returns')
            })
        }, [])
        function compute() {
            return 100
        }

        return { compute }
    }

    function CompA() {
        const [, setRefresh] = useState({})
        const { compute } = useComp()

        useEffect(() => {
            const subs1 = filterOn('COMPA-MESSAGE').subscribe(() => {
                setRefresh({})
            })
            return (() => {
                subs1.unsubscribe()
            })
        }, [])

        console.log('Comp A:', 'Computed result:', compute())
        return (<div>Comp A</div>)
    }

    function CompB() {
        const [, setRefresh] = useState({})
        const { compute } = useComp()
        console.log('Comp B:', 'Computed result:', compute())
        return (<div>Comp B</div>)
    }

    function CompC() {
        return (<div>
            <span> Comp C</span>
            <button
                onClick={() => {
                    emit('COMPA-MESSAGE', '')
                }}
            >CompA Message</button>

            <button
                onClick={() => {
                    emit('COMP-HOOK-MESSAGE', '')
                }}
            >Hook Message</button>
        </div>)
    }
}

export { Component4 }
