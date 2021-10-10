import { useSharedElements } from '../shared/shared-elements-hook'
import { useShipTo, useStyles } from './ship-to-hook'
import {
    Button,
    IconButton,
    Typography,
    Paper,
} from '../../../../imports/gui-imports'
import { CloseIcon } from '../../../../imports/icons-import'
function ShipTo({ arbitraryData }: any) {
    const classes = useStyles()
    const shipTo = arbitraryData.shipTo
    const { handleClear, handleNewEdit, meta } = useShipTo(arbitraryData)

    const { TraceDialog } = useSharedElements()
    return (
        <Paper elevation={2} className={classes.content}>
            <Typography variant="subtitle1" component="div" color="primary">
                Ship to
            </Typography>
            <Button
                size="small"
                onClick={handleNewEdit}
                variant="contained"
                color="primary"
                disabled={arbitraryData.isSalesReturn}
                className="new-button">
                New / Edit
            </Button>
            <div className="ship-to-address">
                <label>
                    <span>Name:</span> {shipTo.contactName}
                </label>
                <label>
                    <span>Mobile:</span> {shipTo.mobileNumber}
                </label>
                <label>
                    <span>Email:</span> {shipTo.email}
                </label>
                <label>
                    <span>Address1:</span> {shipTo.address1}
                </label>
                <label>
                    <span>Address2:</span> {shipTo.address2}
                </label>
                <label>
                    <span>Country:</span> {shipTo.country}
                </label>
                <label>
                    <span>State:</span> {shipTo.state}
                </label>
                <label>
                    <span>City:</span> {shipTo.city}
                </label>
                <label>
                    <span>Pin:</span> {shipTo.pin}
                </label>
                <IconButton
                    aria-label="clear"
                    size="small"
                    disabled={arbitraryData.isSalesReturn}
                    onClick={handleClear}>
                    <CloseIcon />
                </IconButton>
            </div>
            <TraceDialog meta={meta} />
        </Paper>
    )
}

export { ShipTo }
