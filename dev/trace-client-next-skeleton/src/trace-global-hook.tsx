import { Theme, useMediaQuery } from '@mui/material'
import { useTheme, } from '@mui/styles'

function useTraceGlobal() {
    const theme:Theme = useTheme()
    const smEquals = useMediaQuery(theme.breakpoints.only('sm') , {noSsr: true})
    const mdEquals = useMediaQuery(theme.breakpoints.only('md'), { noSsr: true })
    const lgEquals = useMediaQuery(theme.breakpoints.only('lg'), { noSsr: true })
    const xlEquals = useMediaQuery(theme.breakpoints.only('xl'), { noSsr: true })
    const isMediumSizeUp =  useMediaQuery(theme.breakpoints.up('md'), { noSsr: true })
    const isMediumSizeDown =  useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })

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

    return { getCurrentMediaSize,isMediumSizeDown, isMediumSizeUp }
}

export { useTraceGlobal }