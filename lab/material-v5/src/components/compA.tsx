/** @jsxImportSource @emotion/react */
import { useContext, } from 'react'
import { Button, Typography, useTheme } from './common/import-export'
import { userProfileContext } from './common/user-profile-provider'
import { jsx,css } from '@emotion/react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

function CompA() {
    // const { Button, Typography, useTheme } = ImportExport()
    const userProfile: any = useContext(userProfileContext)
    console.log(userProfile)
    const theme = useTheme()


    return (
        <Box sx={{ width: 300 }} >
            <Slider defaultValue={30} />
            <Slider
                defaultValue={30}
                css={heading}
            />
        </Box>
    )
}
const sss = { backgroundColor: 'red' }
const heading = css({
    color: 'black',
    backgroundColor: 'red',
    width:400
})

export { CompA }
