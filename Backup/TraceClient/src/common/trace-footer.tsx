import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { StyledFooter } from './trace-styled-components'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import { useIbuki } from '../common-utils/ibuki'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { noAuto } from '@fortawesome/fontawesome-svg-core'
const TraceFooter: React.FC = () => {
    let [message, setMessage] = useState('')
    let [color, setColor] = useState('blue')
    const { filterOn } = useIbuki()
    const classes = useStyles()
    useEffect(() => {
        const subs: any = filterOn('DATABASE-SERVER-CONNECTION-RESULT').subscribe((d: any) => {
            setMessage(d.data.message)
            d.data.status === 'success' ? setColor('blue') : setColor('red')
        })
        return (() => subs.unsubscribe())
    }, [])

    // style={footerStyle(color)}
    return <StyledFooter className={clsx(classes.root)}>
        <span className={classes.connected}>
            {message}
        </span>
        <FiberManualRecordIcon fontSize='small' color='secondary' ></FiberManualRecordIcon>
    </StyledFooter>
}

export { TraceFooter }



const footerStyle = (color: string) => {
    return {
        color: `${color}`
        , display: 'inline-flex'
        , alignItems: 'center'
        , fontSize: '0.8rem'
        , marginLeft: '0.5rem'
    }
}

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'inline-flex',
            alignItems: 'center'
        }
        , connected: {
            color: 'blue'
            , fontSize: '0.8rem'
            , marginLeft:'0.2rem'
        }
    }));
