import React, { useState, useEffect, useRef } from 'react'
import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleCrown, useStyles } from './sale-crown-hook'

function SaleCrown({ arbitraryData, saleType, drillDownEditAttributes }: any) {
    // const [, setRefresh] = useState({})
    const classes = useStyles()
    const { getError, handleSubmit, meta } = useSaleCrown(
        arbitraryData,
        saleType,
        drillDownEditAttributes
    )

    const {
        Button,
        CheckIcon,
        emit,
        ErrorIcon,
        toDecimalFormat,
        Typography,
    } = useSharedElements()

    return (
        <div className={classes.content}>
            <div className="sales-crown">
                <Typography variant="h6" className="crown-title">
                    {meta.current.title}
                </Typography>
                {/* <Button
                onClick={()=>emit('SALE-VIEW-HOOK-GET-SALE-ON-ID',9779)}
                >Test</Button> */}
                <div className="crown-content">
                    <Typography variant="subtitle1">
                        Total debits:{' '}
                        {toDecimalFormat(arbitraryData.footer.amount)}
                    </Typography>

                    <Typography variant="subtitle1">
                        Total credits:{' '}
                        {toDecimalFormat(arbitraryData.summary.amount)}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        style={{
                            color:
                                Math.abs(
                                    arbitraryData.footer.amount -
                                        arbitraryData.summary.amount
                                ) === 0
                                    ? 'dodgerBlue'
                                    : 'red',
                        }}>
                        Diff:{' '}
                        {toDecimalFormat(
                            Math.abs(
                                arbitraryData.footer.amount -
                                    arbitraryData.summary.amount
                            )
                        )}
                    </Typography>
                    <Button
                        className="submit"
                        variant="contained"
                        size="small"
                        color="secondary"
                        onClick={handleSubmit}
                        startIcon={
                            getError() ? (
                                <ErrorIcon color="error" />
                            ) : (
                                <CheckIcon style={{ color: 'white' }} />
                            )
                        }
                        disabled={getError()}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export { SaleCrown }
