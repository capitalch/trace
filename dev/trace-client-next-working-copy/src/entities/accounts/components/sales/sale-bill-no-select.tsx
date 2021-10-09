import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleBillNoSelect, useStyles } from './sale-bill-no-select-hook'

function SaleBillNoSelect({ value }: any) {
    const { handleSelect, meta } = useSaleBillNoSelect()
    const { Button, CloseIcon, emit, FormControl, IconButton, Input, InputAdornment, SearchIcon, TraceDialog } = useSharedElements()
    const classes = useStyles()
    return (<div className={classes.content}>
        <FormControl>
            <Input
                className="input"
                placeholder='Sale bill no'
                readOnly={true}
                endAdornment={
                    <div>
                        <InputAdornment position='start'>
                            <IconButton size='small' onClick={e => {
                                emit('SALE-BILL-NO-CLEARED', '')
                            }}>
                                {/* don't show icon when less than medium device */}
                                {<CloseIcon></CloseIcon>}
                            </IconButton>
                        </InputAdornment>
                        <InputAdornment position="end">
                            <Button
                                className="button"
                                variant="contained"
                                size="small"
                                color="secondary"
                                aria-label="toggle password visibility"
                                onClick={handleSelect}
                            > Select bill <SearchIcon className='search-icon' />
                            </Button>
                        </InputAdornment>
                    </div>
                }
                value={value}
            />

        </FormControl>
        <TraceDialog meta={meta} />
    </div>)
}

export { SaleBillNoSelect }

