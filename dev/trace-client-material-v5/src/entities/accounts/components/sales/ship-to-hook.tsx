import React, { useState, useEffect, useRef } from 'react'
import {
// makeStyles, 
Theme
} from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import { makeStyles } from '@material-ui/styles'
import { useSharedElements } from '../common/shared-elements-hook'

function useShipTo(arbitraryData: any) {
    const [, setRefresh] = useState({})
    const shipTo = arbitraryData.shipTo
    const classes = useStyles()
    useEffect(() => {
        meta.current.isMounted = true
        return () => {
            meta.current.isMounted = false
        }
    }, [])

    const {
        Button,
        doValidateForm,
        getCurrentEntity,
        getFormData,
        isValidForm,
        ReactForm,
    } = useSharedElements()
    const meta: any = useRef({
        isMounted: false,
        showDialog: false,
        formId: 'trace-ship-toaddress',
        dialogConfig: {
            title: '',
            content: () => { },
            actions: () => { },
        },
    })

    function handleClear() {
        arbitraryData.shipTo = {}
        meta.current.isMounted && setRefresh({})
    }

    function handleNewEdit() {
        meta.current.dialogConfig.title = shipTo.name
            ? 'Edit ship to address'
            : 'New ship to address'
        meta.current.showDialog = true
        meta.current.dialogConfig.content = ShipToAddress
        meta.current.isMounted && setRefresh({})
    }

    function handleSelect() {
        doValidateForm('trace-ship-toaddress')
        if (isValidForm('trace-ship-toaddress')) {
            meta.current.showDialog = false
            arbitraryData.shipTo = getFormData(meta.current.formId)
        } else {

        }
        meta.current.isMounted && setRefresh({})
    }

    function ShipToAddress() {
        return (
            <div className={classes.shipToDialog}>
                <ReactForm
                    formId={meta.current.formId}
                    jsonText={JSON.stringify(shipToAddressJson)}
                    name={getCurrentEntity()}
                    initialValues={arbitraryData.shipTo}
                />
                <Button
                    variant="contained"
                    onClick={handleSelect}
                    color="primary"
                    className="select-button">
                    Select
                </Button>
            </div>
        )
    }

    return { handleClear, handleNewEdit, meta }
}

export { useShipTo }

const useStyles: any = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            marginTop: theme.spacing(1),
            padding: theme.spacing(1),
            '& .new-button': {
                marginTop: theme.spacing(1),
            },
            '& .ship-to-address': {
                color: theme.palette.grey[500],
                display: 'flex',
                alignItems: 'center',
                columnGap: theme.spacing(1),
                flexWrap: 'wrap',
                marginTop: theme.spacing(1),
                fontSize: '0.8rem',

                '& span': {
                    color: theme.palette.blue.main,
                },
            },
        },
        shipToDialog: {
            '& .select-button': {
                float: 'right',
            },
        },
    })
)

export { useStyles }

const shipToAddressJson = {
    class: 'generic-dialog',
    items: [
        {
            type: 'Text',
            name: 'contactName',
            label: 'Name',
            validations: [
                {
                    name: 'required',
                    message: 'Name is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'mobileNumber',
            label: 'Mobile',
            validations: [
                {
                    name: 'phoneNumber',
                    message: 'Invalid mobile number',
                },
            ],
        },
        {
            type: 'Text',
            name: 'email',
            label: 'Email',
            validations: [
                {
                    name: 'email',
                    message: 'Valid email address is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'address1',
            label: 'Address1',
            validations: [
                {
                    name: 'required',
                    message: 'Address1 is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'address2',
            label: 'Address2',
            validations: [],
        },
        {
            type: 'Text',
            name: 'country',
            label: 'Country',
            validations: [
                {
                    name: 'required',
                    message: 'Country is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'state',
            label: 'State',
            validations: [
                {
                    name: 'required',
                    message: 'State is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'city',
            label: 'City',
            validations: [
                {
                    name: 'required',
                    message: 'City is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'pin',
            label: 'Pin',
            validations: [
                {
                    name: 'required',
                    message: 'Pin is required',
                },
            ],
        },
        {
            type: 'Text',
            name: 'otherInfo',
            label: 'Other info',
        },
    ],
}
