import {
    Card,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../../imports/gui-imports'
import { XXGrid } from '../../../../../imports/trace-imports'
import { useSharedElements } from '../../common/shared-elements-hook'
import { useAllTransactions } from '../helpers/all-transactions'
import { _, useEffect } from '../../../../../imports/regular-imports'

function GenericReports({ loadReport }: any) {
    const selectLogic: any = {
        allTransactions: useAllTransactions,
    }
    const {
        actionMessages,
        args,
        columns,
        specialColumns,
        sqlQueryId,
        summaryColNames,
        title,
    } = selectLogic[loadReport]()

    const { emit, filterOn } = useSharedElements()
    const classes = useStyles()

    useEffect(() => {
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit(actionMessages.fetchIbukiMessage, null)
        })
        emit(actionMessages.fetchIbukiMessage, null)

        return () => {
            subs1.unsubscribe()
        }
    }, [])

    return (
        <Card className={classes.container}>
            <XXGrid
                gridActionMessages={actionMessages}
                columns={columns}
                summaryColNames={summaryColNames}
                title={title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                toShowOpeningBalance={false}
                toShowReverseCheckbox={true}
                // xGridProps={{ disableSelectionOnClick: true }}
                viewLimit="1000"
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
