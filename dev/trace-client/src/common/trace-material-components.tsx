import { clsx, useConfirm, useState } from '../imports/regular-imports'
import {
    Button,
    IconButton,
    Input,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    makeStyles,
    createStyles,
    TextField,
    InputAdornment,
} from '../imports/gui-imports'

import {
    Save,
    Search,
    CloseSharp,
    PageviewTwoTone,
} from '../imports/icons-import'
import messages from '../messages.json'

function useTraceMaterialComponents() {
    const classes = useStyles()
    const [, setRefresh] = useState({})
    const confirm = useConfirm()

    interface TraceDialogOptions {
        meta: any
        onClose?: any
        onSubmit?: any
        materialDialogProps?: any
        onSearchBoxFilter?: any
    }

    // You can have className in materialDialogProps with double braces as {{className: 'classes.dialog'}}. Then this supplied class will supercede. There will not be any merging
    function TraceDialog(options: TraceDialogOptions) {
        const [, setRefresh] = useState({})
        const pre = options.meta.current.dialogConfig
        return (
            <Dialog
                fullWidth={true}
                className={classes.dialog}
                {...options.materialDialogProps}                
                open={options.meta.current.showDialog}
                onClose={options.onClose || handleClose}>
                <DialogTitle
                    disableTypography
                    id="generic-dialog-title"
                    className="dialog-title">
                    <h3>{pre.title}</h3>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={options.onClose || handleClose}
                        aria-label="close">
                        <CloseSharp />
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    {pre.isSearchBox && (
                        <Input
                            autoFocus={true}
                            placeholder="Search"
                            style={{ maxWidth: '30ch', color: 'grey' }}
                            value={
                                options.meta.current?.dialogConfig
                                    ?.searchBoxFilter || ''
                            }
                            onChange={(e) => {
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
                                    onClick={(e) => {
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
                <DialogActions className={classes.dialogActions}>
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
    }: any) {
        const btn = (
            <Button
                style={{ ...style }}
                disabled={disabled}
                fullWidth
                variant="contained"
                startIcon={<Save></Save>}
                className={classes.submitButtonStyle}
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
                variant='standard'
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
                                onClick={(e) => {
                                    meta.current.globalFilter = ''
                                    meta.current.isMounted && setRefresh({})
                                }}>
                                {/* don't show icon when less than medium device */}
                                {isMediumSizeUp && <CloseSharp></CloseSharp>}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                onChange={(e) => {
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
            <div className={clsx(classes.searchBox, options.className)}>
                <TextField
                    className="input-box"
                    autoFocus={true}
                    placeholder={options.placeholder || 'Search'}
                    value={options?.meta?.current?.searchFilter || ''}
                    onBlur={options.onBlur}
                    onKeyDown={(e: any) => {
                        if (e.keyCode === 13) {
                            handleSearchButtonClick()
                        }
                    }}
                    onChange={(e) => {
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
                                    onClick={(e) => {
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
            </div>
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
        TraceDialog,
        TraceFullWidthSubmitButton,
        traceGlobalSearch,
        TraceSearchBox,
    }
}
export { useTraceMaterialComponents }

const useStyles: any = makeStyles((theme:any) =>
    createStyles({
        content: {},

        dialog: {
            '& .dialog-title': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0px',
                paddingRight: theme.spacing(2.0),
            },

            '& .MuiInputBase-root': {
                width: theme.spacing(50),
                marginBottom: theme.spacing(2),
            },
        },

        dialogContent: {
            '& .serial-number': {
                width: '100%',
            },
        },

        submitButtonStyle: {
            marginLeft: theme.spacing(2),
            marginTop: -theme.spacing(1),
            marginRight: theme.spacing(2),
        },

        searchBox: {
            '& .search-button': {
                marginLeft: theme.spacing(2),
            },
        },

        traceNumeric: {
            '& input': {
                textAlign: 'end',
            },
        },
    })
)
