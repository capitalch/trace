import { useSharedElements } from '../common/shared-elements-hook'
import { useAccountsSubHeader, useStyles } from './accounts-sub-header-hook'

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
        AddIcon,
        Avatar,
        Box,
        Chip,
        emit,
        faSpinner,
        FontAwesomeIcon,
        getCurrentMediaSize,
        IconButton,
        initCode,
        isControlDisabled,
        MinusIcon,
        SyncIcon,
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
                        disabled={isControlDisabled('finYearChange')}
                        size="medium"
                        color="inherit"
                        onClick={() => {
                            utilFunc().changeFinYear(1)
                        }}>
                        <AddIcon></AddIcon>
                    </IconButton>
                    <Chip
                        disabled={isControlDisabled('finYearChange')}
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
                        disabled={isControlDisabled('finYearChange')}
                        color="inherit"
                        onClick={() => {
                            utilFunc().changeFinYear(-1)
                        }}>
                        <MinusIcon></MinusIcon>
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
                        <SyncIcon></SyncIcon>
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
