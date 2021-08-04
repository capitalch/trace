import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { XXGrid } from './xx-grid'
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
        <Card className={classes.content}>
            <XXGrid
                columns={columns}
                summaryColNames={summaryColNames}
                title={title}
                sqlQueryId={sqlQueryId}
                sqlQueryArgs={args}
                specialColumns={specialColumns}
            />
        </Card>
    )
}

export { GenericReports }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 163px)',
            width: '100%',
            marginTop: '5px',
            '& .delete': {
                color: 'red',
            },
            '& .custom-toolbar': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: '1.5rem',
                borderBottom: '1px solid lightgrey',
                '& .toolbar-title': {
                    color: 'dodgerblue',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                },
                '& .global-search': {
                    marginLeft: 'auto',
                    marginRight: '1rem',
                },
                '& .view-limit':{
                    display: 'flex',
                    columnGap: '0.5rem',
                    color: theme.palette.secondary.main,
                    '& select':{
                        borderColor:'grey',
                        color:theme.palette.primary.main
                        // height: '1.5rem'
                    }

                }
            },
            '& .custom-footer': {
                display: 'flex',
                marginLeft: '10px',
                flexWrap: 'wrap',
                justifyContent: 'flexStart',

                '& .common': {
                    display: 'flex',
                },

                '& .selected': {
                    color: theme.palette.primary.main,
                },

                '& .filtered': {
                    color: theme.palette.secondary.main,
                },

                '& .all': {
                    color: 'dodgerblue',
                    marginRight: '1rem',
                },
            },
        },
    })
)
