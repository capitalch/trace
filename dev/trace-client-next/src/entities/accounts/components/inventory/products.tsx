import { Box, Button, CloseSharp, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography, useSharedElements, utilMethods } from './redirect'
import { NewProduct } from './new-product'
import { useProducts, useStyles } from './products-hook'

function Products() {
    const { getXXGridParams, handleCloseDialog, handleSubmit, meta } = useProducts()
    const classes = useStyles()
    const { getGridReportSubTitle, XXGrid } = useSharedElements()
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" component="div" color="secondary">
                    Products
                </Typography>
                <Button color='secondary' size='small' variant='contained' disabled={!pre.isDataChanged}
                    onClick={handleSubmit}
                >Submit</Button>
            </Box>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                className="xx-grid"
                sharedData={pre.sharedData}
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                subTitle={getGridReportSubTitle()}
                title="All products view"
                summaryColNames={summaryColNames}
                toShowAddButton={true}
                viewLimit="1000"
                // xGridProps={{ onCellClick: handleCellClicked }}
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
