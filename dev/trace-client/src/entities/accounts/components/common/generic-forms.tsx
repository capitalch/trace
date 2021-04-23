import { useEffect, useState, useRef } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, Box, useTheme, Paper, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ViewIcon from '@material-ui/icons/Visibility'
import SaveIcon from '@material-ui/icons/SaveSharp'
import CancelIcon from '@material-ui/icons/BlockSharp'
import moment from 'moment'
import { usingIbuki } from '../../../../common-utils/ibuki'
import { manageFormsState } from '../../../../react-form/core/fsm'
import { manageEntitiesState } from '../../../../common-utils/esm'
import ReactForm from '../../../../react-form/react-form'
import { utilMethods } from '../../../../common-utils/util-methods'
import messages from '../../../../messages.json'
import { useTraceGlobal } from '../../../../common-utils/trace-global'
import payments from '../../json/payments.json'
import receipts from '../../json/receipts.json'
import contra from '../../json/contra.json'
import journals from '../../json/journals.json'

function GenericForms({ loadComponent }: any) {
    const meta: any = useRef({
        formId: '',
        formName: '',
        jsonOrig: {},
        jsonClonedXsSm: {},
        jsonCloned: {},
        title: '',
        dateFormat: 'YYYY-MM-DD',
        noOfColumns: 0,
        isStable: false,
    })
    const { getCurrentMediaSize, isMediumSizeUp } = useTraceGlobal()
    const classes = useStyles({ meta })
    const {
        getCurrentEntity,
        getCurrentComponent,
        setCurrentFormId,
    } = manageEntitiesState()
    const { emit } = usingIbuki()
    const [, setRefresh] = useState({})
    const { isControlDisabled } = utilMethods()
    const {
        resetAllValidators,
        resetForm,
        getValidationFabric,
        setFormError,
        resetAllFormErrors,
    } = manageFormsState()
    const { isValidForm, doValidateForm } = getValidationFabric()

    const theme = useTheme()
    const jsonMap: any = {
        payments: payments,
        receipts: receipts,
        contra: contra,
        journals: journals,
    }

    useEffect(() => {
        meta.current.isStable = true
        meta.current.isMounted = true
        init()
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    function Ret() {
        let ret = <></>
        if (meta.current.isStable) {
            ret = (
                <Paper elevation={0} className={classes.content}>
                    <Header></Header>
                    <Body></Body>
                    <Footer></Footer>
                </Paper>
            )
        }
        return ret
    }

    return <Ret></Ret>

    // generate the body from JSON object
    function Body() {
        let ret = <></>
        if (meta.current.formId) {
            resetAllValidators(meta.current.formId)
            ret = (
                <ReactForm
                    formId={meta.current.formId}
                    jsonText={JSON.stringify(meta.current.jsonCloned)}
                    name={getCurrentEntity()}></ReactForm>
            )
        }
        return ret
    }

    function Header() {
        return (
            <Box className="form-header">
                <Typography color="secondary" variant={'h6'} component="span">
                    {meta.current.title}
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className="form-new"
                        onClick={(e) => {
                            emit('LOAD-MAIN-COMPONENT-NEW', '')
                        }}
                        startIcon={<AddIcon></AddIcon>}>
                        New
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        className="form-view"
                        onClick={(e) => {
                            emit('LOAD-MAIN-COMPONENT-VIEW', '')
                        }}
                        startIcon={<ViewIcon></ViewIcon>}>
                        View
                    </Button>
                </Box>
            </Box>
        )
    }

    function Footer() {
        //maps the voucher type to controlName in permission-control-names file
        const ifElsePermissionMap: any = {
            payments: 'paymentsEntry',
            receipts: 'receiptsEntry',
            contra: 'contraEntry',
            journals: 'journalsEntry',
        }
        return (
            <Box className="form-footer">
                <Button
                    variant="contained"
                    size="large"
                    style={{
                        backgroundColor: theme.palette.amber.dark,
                        color: theme.palette.common.white,
                    }}
                    className="form-reset"
                    onClick={handleFormReset}
                    startIcon={<CancelIcon fontSize="large"></CancelIcon>}>
                    Reset
                </Button>
                <Button
                    variant="contained"
                    disabled={isControlDisabled(
                        ifElsePermissionMap[loadComponent]
                    )}
                    color="secondary"
                    size="large"
                    className="form-submit"
                    onClick={handleFormSubmit}
                    style={{ maxWidth: '15rem', width: '95%' }}
                    startIcon={<SaveIcon fontSize="large"></SaveIcon>}>
                    Submit
                </Button>
            </Box>
        )
    }

    function init() {
        selectLogic() // select the form based on user input
        processMediaSize() //Based on viewport size do some adjustments
        meta.current.isMounted && setRefresh({})
    }

    function selectLogic() {
        const logic: any = {
            payments: () => {
                meta.current.formName = 'payments'
                meta.current.formId = 'trace-accounts-payments'
            },
            receipts: () => {
                meta.current.formName = 'receipts'
                meta.current.formId = 'trace-accounts-receipts'
            },
            contra: () => {
                meta.current.formName = 'contra'
                meta.current.formId = 'trace-accounts-contra'
            },
            journals: () => {
                meta.current.formName = 'journals'
                meta.current.formId = 'trace-accounts-journals'
            },
        }
        logic[loadComponent]()
        meta.current.jsonOrig = jsonMap[meta.current.formName]
        meta.current.title = meta.current.jsonOrig.title
        meta.current.dateFormat = 'YYYY-MM-DD'
        setCurrentFormId(meta.current.formId)
    }

    function processMediaSize() {
        const cloned = JSON.parse(JSON.stringify(meta.current.jsonOrig))
        const mediaLogic: any = {
            xs: () => {
                meta.current.jsonCloned = getTrimmedJson(cloned) // removes extra columns which are not required in ex device
                meta.current.noOfColumns = 1 // for xs there is only one columns
            },
            sm: () => {
                meta.current.jsonCloned = getTrimmedJson(cloned) // removes extra columns which are not required in ex device
                meta.current.noOfColumns = 2 // for xs there are two columns
            },
            md: () => {
                meta.current.jsonCloned = cloned // no need to remove any extra column
                meta.current.noOfColumns = 3 // for md there are three columns
            },
            lg: () => {
                meta.current.jsonCloned = cloned // no need to remove any extra column
                meta.current.noOfColumns = 6 // for md there are three columns
            },
            xl: () => {
                meta.current.jsonCloned = cloned // no need to remove any extra column
                meta.current.noOfColumns = 6 // for md there are three columns
            },
        }
        const currentMediaSize = getCurrentMediaSize()
        currentMediaSize && mediaLogic[currentMediaSize]()

        function getTrimmedJson(jsonObj: any) {
            let arr: any[] = jsonObj.items[0].items
            const arrReduced = arr.reduce((prev: any[], curr: any) => {
                if (
                    curr.name !== 'autoRefNo' &&
                    curr.name !== 'tags' &&
                    !curr.disabled
                ) {
                    prev.push(curr)
                }
                return prev
            }, [])
            jsonObj.items[0].items = arrReduced
            // remove disabled items from mobile from details
            arr = jsonObj.items[1].items
            if (arr && arr.length > 1) {
                const arrReduced1 = arr.reduce((prev: any[], curr: any) => {
                    // div1 is used as placeholder in XL device to align the columns
                    if (!(curr.name === 'div1')) {
                        prev.push(curr)
                    }
                    return prev
                }, [])
                jsonObj.items[1].items = arrReduced1
            }
            return jsonObj
        }
    }

    async function handleFormSubmit() {
        const formId = meta.current.formId

        resetAllFormErrors(formId)
        emit('SHOW-LOADING-INDICATOR', true)
        await doValidateForm(formId)
        if (isValidForm(formId)) {
            transformDataAndSubmit()
        } else {
            setFormError(formId, messages.formError)
        }
        emit('SHOW-LOADING-INDICATOR', false)
        meta.current.isMounted && setRefresh({})
    }

    async function handleFormReset() {
        const formId = meta.current.formId
        const mode = getCurrentComponent().mode
        if (mode === 'new') {
            resetForm(formId)
            emit('LOAD-MAIN-COMPONENT-NEW', getCurrentComponent()) // To reload the form for resetting all controls
        } else if (mode === 'edit') {
            emit('LOAD-MAIN-COMPONENT-VIEW', getCurrentComponent())
        }
        meta.current.isMounted && setRefresh({})
    }

    async function transformDataAndSubmit() {
        const formId = meta.current.formId
        const { saveForm, extractAmount, removeProp } = utilMethods()
        const { getFormData, getMetaData } = manageFormsState()

        function getGstDetails(item: any, tableName: string, gst: any) {
            function removeExtraChars(gst1: any) {
                gst1.rate = gst1.rate ? extractAmount(gst1.rate) : 0.0
                gst1.cgst = gst1.cgst ? extractAmount(gst1.cgst) : 0.0
                gst1.sgst = gst1.sgst ? extractAmount(gst1.sgst) : 0.0
                gst1.igst = gst1.igst ? extractAmount(gst1.igst) : 0.0
                gst1.isInput = true
                return gst1
            }
            const extractedGst = removeExtraChars({ ...gst })
            return {
                tableName: tableName,
                fkeyName: 'tranDetailsId',
                data: extractedGst,
            }
        }

        function adjustItems(items: any, dc: string) {
            function pushDetails(item: any, detail: any) {
                if (!item.details) {
                    item.details = []
                }
                item.details.push(detail)
            }
            items.forEach((item: any) => {
                item.dc = dc
                item.amount = extractAmount(item.amount)

                if ('gst' in item) {
                    if (item.gst?.isGst) {
                        removeProp(item.gst, 'isGst') // delete the property otherwise it will create problem while saving in database
                        removeProp(item.gst, 'amount')
                        if (Object.keys(item.gst).length > 0) {
                            const gstDetails = getGstDetails(
                                item,
                                'ExtGstTranD',
                                item.gst
                            )
                            pushDetails(item, gstDetails)
                        }
                    }
                    item.gst = undefined
                }
            })
            return items
        }

        function getVoucher(formId: string) {
            const { getFromBag } = manageEntitiesState()
            const finYearId = getFromBag('finYearObject')?.finYearId
            const branchId = getFromBag('branchObject')?.branchId || 1
            const dateFormat = getFromBag('dateFormat')
            const isoFormat = 'YYYY-MM-DD'
            const voucher: any[] = [
                {
                    tableName: 'TranH',
                    data: [
                        {
                            tranDate: null,
                            userRefNo: null,
                            remarks: null,
                            tags: null,
                            jData: '{}',
                            finYearId: finYearId,
                            branchId: branchId,
                            posId: '1',
                            autoRefNo: null,
                            details: [],
                        },
                    ],
                },
            ]
            const formData = JSON.parse(JSON.stringify(getFormData(formId))) // to deep clone. The object destructuring only does shallow cloning
            const metaData = getMetaData(formId)
            const header = formData.header
            header['tranDate'] = moment(
                header['tranDate'],
                meta.current.dateFormat
            ).format(isoFormat)
            if (metaData && metaData.tranTypeId) {
                header.tranTypeId = metaData.tranTypeId
            }
            let credits = formData.credits
            let debits = formData.debits
            let deletedIds = formData.deletedIds
            if (!Array.isArray(credits)) {
                credits = [credits]
            }
            if (!Array.isArray(debits)) {
                debits = [debits]
            }
            credits = adjustItems(credits, 'C')
            debits = adjustItems(debits, 'D')
            voucher[0].data[0] = Object.assign(voucher[0].data[0], header)
            const dataArray: any[] = credits.concat(debits)
            const detail = {
                tableName: 'TranD',
                fkeyName: 'tranHeaderId',
                data: dataArray,
                deletedIds: deletedIds,
            }
            voucher[0].data[0].details.push(detail)
            return voucher
        }

        const voucher: any = getVoucher(formId)
        const ret = await saveForm({
            data: voucher,
            formId: formId,
        })
        return ret
    }
}

export { GenericForms }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .x-error': {
                margin: 0,
                '& small': {
                    color: 'red',

                    '& ul': {
                        minHeight: '15px',
                        margin: '0px',
                        paddingTop: '3px',
                        paddingLeft: '1.5em',
                    },
                },
            },

            '& .form-header': {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                '& .form-new': {
                    '&:hover': {
                        backgroundColor: theme.palette.cyan.dark,
                        color: theme.palette.grey[200],
                    },
                },

                '& .form-view': {
                    backgroundColor: theme.palette.blue.main,
                    color: theme.palette.common.white,
                    marginLeft: theme.spacing(0.5),
                    '&:hover': {
                        backgroundColor: theme.palette.blue.dark,
                        color: theme.palette.grey[200],
                    },
                },
            },

            '& .form-footer': {
                display: 'flex',
                justifyContent: 'space-around',
                padding: theme.spacing(2),
            },

            '& .x-add-minus': {
                display: 'flex',
                justifyContent: 'center',
            },

            '& .x-debit-credit-total': {
                fontWeight: 'bold',
                color: theme.palette.indigo.main,
                display: 'inline',
            },

            '& .x-add-icon, .x-minus-icon': {
                fontSize: '2.5rem',
            },

            '& .x-set-title': {
                fontWeight: 'bold',
                color: theme.palette.primary.light,
            },

            '& .vouchers': {
                display: 'flex',
                flexDirection: 'column',

                '& .x-header-set': {
                    border: '1px solid lightGrey',
                    display: 'grid',
                    gridTemplateColumns: ({ meta }: any) => {
                        let ret = `repeat(${meta.current.noOfColumns}, 1fr)`
                        return ret
                    },
                    gridGap: theme.spacing(3),
                    padding: theme.spacing(4),
                    marginTop: theme.spacing(1),
                    '& .x-date': {
                        marginTop: '-0.2rem',
                    },
                },

                '& .x-transaction-set': {
                    border: '1px solid lightGrey',
                    display: 'grid',
                    gridTemplateColumns: ({ meta }: any) => {
                        let ret = `repeat(${meta.current.noOfColumns}, 1fr)`
                        if (meta.current.noOfColumns === 6) {
                            ret = 'minmax(10rem, 1.5fr) repeat(5, 1fr)'
                        }
                        return ret
                    },
                    gridGap: theme.spacing(3),
                    padding: theme.spacing(4),
                    marginTop: theme.spacing(1),

                    '& .x-debits-credits': {
                        display: 'flex',
                        width: '30rem',
                        marginTop: '0.5rem',
                        justifyContent: 'space-between',
                        color: theme.palette.blue.main,
                    },
                },

                '&  .x-range-set': {
                    border: '1px solid lightGrey',
                    display: 'grid',
                    gridTemplateColumns: ({ meta }: any) => {
                        let ret = `repeat(${meta.current.noOfColumns}, 1fr)`
                        if (meta.current.noOfColumns === 6) {
                            ret = 'minmax(10rem, 1.5fr) repeat(5, 1fr)'
                        }
                        return ret
                    },
                    padding: theme.spacing(4),
                    gridGap: theme.spacing(3),
                    marginTop: theme.spacing(1),

                    '& .x-amount': {
                        '& input': {
                            textAlign: 'end',
                            marginTop: '-0.2rem',
                        },
                    },

                    '& .x-instr-no': {
                        marginTop: '-0.1rem',
                    },
                },
            },
        },
    })
)
