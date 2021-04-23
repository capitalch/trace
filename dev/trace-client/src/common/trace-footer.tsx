import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { StyledFooter } from './trace-styled-components'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { usingIbuki } from '../common-utils/ibuki'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const TraceFooter: React.FC = () => {
    const [message, setMessage] = useState('')
    const [color, setColor] = useState('blue')
    const { filterOn } = usingIbuki()
    const classes = useStyles()
    useEffect(() => {
        const subs: any = filterOn('DATABASE-SERVER-CONNECTION-RESULT').subscribe((d: any) => {
            setMessage(d.data.message)
            d.data.status === 'success' ? setColor('blue') : setColor('red')
        })
        return (() => subs.unsubscribe())
    }, [])

    return <StyledFooter className={clsx(classes.root)}>
        <span className={classes.connected}>
            {message}
        </span>
        <FiberManualRecordIcon fontSize='small' color='secondary' ></FiberManualRecordIcon>
    </StyledFooter>
}

export { TraceFooter }

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
