import {
    _,
    moment,
    PrimeColumn,
    DataTable,
    useState,
    useEffect,
    useRef,
} from '../../../../imports/regular-imports'
import {
    IconButton,
    makeStyles,
    Theme,
    createStyles,
} from '../../../../imports/gui-imports'
import { Search } from '../../../../imports/icons-import'
import { useSharedElements } from '../shared/shared-elements-hook'

function useTaxation() {
    const [, setRefresh] = useState({})
    const { emit, execGenericView, getFromBag, toDecimalFormat } =
        useSharedElements()

    useEffect(() => {
        meta.current.isMounted = true
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const meta: any = useRef({
        data: [],
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        isMounted: false,
        showDialog: false,
        summary: {
            amount: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
        },
        dialogConfig: {
            title: '',
            content: () => {},
            actions: () => {},
        },
    })
    const summ = meta.current.summary
    function GstReport1() {
        return (
            <DataTable
                className="data-table"
                rowHover={true}
                scrollable={true}
                scrollHeight="calc(100vh - 24rem)"
                value={meta.current.data}>
                {getColumns()}
            </DataTable>
        )

        function getColumns() {
            let numb = 0
            function incr() {
                return numb++
            }
            return [
                <PrimeColumn
                    header="D"
                    key={incr()}
                    style={{ width: '2.1rem', textAlign: 'left' }}
                    body={actionTemplate}
                />,
                <PrimeColumn
                    header="Ref no"
                    key={incr()}
                    style={{ width: '10rem' }}
                    field="autoRefNo"
                    footer="Rows:"
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="Date"
                    key={incr()}
                    style={{ width: '5rem' }}
                    field="tranDate"
                    footer={
                        meta.current?.data.length >= 0
                            ? meta.current.data.length
                            : 0
                    }
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="Account name"
                    key={incr()}
                    style={{ width: '8rem' }}
                    field="accName"
                    footer=""
                />,
                <PrimeColumn
                    header="Gstin"
                    key={incr()}
                    style={{ width: '8rem' }}
                    field="gstin"
                    footer=""
                />,
                <PrimeColumn
                    header="Amount"
                    key={incr()}
                    style={{ width: '6rem', textAlign: 'right' }}
                    field="amount"
                    footer={toDecimalFormat(summ.amount)}
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="Cgst"
                    key={incr()}
                    style={{ width: '6rem', textAlign: 'right' }}
                    field="cgst"
                    footer={toDecimalFormat(summ.cgst)}
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="Sgst"
                    key={incr()}
                    style={{ width: '6rem', textAlign: 'right' }}
                    field="sgst"
                    footer={toDecimalFormat(summ.sgst)}
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="Igst"
                    key={incr()}
                    style={{ width: '6rem', textAlign: 'right' }}
                    field="igst"
                    footer={toDecimalFormat(summ.igst)}
                    footerClassName="footer"
                />,
                <PrimeColumn
                    header="User ref"
                    key={incr()}
                    style={{ width: '8rem' }}
                    field="userRefNo"
                    footer=""
                />,
                <PrimeColumn
                    header="Input"
                    key={incr()}
                    style={{ width: '4rem' }}
                    // field={isInput}
                    footer=""
                />,
            ]
            function actionTemplate(node: any) {
                return (
                    <IconButton
                        color="secondary"
                        onClick={(e: any) => {
                            // emit('LOAD-MAIN-COMPONENT-EDIT', {
                            //     headerId: node.headerId,
                            // })
                            // closeDialog()
                        }}>
                        {node.headerId && (
                            <Search
                                style={{
                                    fontSize: '1rem',
                                    marginLeft: '-0.5rem',
                                }}></Search>
                        )}
                    </IconButton>
                )
            }
        }
    }

    async function handleFetchData() {
        emit('SHOW-LOADING-INDICATOR', true)
        const data: any[] = await execGenericView({
            sqlKey: 'get_gst_header_report',
            isMultipleRows: true,
            args: {
                startDate: meta.current.startDate,
                endDate: meta.current.endDate,
            },
        })
        emit('SHOW-LOADING-INDICATOR', false)
        summ.amount = 0
        summ.cgst = 0
        summ.sgst = 0
        summ.igst = 0

        meta.current.data = data.map((item: any) => {
            summ.amount = summ.amount + item.amount
            summ.cgst = summ.cgst + item.cgst
            summ.sgst = summ.sgst + item.sgst
            summ.igst = summ.igst + item.igst
            return {
                ...item,
                tranDate: moment(item.tranDate).format(
                    getFromBag('dateFormat')
                ),
                amount: toDecimalFormat(item.amount),
                cgst: toDecimalFormat(item.cgst),
                sgst: toDecimalFormat(item.sgst),
                igst: toDecimalFormat(item.igst),
            }
        })
        // console.log(JSON.stringify(meta.current.data))
        meta.current.isMounted && setRefresh({})
    }

    return { GstReport1, handleFetchData, meta }
}

export { useTaxation }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .header': {
                marginTop: theme.spacing(2),
                display: 'flex',
                alignItems: 'center',
                columnGap: theme.spacing(4),
                flexWrap: 'wrap',
            },
            '& .sync-class': {
                position: 'relative',
                top: theme.spacing(1),
            },
            '& .data-table': {
                marginTop: theme.spacing(2),
                '& .footer': {
                    color: 'dodgerBlue',
                    fontSize: '0.8rem',
                    alignText: 'right',
                    fontWeight: 'normal',
                    // marginRight: '-1rem'
                    // position: 'relative',
                },
                // '& .right-aligned': {
                //     textAlign: 'right'
                // }
            },
        },
    })
)

export { useStyles }
