import { useSharedElements } from '../common/shared-elements-hook'
import { useSaleBillNoSelect, useStyles } from './sale-bill-no-select-hook'
import {
    Button,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
} from '../../../../imports/gui-imports'
import { CloseSharp, Search } from '../../../../imports/icons-import'

function SaleBillNoSelect({ value }: any) {
    const { handleSelect, meta } = useSaleBillNoSelect()
    const { emit, TraceDialog } = useSharedElements()
    const classes = useStyles()
    return (
        <div className={classes.content}>
            <FormControl variant="standard">
                <Input
                    className="input"
                    placeholder="Sale bill no"
                    readOnly={true}
                    endAdornment={
                        <div>
                            <InputAdornment position="start">
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        emit('SALE-BILL-NO-CLEARED', '')
                                    }}>
                                    {/* don't show icon when less than medium device */}
                                    {<CloseSharp></CloseSharp>}
                                </IconButton>
                            </InputAdornment>
                            <InputAdornment position="end">
                                <Button
                                    className="button"
                                    variant="contained"
                                    size="small"
                                    color="secondary"
                                    aria-label="toggle password visibility"
                                    onClick={handleSelect}>
                                    {' '}
                                    Select bill{' '}
                                    <Search className="search-icon" />
                                </Button>
                            </InputAdornment>
                        </div>
                    }
                    value={value}
                />
            </FormControl>
            <TraceDialog meta={meta} />
        </div>
    )
}

export { SaleBillNoSelect }
