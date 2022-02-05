import {
    Typography,
    Button,
    Chip,
    Avatar,
    Box,
} from '../../../../imports/gui-imports'
import {
    AccountBalance,
    FlipToFront,
    Cached,
    Save,
} from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useBankRecon, useStyles } from './bank-recon-hook'

function BankRecon() {
    const { doSortOnClearDateTranDateAndId, getXXGridParams, handleCloseDialog,
        handleOnSelectBankClick, handleOpBalanceButtonClick, meta, setRefresh, submitBankRecon } = useBankRecon()
    const {
        emit,
        getGridReportSubTitle,
        TraceDialog,
        useTraceGlobal,
        XXGrid,
    } = useSharedElements()

    const classes = useStyles()
    const { getCurrentWindowSize } = useTraceGlobal()

    const {
        columns,
        gridActionMessages,
        queryArgs,
        queryId,
        specialColumns,
        summaryColNames,
    } = getXXGridParams()

    return (
        <div
            className={classes.content}
            style={{ width: getCurrentWindowSize() }}>
            <Box className="header">
                <Box className="bank">
                    <Typography
                        color="primary"
                        variant='subtitle1'
                        component="span">
                        Reconcillation for
                    </Typography>
                    <Chip
                        avatar={<Avatar>B</Avatar>}
                        label={meta.current.selectedBankName}
                        color="secondary"
                        onClick={handleOnSelectBankClick}
                        size='medium'></Chip>
                </Box>
                <Box component="div" className="all-buttons">
                    {/* Opening */}
                    <Button
                        size="medium"
                        variant="contained"
                        color="success"
                        startIcon={<AccountBalance></AccountBalance>}
                        disabled={!meta.current.selectedBankId}
                        onClick={handleOpBalanceButtonClick}>
                        Opening
                    </Button>

                    {/* rearrange */}
                    <Button
                        size="medium"
                        startIcon={<FlipToFront />}
                        onClick={async (e: any) => {
                            meta.current.testParams = {
                                name: '',
                            }
                            emit(
                                getXXGridParams().gridActionMessages
                                    .calculateBalanceIbukiMessage,
                                doSortOnClearDateTranDateAndId // passed in the sorting function
                            )
                            meta.current.isMounted && setRefresh({})
                        }}
                        variant="contained"
                        color="primary">
                        Rearrange
                    </Button>

                    {/* refresh */}
                    <Button
                        size="medium"
                        startIcon={<Cached></Cached>}
                        className="refresh"
                        onClick={(e: any) => {
                            const queryArgs = getXXGridParams().queryArgs
                            if (queryArgs.accId) {
                                emit(
                                    getXXGridParams().gridActionMessages
                                        .fetchIbukiMessage,
                                    queryArgs
                                )
                            }
                        }}
                        variant="contained">
                        Refresh
                    </Button>

                    {/* submit */}
                    <Button
                        color="secondary"
                        size="medium"
                        startIcon={<Save></Save>}
                        onClick={submitBankRecon}
                        variant="contained">
                        Submit
                    </Button>
                </Box>
            </Box>
            <XXGrid
                className="xx-grid"
                gridActionMessages={gridActionMessages}
                columns={columns}
                editableFields={['clearDate', 'remarks']}
                hideViewLimit={true}
                isReverseOrderByDefault={true}
                isShowColBalanceByDefault={true}
                sharedData={meta.current.sharedData}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title={'Bank reconcillation'}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                jsonFieldPath="jsonResult.bankRecon"
                specialColumns={specialColumns}
                toShowOpeningBalance={true}
                toShowColumnBalanceCheckBox={false}
                toShowClosingBalance={true}
                toShowReverseCheckbox={false}
                viewLimit="1000"
            />
            <TraceDialog
                meta={meta}
                onClose={handleCloseDialog}
            />
        </div>
    )

}

export { BankRecon }