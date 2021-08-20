import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { XXGrid } from '../../common/xx-grid'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useAllTransactions } from '../helpers/all-transactions'

function GenericReports({ loadReport }: any) {
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const {
        args,
        columns,
        specialColumns,
        sqlQueryId,
        summaryColNames,
        title,
    } = selectLogic[loadReport]()

    const { _, Card } = useSharedElements()
    const classes = useStyles()
    console.log('rendered')
    return (
        <Card className={classes.container}>
            <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                // xGridProps={{disableSelectionOnClick: true}}
            />
        </Card>
    )
}

export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            height: 'calc(100vh - 163px)',
            width: '100%',
            marginTop: '5px',
        },
    })
)
