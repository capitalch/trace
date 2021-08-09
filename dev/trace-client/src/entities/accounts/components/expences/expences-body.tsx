import { useEffect, useRef, useState } from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { useSharedElements } from '../common/shared-elements-hook'
import { useExpencesBody, useStyles } from "./expences-body-hook"
import { classNames } from "react-select/src/utils"

function ExpencesBody({ arbitraryData }: any) {
    const { Button, CheckIcon, emit, ErrorIcon, filterOn, TextField } = useSharedElements()
    const { getError, handleSubmit } = useExpencesBody()
    const styles = useStyles()
    return (<div>
        <TextField
            className="auto-ref-no"
            disabled={true}
            label="Ref no"
            value={arbitraryData.autoRefNo || ''}
        /> <SubmitComponent />
    </div>)

    function SubmitComponent() {
        const [, setRefresh] = useState({})
        useEffect(() => {
            const subs1 = filterOn('PURCHASE-BODY-SUBMIT-REFRESH').subscribe(
                () => {
                    setRefresh({})
                }
            )

            return () => {
                subs1.unsubscribe()
            }
        }, [])

        return (
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
        )
    }
}

export { ExpencesBody }

