import React, { useState, useRef } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'

import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'
import IconDashboard from '@material-ui/icons/Dashboard'

import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {useIbuki} from './utils/ibuki'

const AppMenu: React.FC = () => {
    // const classes = useStyles()
    // const [open, setOpen] = React.useState(false)
    const {emit} = useIbuki()
    const [, setRefresh]: any = useState({})
    const theme = useTheme()
    const meta: any = useRef({
        openArray: Array(dataMenu.children.length).fill(true)
    })


    function getArrowIcon(item: any, index: number) {
        let ret = undefined
        if (item.children) {
            if (meta.current.openArray[index]) {
                ret = <IconExpandLess></IconExpandLess>
            } else {
                ret = <IconExpandMore></IconExpandMore>
            }
        }
        return ret
    }
    // '#97c05c'
    function getMenuListItems(menuItems: any) {
        let listItems: any[] = []
        menuItems.children.map((item: any, index: number) => {
            const listItem =
                <ListItem button key={index}
                    onClick={e => {
                        if (item.children) {
                            meta.current.openArray[index] = !meta.current.openArray[index]
                            setRefresh({})
                        } else {
                            emit('MENU-ITEM-CLICKED','')
                        }
                    }}>
                    {<ListItemIcon style={{ color: theme.palette.success.light , marginLeft: `${item.children ? 0 : '2rem'}` }}>
                        <IconDashboard></IconDashboard>
                    </ListItemIcon>}
                    <ListItemText primary={<Typography variant='subtitle1'> {item.label}</Typography>}>
                    </ListItemText>
                    {getArrowIcon(item, index)}
                </ListItem>
            let collapse = item.children &&
                <Collapse key={index + 100} in={meta.current.openArray[index]} timeout="auto" unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                        {
                            getMenuListItems(item)
                        }
                    </List>
                </Collapse>
            listItems.push(listItem)
            listItems.push(collapse)
        })
        return listItems
    }

    return (
        <List style={{
            background: theme.palette.primary.dark//'#535454'
            , color: theme.palette.primary.contrastText
        }}>
            {getMenuListItems(dataMenu)}
        </List>
    )
}

export default AppMenu

const dataMenu = {
    "name": "accounts",
    "label": "Accounts",
    "children": [{
        "name": "finalAccounts",
        "label": "Final accounts",
        "children": [{
            "name": "trialBalance",
            "label": "Trial balance",
            "componentName": "trialBalance"
        },
        {
            "name": "balanceSheet",
            "label": "Balance sheet",
            "componentName": "balanceSheet"
        },
        {
            "name": "pl",
            "label": "PL account",
            "componentName": "profitLoss"
        }
        ]
    },
    {
        "name": "accountTransactions",
        "label": "Account trans",
        "children": [
            {
                "name": "payments",
                "label": "Payments",
                "componentName": "payments"
            },
            {
                "name": "receipts",
                "label": "Receipts",
                "componentName": "receipts"
            },
            {
                "name": "contra",
                "label": "Contra",
                "componentName": "contra"
            },
            {
                "name": "journals",
                "label": "Journals",
                "componentName": "journals"
            },
            {
                "name": "sales",
                "label": "Sales",
                "componentName": "sales"
            },
            {
                "name": "purchases",
                "label": "Purchases",
                "componentName": "purchases"
            }
        ]
    },
    {
        "name": "masters",
        "label": "Masters",
        "children": [
            {
                "name": "accounts",
                "label": "Accounts",
                "componentName": "accountsMaster"
            },
            {
                "name": "accountsOpBal",
                "label": "Opening balances",
                "componentName": "accountsOpBal"
            },
            {
                "name": "Branches",
                "label": "Branches",
                "componentName": "genericCRUD",
                "args": {
                    "loadComponent": "branchMaster"
                }
            },
            {
                "name": "financialYears",
                "label": "Financial years",
                "componentName": "genericCRUD",
                "args": {
                    "loadComponent": "finYearMaster"
                }
            }
        ]
    }
    ]
}

/*

*/