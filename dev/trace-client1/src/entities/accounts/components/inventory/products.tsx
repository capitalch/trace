import { Box, Button, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, Input, NumberFormat, TextField, Tooltip, Typography, useSharedElements, useTheme } from './redirect'
import { NewProduct } from './new-product'


// import { useSharedElements } from '../common/shared-elements-hook'
// import { Box, Typography } from '../../../../imports/gui-imports'
import { useProducts, useStyles } from './products-hook'

function Products() {
    const { getXXGridParams, handleCloseDialog, meta } = useProducts()
    const classes = useStyles()
    const { getGridReportSubTitle, TraceDialog, XXGrid } = useSharedElements()
    const pre = meta.current
    const {
        columns,
        gridActionMessages,
        queryId,
        queryArgs,
        summaryColNames,
        specialColumns,
    } = getXXGridParams()

    return (
        <Box className={classes.content}>
            <Typography variant="subtitle1" component="div" color="secondary">
                Products
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                className="xx-grid"
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                title="All products view"
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="1000"
            />
            <Dialog
                open={pre.showDialog}
                onClose={(e, reason) => {
                    if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                        handleCloseDialog()
                    }
                }}
                fullWidth={true}>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h6'>{pre.title}</Typography>
                        <Tooltip title="Close">
                            <IconButton
                                size="small"
                                disabled={false}
                                onClick={handleCloseDialog}>
                                <CloseSharp />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <NewProduct onClose={handleCloseDialog} product={pre.product} />
                </DialogContent>
            </Dialog>
            {/* <TraceDialog meta={meta} onClose={handleCloseDialog} /> */}
        </Box>
    )
}
export { Products }