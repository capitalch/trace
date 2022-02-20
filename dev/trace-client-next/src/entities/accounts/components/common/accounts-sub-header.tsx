import { useSharedElements } from './shared-elements-hook'
import { useAccountsSubHeader, useStyles } from './accounts-sub-header-hook'
import {
    Avatar,
    Box, IconButton,
    Chip,
} from '../../../../imports/gui-imports'
import {
    Add, FontAwesomeIcon, faSpinner, RemoveCircleOutline,
    SyncSharp,
} from '../../../../imports/icons-import'
function AccountsSubHeader() {
    const classes = useStyles()
    const {
        exhibitLogic,
        handleSelectBu,
        handleSelectBranch,
        handleSelectFinYear,
        meta,
        utilFunc,
    } = useAccountsSubHeader()

    const {
        emit,
        getCurrentMediaSize,
        initCode,
        isControlDisabled,
        TraceDialog,
    } = useSharedElements()

    const { execDataCache } = initCode()
    const currentMediaSize: string = getCurrentMediaSize()

    return (
        <div className={classes.content}>
            <Box component="div">
                {/* business unit */}
                <Chip
                    style={{
                        maxWidth: exhibitLogic[currentMediaSize || 'md']()
                            .maxWidth,
                    }}
                    size="medium"
                    className="chip-select"
                    clickable={true}
                    color="secondary"
                    avatar={<Avatar>BU</Avatar>}
                    label={exhibitLogic[currentMediaSize || 'md']().bu}
                    onClick={handleSelectBu}></Chip>

                {/* financial year */}
                <Box component="span">
                    <IconButton
                        style={{ paddingRight: '0.5rem' }}
                        disabled={isControlDisabled('financial-year-change')}
                        size="medium"
                        color="inherit"
                        onClick={() => {
                            utilFunc().changeFinYear(1)
                        }}>
                        <Add></Add>
                    </IconButton>
                    <Chip
                        disabled={isControlDisabled('financial-year-change')}
                        size="medium"
                        className="chip-select"
                        style={{
                            maxWidth: exhibitLogic[currentMediaSize || 'md']()
                                .fyMaxWidth,
                        }}
                        clickable={true}
                        label={exhibitLogic[currentMediaSize || 'md']().fy}
                        color="secondary"
                        avatar={<Avatar>FY</Avatar>}
                        onClick={handleSelectFinYear}></Chip>
                    <IconButton
                        style={{ paddingLeft: '0.5rem' }}
                        disabled={isControlDisabled('financial-year-change')}
                        color="inherit"
                        onClick={() => {
                            utilFunc().changeFinYear(-1)
                        }}>
                        <RemoveCircleOutline></RemoveCircleOutline>
                    </IconButton>
                </Box>

                {/* branch */}
                <Chip
                    size="medium"
                    disabled={isControlDisabled('branchChange')}
                    className="chip-select"
                    style={{
                        maxWidth: exhibitLogic[currentMediaSize || 'md']()
                            .maxWidth,
                    }}
                    clickable={true}
                    avatar={<Avatar>BR</Avatar>}
                    label={exhibitLogic[currentMediaSize || 'md']().br}
                    color="secondary"
                    onClick={handleSelectBranch}
                ></Chip>

                {/* Refresh cache */}
                {exhibitLogic[currentMediaSize || 'md']().refreshCache && (
                    <IconButton
                        size="medium"
                        color="inherit"
                        onClick={async () => {
                            emit('SHOW-LOADING-INDICATOR', true)
                            await execDataCache()
                            emit('SHOW-LOADING-INDICATOR', false)
                        }}>
                        <SyncSharp></SyncSharp>
                    </IconButton>
                )}

                {/* busy spinner */}
                {meta.current.isLoading && (
                    <FontAwesomeIcon
                        style={{
                            float: 'right',
                            marginTop: '2rem',
                        }}
                        icon={faSpinner}
                        spin
                    />
                )}
            </Box>
            <TraceDialog meta={meta} />
        </div>
    )
}

export { AccountsSubHeader }
