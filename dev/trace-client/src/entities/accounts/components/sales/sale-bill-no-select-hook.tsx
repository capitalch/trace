import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Theme, createStyles, Typography } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'

function useSaleBillNoSelect() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        searchFilter: '',
        dialogConfig: {
            title: 'Select a sale bill to return',
            subtitle: 'Search on part of bill no, product label, brand name, product code, upc code, category name or product information',
            content: () => { },
            actions: () => { },
        },
        saleBillsList: [],
    })
    const { Avatar, emit, execGenericView, getFromBag, List, ListItem, ListItemAvatar, ListItemText, moment, toDecimalFormat, TraceSearchBox } = useSharedElements()
    useEffect(() => {
        meta.current.isMounted = true

        return (() => { meta.current.isMounted = false })
    }, [])
    const classes = useStyles()

    function handleSelect(e: any) {
        meta.current.searchFilter = ''
        meta.current.saleBillsList = []
        meta.current.dialogConfig.content = () => {
            return (<div className={classes.dialog}>
                <Typography className='subtitle'>{meta.current.dialogConfig.subtitle}</Typography>
                <TraceSearchBox meta={meta} onChange={onChange} onClear={handleClear} onSearch={handleSearch} />
                <Typography variant='caption'>{String(meta.current.saleBillsList?.length || '').concat(' ', 'items')}</Typography>
                <List className='list'>
                    {meta.current.saleBillsList}
                </List>
            </div>)
        }

        meta.current.showDialog = true
        meta.current.isMounted && setRefresh({})

        function onChange() {
            if (!meta.current.searchFilter) {
                handleClear()
            }
        }

        function handleClear() {
            meta.current.saleBillsList = []
            meta.current.isMounted && setRefresh({})
        }

        async function handleSearch() {
            emit('SHOW-LOADING-INDICATOR', true)
            try {
                const dateFormat = getFromBag('dateFormat')
                const result: any = await execGenericView({
                    sqlKey: 'getJson_search_saleBill',
                    isMultipleRows: true,
                    args: {
                        arg: meta.current.searchFilter
                    }
                })
                meta.current.saleBillsList = result?.map((item: any, index: number) => {
                    return (
                        <ListItem className='list-item'
                            alignItems='flex-start'
                            key={index}
                            dense={true}
                            divider={true}
                            onClick={
                                (e: any) => {
                                    // saleBill.id = item.id
                                    // emit('SALE-VIEW-HOOK-GET-SALE-ON-ID', item.id)
                                    meta.current.showDialog = false
                                    meta.current.isMounted && setRefresh({})
                                }
                            }
                            button={true}>
                            <ListItemAvatar>
                                <Avatar>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                // primary={`${moment(item.tranDate).format('DD/MM/YYYY')}, ${item.autoRefNo}, ${toDecimalFormat(item.amount)}`}
                                primary={
                                    <div className='primary'>
                                        <Typography component='li' variant='body1'>{moment(item.tranDate).format(dateFormat)}</Typography>
                                        <Typography component='li' variant='body1'>{', '.concat(item.autoRefNo)}</Typography>
                                        <Typography component='li' variant='body1' className='amount'>{toDecimalFormat(item.amount)}</Typography>
                                    </div>
                                }

                                secondary={
                                    <>
                                        {/* <Typography component='li' variant = 'body1' className='amount'>{toDecimalFormat(item.amount)}</Typography> */}
                                        <Typography component='li' variant='body2'>{item.products}</Typography>
                                        <Typography component='li' variant='body2'>{item.remarks}</Typography>
                                        <Typography component='li' variant='body2'>{Object.values(item.contacts || '').join(',')}</Typography>
                                    </>
                                }
                            />
                        </ListItem>
                    )
                })
                meta.current.isMounted && setRefresh({})
            } catch (e:any) {
                console.log(e.message)
            }
            emit('SHOW-LOADING-INDICATOR', false)
        }
    }
    return ({ handleSelect, meta })
}

export { useSaleBillNoSelect }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({

        content: {
            // width: '100%',
            marginTop: theme.spacing(2),
            '& .button': {
                marginLeft: theme.spacing(5),
            },
            '& .search-icon': {
                marginLeft: theme.spacing(1)
            },
            '& .amount': {
                color: 'dodgerBlue',
                textAlign: 'right'
            },
            '& .input': {
                color: theme.palette.indigo.main
            }

        },
        dialog: {

            '& .subtitle': {
                marginBottom: theme.spacing(2),
                color: theme.palette.purple.main,
                fontSize: '0.8rem',
            },

            '& .list': {
                '& .list-item': {
                    '& .primary': {
                        display: 'flex',
                        '& .amount': {
                            marginLeft: 'auto',
                            color: 'dodgerBlue',
                            fontWeight: 'bold'
                        }
                    }
                }
            },

        }
    })
)
export { useStyles }