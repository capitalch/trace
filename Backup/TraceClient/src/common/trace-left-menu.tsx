import React, { useState, useRef, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
// import { styled } from '@material-ui/core/styles'
// import styled from 'styled-components'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Collapse from '@material-ui/core/Collapse'
import Drawyer from '@material-ui/core/Drawer'

import IconExpandLess from '@material-ui/icons/ExpandLess'
import IconExpandMore from '@material-ui/icons/ExpandMore'

import { useIbuki } from '../common-utils/ibuki'
import { manageEntitiesState } from '../common-utils/esm'
// import { StyledLogoName } from './trace-styled-components'
import { iconMap } from './trace-left-menu-icon-map'

function TraceLeftMenu(props: any) {
    const { close, matches }: any = props
    const [, setRefresh] = useState({})
    const rootChildren = props?.value?.children
    const { emit } = useIbuki()
    const theme = useTheme()
    const { getCurrentEntity } = manageEntitiesState()
    const meta: any = useRef({
        openArray: rootChildren ? Array(rootChildren.length).fill(true) : [] // whether or not a node is open
    })

    function getUpDownArrowIcon(item: any, index: number) {
        let ret = undefined
        if (item.children) {
            ret = meta.current.openArray[index] ? <IconExpandLess ></IconExpandLess> : <IconExpandMore></IconExpandMore>
        }
        return ret
    }

    function getListItems(root: any) {
        let listItems: any[] = []
        root && root.children && root.children.map((item: any, index: number) => {
            const listItem =
                <ListItem button key={index}
                    onClick={e => {
                        if (item.children) {
                            const currentItemIndex = meta.current.openArray[index]
                            // set everything collapsed
                            meta.current.openArray.fill(false)
                            meta.current.openArray[index] = !currentItemIndex
                            // meta.current.openArray[index] = !meta.current.openArray[index]
                            setRefresh({})
                        } else {
                            emit('LOAD-MAIN-COMPONENT-NEW', {
                                componentName: item.componentName, args: item.args, name: getCurrentEntity()
                            })
                            //to automatically close the drawyer when less than medium device (up to 959 px)
                            if (!matches) {
                                close()
                            }
                        }
                    }}>
                    {
                        <ListItemIcon style={{ color: theme.palette.success.light, marginLeft: `${item.children ? 0 : '2rem'}` }}>
                            {iconMap[item.name]}
                        </ListItemIcon>
                    }
                    <ListItemText primary={item.label}>

                    </ListItemText>
                    {getUpDownArrowIcon(item, index)}

                </ListItem>
            let collapse = item.children &&
                <Collapse key={index + 100} in={meta.current.openArray[index]} timeout="auto" unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                        {
                            getListItems(item)
                        }
                    </List>
                </Collapse>
            listItems.push(listItem)
            collapse && listItems.push(collapse)
        })

        return listItems
    }
    // style={{marginTop:'-.5rem', minHeight:'calc(100vh + 0.5rem)'}}
    return (
        <List style={{
            background: theme.palette.primary.dark
            , color: theme.palette.primary.contrastText
        }}>
            {getListItems(props?.value)}
        </List>
    )
}
export { TraceLeftMenu }

