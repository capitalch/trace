import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles';
const traceGlobal: any = {}

function useTraceGlobal() {
    const theme = useTheme()
    const smEquals = useMediaQuery(theme.breakpoints.only('sm') , {noSsr: true})
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

    function getCurrentWindowSize(){
        const isDrawyerOpen:boolean = getFromGlobalBag('isDrawyerOpen')
        return isDrawyerOpen ? 'calc(100vw - 260px - 72px)' : ''
    }

    return { getFromGlobalBag, setInGlobalBag, getCurrentMediaSize, isMediumSizeUp, getCurrentWindowSize }
}

export { useTraceGlobal }
