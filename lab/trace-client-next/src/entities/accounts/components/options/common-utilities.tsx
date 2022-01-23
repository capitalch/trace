import { useRef, } from '../../../../imports/regular-imports'
import {
    Button, createStyles, makeStyles, Grid, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow, Paper, Theme, Typography
} from '../../../../imports/gui-imports'
import { Send } from '../../../../imports/icons-import'
import { useSharedElements } from '../common/shared-elements-hook'

function CommonUtilities() {
    const classes = useStyles()
    const { accountsMessages, emit, isControlDisabled, transferClosingBalances } = useSharedElements()

    return (
        <Grid item xs={12} md={10} className={classes.content}>
            <Typography color='secondary' variant='subtitle1' component='div'>Common utilities</Typography>
            <TableContainer component={Paper} className='container'>
                <Table >
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ border: '0px' }}>
                                <Typography color='textPrimary' className='descr'>{accountsMessages['messTransferClosingBalance']}</Typography>
                            </TableCell>
                            <TableCell style={{ border: '0px' }}>
                                <Button
                                    disabled={isControlDisabled(
                                        'transferAccountsBalances'
                                    )}
                                    endIcon={<Send></Send>}
                                    variant="contained"
                                    color="secondary"
                                    size='small'
                                    onClick={async (e:any) => {
                                        emit('SHOW-LOADING-INDICATOR', true)
                                        const ret = await transferClosingBalances()
                                        emit('SHOW-LOADING-INDICATOR', false)
                                        if (
                                            ret?.data?.accounts
                                                ?.transferClosingBalances
                                        ) {
                                            emit('SHOW-MESSAGE', '')
                                        }
                                    }}>
                                    Transfer
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export { CommonUtilities }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            '& .container': {
                padding: theme.spacing(2),
                border: '1px solid lightGrey',
                marginTop: theme.spacing(1),
                height: 'calc(100vh - 245px)',               
            },

        },
    })
)
export { useStyles }