import { useState } from '../../../../imports/regular-imports'
import {
    Box,
    TextField,
    Typography,
    IconButton,
} from '../../../../imports/gui-imports'
import { SyncSharp } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'
import { useTaxation, useStyles } from './taxation-hook'

function Taxation() {
    const [, setRefresh] = useState({})
    const classes = useStyles()
    const { GstReport1, handleFetchData, meta } = useTaxation()
    const {} = useSharedElements()
    return (
        <div className={classes.content}>
            <Box className="header">
                <Typography variant="h6" component="span">
                    Gst report
                </Typography>
                <TextField
                    label="From date"
                    variant="standard"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e: any) => {
                        meta.current.startDate = e.target.value
                        meta.current.isMounted && setRefresh({})
                    }}
                    onFocus={(e:any) => e.target.select()}
                    value={meta.current.startDate || ''}
                />

                <TextField
                    type="date"
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    label="To date"
                    onFocus={(e:any) => e.target.select()}
                    onChange={(e: any) => {
                        meta.current.endDate = e.target.value
                        meta.current.isMounted && setRefresh({})
                    }}
                    value={meta.current.endDate || ''}
                />
                <IconButton
                    className="sync-class"
                    size="medium"
                    color="secondary"
                    onClick={handleFetchData}>
                    <SyncSharp></SyncSharp>
                </IconButton>
            </Box>
            <GstReport1 />
        </div>
    )
}

export { Taxation }
