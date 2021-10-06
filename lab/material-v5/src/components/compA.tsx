import { useContext, } from 'react'
import { ImportExport } from './common/import-export'
import { userProfileContext } from './common/user-profile-provider'

function CompA() {
    const { Button, Typography, useTheme } = ImportExport()
    const userProfile: any = useContext(userProfileContext)
    console.log(userProfile)
    const theme = useTheme()
    return (
        <div>
            <Button variant="contained" color="primary">
                My Button
            </Button>
            <Button variant="contained" color="inherit">
                My Button
            </Button>
            <Typography color={theme.palette.neutral.main} >Custom neutral color </Typography>
        </div>
    )
}

export { CompA }
