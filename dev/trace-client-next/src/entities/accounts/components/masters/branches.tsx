import { useSharedElements } from '../common/shared-elements-hook'
import {
    useRef,
    useState,
    useEffect,
} from '../../../../imports/regular-imports'
import {
    Box,
    makeStyles,
    Theme,
    createStyles,
    Typography,
} from '../../../../imports/gui-imports'

function Branches() {
    const meta: any = useRef({})
    const classes = useStyles()
    const [, setRefresh] = useState({})
    const { emit, filterOn, XXGrid } = useSharedElements()
    useEffect(() => {
        const subs1 = filterOn('BRANCHES-REFRESH').subscribe(() => {
            emit(getXXGridParams().gridActionMessages.fetchIbukiMessage, null)
        })

        const subs2 = filterOn(
            getXXGridParams().gridActionMessages.editIbukiMessage
        ).subscribe((d: any) => {
            //edit
        })

        const subs3 = filterOn(
            getXXGridParams().gridActionMessages.deleteIbukiMessage
        ).subscribe((d: any) => {
            //delete
        })

        return () => {
            subs1.unsubscribe()
            subs2.unsubscribe()
            subs3.unsubscribe()
        }
    }, [])

    const {
        columns,
        gridActionMessages,
        queryId,
        queryArgs,
        summaryColNames,
        specialColumns,
    } = getXXGridParams()

    return (
        <Box className={classes.content}>
            <Typography variant="subtitle1" component="div" color="secondary">
                Branches
            </Typography>
            <XXGrid
                gridActionMessages={gridActionMessages}
                autoFetchData={true}
                columns={columns}
                className="xx-grid"
                sqlQueryId={queryId}
                sqlQueryArgs={queryArgs}
                specialColumns={specialColumns}
                summaryColNames={summaryColNames}
                // title="Branches"
                viewLimit="100"
            />
        </Box>
    )

    function getXXGridParams() {
        const columns = [
            {
                headerName: 'Ind',
                description: 'Index',
                field: 'id',
                width: 80,
                disableColumnMenu: true,
            },
            {
                headerName: 'Id',
                description: 'Id',
                field: 'id1',
                width: 90,
            },
            {
                headerName: 'Branch name',
                field: 'branchName',
                flex: 1,
            },
        ]

        const queryId = 'get_branches'
        const queryArgs = {}
        const summaryColNames: string[] = []
        const specialColumns = {
            isEdit: true,
            isDelete: true,
        }
        const gridActionMessages = {
            fetchIbukiMessage: 'XX-GRID-HOOK-FETCH-BRANCHES',
            editIbukiMessage: 'BRANCHES-XX-GRID-EDIT-CLICKED',
            deleteIbukiMessage: 'BRANCHES-XX-GRID-DELETE-CLICKED',
        }

        return {
            columns,
            gridActionMessages,
            queryId,
            queryArgs,
            summaryColNames,
            specialColumns,
        }
    }
}
export { Branches }
const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            height: 'calc(100vh - 245px)',
            width: '100%',
            marginTop: '5px',
            '& .xx-grid': {
                marginTop: theme.spacing(1),
            },
        },
    })
)
