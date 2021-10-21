import { useState, useRef } from '../imports/regular-imports'
import { ClickAwayListener,Collapse,Divider, List, ListItem,ListItemText,Theme, useTheme } from '../imports/gui-imports'
import {manageEntitiesState, useIbuki} from '../imports/trace-imports'
import {ExpandLess, ExpandMore} from '../imports/icons-import'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { utilMethods } from '../global-utils/misc-utils'
import { iconMap } from './trace-left-menu-icon-map'

function TraceLeftMenu(props: any) {
    const { close, matches, open }: any = props
    const [, setRefresh] = useState({})
    const rootChildren = props?.value?.children
    const { emit } = useIbuki()
    const theme:Theme = useTheme()
    const { isControlDisabled } = utilMethods()
    const { getCurrentEntity } = manageEntitiesState()
    const meta: any = useRef({
        openArray: rootChildren ? Array(rootChildren.length).fill(true) : [], // whether or not a node is open
    })

    function getUpDownArrowIcon(item: any, index: number) {
        let ret = undefined
        if (item.children) {
            ret = meta.current.openArray[index] ? (
                <ExpandLess></ExpandLess>
            ) : (
                <ExpandMore></ExpandMore>
            )
        }
        return ret
    }

    function getListItems(root: any) {
        const listItems: any[] = []

        root?.children?.forEach((item: any, index: number) => {
            const listItem = (
                <ListItem
                    button
                    key={index}
                    disabled={isControlDisabled(item.name)}
                    onClick={(e) => {
                        if (item.children) {
                            const currentItemIndex =
                                meta.current.openArray[index]
                            // set everything collapsed
                            meta.current.openArray.fill(false)
                            meta.current.openArray[index] = !currentItemIndex
                            setRefresh({})
                        } else {
                            emit('LAUNCH-PAD:LOAD-COMPONENT', {
                                componentName: item.componentName,
                                args: item.args,
                                name: getCurrentEntity(),
                            })
                            //to automatically close the drawyer when less than medium device (up to 959 px)
                            if (!matches) {
                                close()
                            }
                        }
                    }}>
                    {
                        <ListItemIcon
                            style={{
                                color: theme.palette.success.light,
                                marginLeft: `${item.children ? 0 : '2rem'}`,
                            }}>
                            {iconMap[item.name]}
                        </ListItemIcon>
                    }
                    <ListItemText primary={item.label}></ListItemText>
                    {getUpDownArrowIcon(item, index)}
                </ListItem>
            )
            const collapse = item.children && (
                <Collapse
                    key={index + 100}
                    in={meta.current.openArray[index]}
                    timeout="auto"
                    unmountOnExit>
                    <Divider />
                    <List component="div" disablePadding>
                        {getListItems(item)}
                    </List>
                </Collapse>
            )
            listItems.push(listItem)
            collapse && listItems.push(collapse)
        })

        return listItems
    }

    // When mouse is clicked away from drawyer then if less than md or 960 px or !matches then if drawyer is open then close it.
    // The mouseEvent and touchevent attributes are important
    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={handleClickAway}>
            <List
                style={{
                    background: theme.palette.primary.dark,
                    color: theme.palette.primary.contrastText,
                }}>
                {getListItems(props?.value)}
            </List>
        </ClickAwayListener>
    )

    function handleClickAway() {
        if (!matches) {
            if (open) {
                close()
            }
        }
    }
}
export { TraceLeftMenu }
