import { Typography } from '@material-ui/core'
import { useSharedElements } from '../shared-elements-hook'
import { useTrackSaleSms, useStyles } from './track-sale-sms-hook'

function TrackSaleSms() {
    const {
        getColumns,
        handleSendSms,
        handleRefresh,
        meta,
        setRefresh,
    } = useTrackSaleSms()
    const { Button, DataTable, Column, TextField } = useSharedElements()
    const styles = useStyles()

    return (
        <div className={styles.content}>
            <Typography  variant="subtitle1" component="div" className='title'>
                {meta.current.title}
            </Typography>
            <div className="header">
                <TextField
                    type="date"
                    onChange={(e) => {
                        meta.current.selectedDate = e.target.value
                        meta.current.isMounted && setRefresh({})
                    }}
                    value={meta.current.selectedDate || ''}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRefresh}>
                    Refresh
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSendSms}>
                    Send sms
                </Button>
            </div>
            <DataTable
                className="data-table"
                // dataKey="id"
                selectionMode="multiple"
                selection={meta.current.selectedRows}
                onSelectionChange={(e) => {
                    meta.current.selectedRows = e.value
                    meta.current.isMounted && setRefresh({})
                }}
                value={meta.current.saleData}
                header={meta.current.tableHeader}>
                {getColumns()}
            </DataTable>
        </div>
    )
}

export { TrackSaleSms }
