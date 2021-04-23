import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTheme from '@material-ui/core/styles/useTheme'
const traceGlobal: any = {}

function useTraceGlobal() {
    const theme = useTheme()
    const smEquals = useMediaQuery(theme.breakpoints.only('sm'), { noSsr: true })
    const mdEquals = useMediaQuery(theme.breakpoints.only('md'), { noSsr: true })
    const lgEquals = useMediaQuery(theme.breakpoints.only('lg'), { noSsr: true })
    const xlEquals = useMediaQuery(theme.breakpoints.only('xl'), { noSsr: true })
    const isMediumSizeUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })

    function getCurrentMediaSize() {
        let ret = 'xs'
        if (smEquals)
            ret = 'sm'
        else if (mdEquals)
            ret = 'md'
        else if (lgEquals)
            ret = 'lg'
        else if (xlEquals)
            ret = 'xl'
        return ret
    }

    function getFromGlobalBag(propName: string) {
        return traceGlobal[propName]
    }

    function setInGlobalBag(propName: string, propValue: any) {
        traceGlobal[propName] = propValue
    }
    // , isMediumSizeUp
    return { getFromGlobalBag, setInGlobalBag, getCurrentMediaSize, isMediumSizeUp }
}

export { useTraceGlobal }

/*
function setWindowWidth(value: number) {
        traceGlobal.windowWidth = value
    }

    function getWindowWidth() {
        return traceGlobal.windowWidth
    }

    function isMatch({ ...props }: any) {
        const smallSize = 320
        const mediumSize = 768
        const largeSize = 992
        const logic: any = {
            small: {
                up: (w:number) =>  w >= smallSize
                , down: (w: number) => w < smallSize
                , equals:(w: number) =>(w >= smallSize) && (w < mediumSize)
            },
            medium: {
                up: (w:number) =>  w >= mediumSize
                , down: (w: number) => w < mediumSize
                , equals:(w: number) =>(w >= mediumSize) && (w < largeSize)
            },
            large: {
                up: (w:number) =>  w >= largeSize
                , down: (w: number) => w < largeSize
                , equals:(w: number) => w >= largeSize
            }
        }
        let sizeName = ''
        let upDown: string = 'down'

        if(props.medium){
            sizeName = 'medium'
        } else if(props.small){
            sizeName = 'small'
        } else {
            sizeName = 'large'
        }
        if(props.up){
            upDown = 'up'
        } else if(props.down){
            upDown = 'down'
        } else {
            upDown = 'equals'
        }
        const presentWindowWidth = getWindowWidth()
        const isValid: boolean = logic[sizeName][upDown](presentWindowWidth)
        return isValid
    }

    function BreakpointShow({ ...props }: any){
        let ret = null
        isMatch(props) && (ret = props.children)
        return ret
    }

    function BreakpointHide({ ...props }: any){
        let ret = props.children
        isMatch(props) && (ret = null)
        return ret
    }
*/