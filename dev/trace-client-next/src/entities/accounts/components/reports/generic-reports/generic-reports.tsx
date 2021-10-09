import { Theme, createStyles, makeStyles } from '../../../../../imports/gui-imports'
import { XXGrid } from '../../../../../imports/trace-imports'
import { useSharedElements } from '../../shared/shared-elements-hook'
import { useAllTransactions } from '../helpers/all-transactions'
import { useEffect } from '../../../../../imports/regular-imports'

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

    const { _, Card, emit, filterOn, } = useSharedElements()
    const classes = useStyles()
    useEffect(() => {
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(()=>{
            emit('XX-GRID-FETCH-DATA', null)
        })
        emit('XX-GRID-FETCH-DATA', null)

        return(()=>{
            subs1.unsubscribe()
        })
    }, [])
    
    return (
        <Card className={classes.container}>
            <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                toShowOpeningBalance={false}
                toShowReverseCheckbox={true}
                xGridProps={{ disableSelectionOnClick: true }}
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
