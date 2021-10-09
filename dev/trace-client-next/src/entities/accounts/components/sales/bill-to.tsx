import { useState } from '../../../../imports/regular-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useBillTo, useStyles } from './bill-to-hook'

function BillTo({ arbitraryData }: any) {
    const [, setRefresh] = useState({})
    const classes = useStyles(arbitraryData)
    const pre: any = arbitraryData.billTo
    const {
        allErrors,
        handleClear,
        handleNewEdit,
        handleSearch,
        meta,
        onSearchBoxFilter,
    } = useBillTo(arbitraryData)

    const {
        Button,
        CloseIcon,
        emit,
        IconButton,
        InputAdornment,
        Paper,
        SearchIcon,
        TextField,
        TraceDialog,
        Typography,
    } = useSharedElements()

    const { billToError, gstinError } = allErrors()
    return (
        <Paper elevation={2} className={classes.content}>
            <Typography variant="subtitle1" component="div" color="primary">
                Bill to
            </Typography>
            <div className="bill-to-wrapper">
                <div className="bill-to">
                    <TextField
                        autoFocus={true}
                        variant='standard'
                        className="search-box"
                        placeholder="Search on mobile, email, name"
                        id="search-field"
                        value={meta.current.searchFilter || ''}
                        error={billToError()}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            meta.current.searchFilter = ''
                                            meta.current.isMounted &&
                                                setRefresh({})
                                        }}>
                                        <CloseIcon></CloseIcon>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            meta.current.searchFilter = e.target.value
                            meta.current.isMounted && setRefresh({})
                        }}
                        onKeyDown={(e: any) => {
                            if (e.keyCode === 13) {
                                handleSearch()
                            }
                        }}></TextField>

                    {/* Search */}
                    <Button
                        className="search-button"
                        variant="contained"
                        size="small"
                        onClick={handleSearch}>
                        Search
                    </Button>

                    {/* New / Edit */}
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={handleNewEdit}>
                        New / Edit
                    </Button>

                    {/* Clear */}
                    <Button
                        className="clear-button"
                        variant="contained"
                        size="small"
                        onClick={handleClear}>
                        Clear
                    </Button>

                    <TextField
                        className="gstin"
                        variant='standard'
                        placeholder="Gstin"
                        error={gstinError()}
                        value={arbitraryData.billTo.gstin || ''}
                        onChange={(e) => {
                            arbitraryData.billTo.gstin = e.target.value
                            meta.current.isMounted && setRefresh({})
                            emit('SALES-CROWN-REFRESH', null)
                        }}
                    />
                </div>


            </div>

            <div className="bill-to-address">
                <label>
                    <span>Id:</span> {pre.id}
                </label>
                <label>
                    <span>Name:</span> {pre.contactName}
                </label>
                <label>
                    <span>Mobile:</span> {pre.mobileNumber}
                </label>
                <label>
                    <span>Email:</span> {pre.email}
                </label>
                <label>
                    <span>Address1:</span> {pre.address1}
                </label>
                <label>
                    <span>Address2:</span> {pre.address2}
                </label>
                <label>
                    <span>Country:</span> {pre.country?.label}
                </label>
                <label>
                    <span>State:</span> {pre.state?.label}
                </label>
                <label>
                    <span>State code:</span> {pre.state?.stateCode}
                </label>
                <label>
                    <span>City:</span> {pre.city?.label}
                </label>
                <label>
                    <span>Pin:</span> {pre.pin}
                </label>
                <label>
                    <span>Gstin:</span> {pre.gstin}
                </label>

                <IconButton
                    aria-label="clear"
                    size="small"
                    disabled={arbitraryData.isSalesReturn}
                    onClick={handleClear}>
                    <CloseIcon />
                </IconButton>
            </div>
            <TraceDialog meta={meta} onSearchBoxFilter={onSearchBoxFilter} />
        </Paper>
    )
}

export { BillTo }
