/** @jsxImportSource @emotion/react */
import { useContext } from 'react'
import { Button,clsx, Typography, useTheme } from './common/import-export'
import { userProfileContext } from './common/user-profile-provider'
import { jsx, css } from '@emotion/react'
import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'

function CompA() {
    // const { Button, Typography, useTheme } = ImportExport()
    const userProfile: any = useContext(userProfileContext)
    console.log(userProfile)
    const theme = useTheme()
    const classes = {
        slider1: {
            backgroundColor: 'red',
        },
        '& .buttonClass1': {
            color: 'red'
        },
        '& .buttonClass2': {
            backgroundColor: 'green'
        },
        button3: {
            color: 'blue'
        }
    }

    return (
        <Box sx={classes}>
            <Slider defaultValue={30} />
            <Slider defaultValue={30} sx={classes.slider1} />
            <Button variant='contained' className={clsx('buttonClass1', 'buttonClass2')}>Test Button</Button>
            <Button variant='outlined' className= {clsx(classes.button3)}>Button 3</Button>
        </Box>
    )
}

export { CompA }
