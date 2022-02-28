import {
    Card,
    Theme,
    createStyles,
    makeStyles,
} from '../../../../imports/gui-imports'
import { XXGrid } from '../../../../imports/trace-imports'
import { useSharedElements } from '../common/shared-elements-hook'
import { useAllTransactions } from './all-reports/all-transactions-hook'
import { useEffect } from '../../../../imports/regular-imports'

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
    const {
        accountsMessages,
        confirm,
        emit,
        filterOn,
        getGridReportSubTitle,
        genericUpdateMaster,
        isGoodToDelete,
    } = useSharedElements()
    const classes = useStyles()

    useEffect(() => {
        const subs1 = filterOn('ROOT-WINDOW-REFRESH').subscribe(() => {
            emit(actionMessages.fetchIbukiMessage, null)
        })
        const subs2 = filterOn(actionMessages.deleteIbukiMessage).subscribe(
            (d: any) => {
                doDelete(d.data)
            }
        )
        emit(actionMessages.fetchIbukiMessage, null)

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
        }
    }, [])
    
    return (
        <Card className={classes.container}>
            <XXGrid
                gridActionMessages={actionMessages}
                columns={columns}
                subTitle={getGridReportSubTitle()}
                summaryColNames={summaryColNames}
                title={title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
                toShowOpeningBalance={false}
                toShowReverseCheckbox={true}
                isReverseOrderChecked={true}
                viewLimit="1000"
            />
        </Card>
    )

    async function doDelete(params: any) {
        const row = params.row
        const tranHeaderId = row['id1']
        const options = {
            description: accountsMessages.transactionDelete,
            confirmationText: 'Yes',
            cancellationText: 'No',
        }
        if (isGoodToDelete(params)) {
            confirm(options)
                .then(async () => {
                    await genericUpdateMaster({
                        deletedIds: [tranHeaderId],
                        tableName: 'TranH',
                    })
                    emit('SHOW-MESSAGE', {})
                    emit(actionMessages.fetchIbukiMessage, null)
                })
                .catch(() => {}) // important to have otherwise eror
        }
    }
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
