import { useConfirm, useState, } from '../imports/regular-imports'
import {
    Box,
    Button,
    IconButton,
    Input,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    InputAdornment,
    TextField, useTheme
} from '../imports/gui-imports'

import {
    Save,
    Search,
    CloseSharp,
    PageviewTwoTone,
} from '../imports/icons-import'
import messages from '../messages.json'

function useTraceMaterialComponents() {
    const [, setRefresh] = useState({})
    const confirm = useConfirm()

    function BasicMaterialDialog({ parentMeta }: any) {
        const [, setRefresh] = useState({})
        const pre = parentMeta.current
        const dialogConfig = pre.dialogConfig
        const theme = useTheme()
        return (<Dialog
            fullWidth={pre.dialogConfig.fullWidth===undefined ?? true}
            fullScreen= {pre.dialogConfig.fullScreen || false}
            maxWidth={pre.dialogConfig.maxWidth || 'xl'}

            sx={{minHeight:theme.spacing(40)}}
            open={pre.showDialog}
            onClose={(e, reason) => {
                if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                    handleClose()
                }
            }}>

            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>{dialogConfig.title}</Box>
                <IconButton
                    sx={{ mr: -2.5 }}
                    size="small"
                    color="default"
                    onClick={handleClose}
                    aria-label="close">
                    <CloseSharp />
                </IconButton>
            </DialogTitle>
            <DialogContent >
                {dialogConfig.content && <dialogConfig.content />}
            </DialogContent>
        </Dialog>)

        function handleClose() {
            pre.showDialog = false
            setRefresh({})
        }
    }

    interface TraceDialogOptions {
        meta: any
        onClose?: any
        onSubmit?: any
        materialDialogProps?: any
        onSearchBoxFilter?: any
        sx?:any
    }

    // You can have className in materialDialogProps with double braces as {{className: 'classes.dialog'}}. Then this supplied class will supercede. There will not be any merging
    function TraceDialog(options: TraceDialogOptions) {
        const [, setRefresh] = useState({})
        const pre = options.meta.current.dialogConfig
        return (
            <Dialog
                fullWidth={true}
                sx={styles.dialog}
                // className={classes.dialog}
                {...options.materialDialogProps}
                open={options.meta.current.showDialog}
                // onClose={options.onClose || handleClose}
                onClose={(e, reason) => {
                    if (!['escapeKeyDown', 'backdropClick'].includes(reason)) {
                        options.onClose || handleClose()
                    }
                }}
            >

                <DialogTitle id="generic-dialog-title" className="dialog-title">
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box>{pre.title}</Box>
                        <Box sx={{ fontSize: 14, }}>{pre.subTitle || ''}</Box>
                    </Box>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={options.onClose || handleClose}
                        aria-label="close">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={styles.dialogContent}>
                    {pre.isSearchBox && (
                        <Input
                            autoFocus={true}
                            placeholder="Search"
                            value={
                                options.meta.current?.dialogConfig
                                    ?.searchBoxFilter || ''
                            }
                            onChange={(e: any) => {
                                pre.searchBoxFilter = e.target.value
                                options.onSearchBoxFilter &&
                                    options.onSearchBoxFilter()
                                setRefresh({})
                            }}
                            startAdornment={
                                <InputAdornment position="end">
                                    <Search />
                                </InputAdornment>
                            }
                            endAdornment={
                                <IconButton
                                    size="small"
                                    onClick={(e: any) => {
                                        pre.searchBoxFilter = ''
                                        options.onSearchBoxFilter &&
                                            options.onSearchBoxFilter()
                                        setRefresh({})
                                    }}>
                                    {/* don't show icon when less than medium device */}
                                    {<CloseSharp></CloseSharp>}
                                </IconButton>
                            }
                        />
                    )}
                    <br />
                    <options.meta.current.dialogConfig.content />
                </DialogContent>
                <DialogActions>
                    {options.meta.current.dialogConfig.actions()}
                </DialogActions>
            </Dialog>
        )

        function handleClose() {
            options.meta.current.showDialog = false
            options.meta.current.isMounted && setRefresh({})
        }
    }

    function TraceFullWidthSubmitButton({
        onClick,
        disabled,
        style = {},
        ref,
    }: {
        onClick: any
        disabled?: boolean
        style?: any
        ref?: any
    }) {
        const btn = (
            <Button
                ref={ref}
                style={{ ...style }}
                disabled={disabled}
                fullWidth
                variant="contained"
                startIcon={<Save></Save>}
                sx={styles.submitButtonStyle}
                // className={classes.submitButtonStyle}
                color="secondary"
                onClick={onClick}>
                Submit
            </Button>
        )
        return btn
    }

    function traceGlobalSearch({ meta, isMediumSizeUp }: any) {
        return (
            <TextField
                id="global-search-field"
                variant="standard"
                value={meta.current.globalFilter}
                placeholder="Global search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={(e: any) => {
                                    meta.current.globalFilter = ''
                                    meta.current.isMounted && setRefresh({})
                                }}>
                                {/* don't show icon when less than medium device */}
                                {isMediumSizeUp && <CloseSharp></CloseSharp>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                onChange={(e: any) => {
                    meta.current.globalFilter = e.target.value
                    meta.current.isMounted && setRefresh({})
                }}></TextField>
        )
    }

    interface SearchBoxOptions {
        onBlur?: any
        onChange?: any
        onClear?: any
        placeholder?: string
        meta: any
        onSearch: any
        className?: string
    }

    function TraceSearchBox(options: SearchBoxOptions) {
        const [, setRefresh] = useState({})
        return (
            <Box sx={styles.searchBox}>
                <TextField
                    variant='standard'
                    sx={{ minWidth: '15ch', maxWidth: '30ch' }}
                    autoFocus={true}
                    placeholder={options.placeholder || 'Search'}
                    value={options?.meta?.current?.searchFilter || ''}
                    onBlur={options.onBlur}
                    onKeyDown={(e: any) => {
                        if (e.keyCode === 13) {
                            handleSearchButtonClick()
                        }
                    }}
                    onChange={(e: any) => {
                        options.meta.current.searchFilter = e.target.value
                        options.meta.current.searchResult = ''
                        options.meta.current.isMounted && setRefresh({})
                        options.onChange && options.onChange(e)
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="start">
                                <IconButton
                                    size="small"
                                    onClick={(e: any) => {
                                        options.meta.current.searchFilter = ''
                                        options.meta.current.isMounted &&
                                            setRefresh({})
                                        options.onClear && options.onClear()
                                    }}>
                                    {/* don't show icon when less than medium device */}
                                    {<CloseSharp></CloseSharp>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    className="search-button"
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleSearchButtonClick}
                    endIcon={<PageviewTwoTone />}>
                    Search
                </Button>
            </Box>
        )

        function handleSearchButtonClick() {
            if (options.meta.current.searchFilter) {
                options.onSearch()
            } else {
                const opts: any = {
                    description: messages.giveSearchCriteria,
                    title: messages.emptySearchCriteria,
                    cancellationText: undefined,
                }
                confirm(opts)
            }
        }
    }

    return {
        BasicMaterialDialog,
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
    }
}
export { useTraceMaterialComponents }

const styles = {
    dialog: {
        '& .dialog-title': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0px',
            paddingRight: 2.0, // useTheme().spacing(2.0),
        },

        '& .MuiInputBase-root': {
            width: 50, //useTheme().spacing(50),
            marginBottom: 2, // useTheme().spacing(2),
        },
    },

    dialogContent: {
        '& .serial-number': {
            width: '100%',
            fontSize: '1.2rem',
            fontFamily: 'roboto'
        },
        '& .MuiInputBase-root': {
            width: '80%'
        }
    },

    submitButtonStyle: {
        marginLeft: 2, //useTheme().spacing(2),
        marginTop: -4, //-useTheme().spacing(1),
        marginRight: 2, //useTheme().spacing(2),
    },

    searchBox: {
        '& .search-button': {
            marginLeft: 2, //useTheme().spacing(2),
        },
        '& .MuiInputBase-root': {
            width: '100%'
        }
    },

    traceNumeric: {
        '& input': {
            textAlign: 'end',
        },
    },
}