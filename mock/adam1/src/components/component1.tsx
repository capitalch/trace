import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import {
  Toolbar, Typography, Backdrop
  , Card
  , Button, IconButton, Chip,
  Avatar, Box, Container, Paper
  , Dialog, DialogTitle
  , DialogActions, DialogContent, Theme, useTheme, createStyles, makeStyles
  , List, ListItem, ListItemAvatar, ListItemText, Grid
} from '@material-ui/core'
import MaterialTable from "material-table"
import {
  AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear
  , DeleteOutline
  , Edit
  , FilterList
  , FirstPage
  , LastPage
  , Remove
  , SaveAlt
  , Search
  , ViewColumn, Close, Save
} from "@material-ui/icons"
import RefreshIcon from '@material-ui/icons/Cached'
import RearrangeIcon from '@material-ui/icons/FlipToFront'
import SubmitIcon from '@material-ui/icons/Publish'
import OpeningBalanceIcon from '@material-ui/icons/AccountBalance'
import { tableIcons } from './material-table-icons'
import { useTraceGlobal } from '../utils/trace-global'

const Component1 = () => {
  const meta: any = useRef({
    selectedBank: 'Select a bank account',
    showDialog: false,
    showDialog1: false,
    allBanks: [],
    headerConfig: {
      flexDirection: '',
      alignItems: '',
      chipSize: '',
      buttonSize: '',
      buttonTopMargin: '',
      buttonRightMargin: '',
      textVariant: '',
      isBbuttonsIcon: false,
    },
    dialogConfig: {
      title: 'Select bank'
    },
    dialogConfig1: {
      title: 'Second dialog'
    },

  })
  const headerConfig = meta.current.headerConfig
  const theme: any = useTheme()
  const classes = useStyles({ headerConfig: headerConfig })
  const [, setRefresh] = useState({})
  const { isMediumSizeUp, getCurrentMediaSize } = useTraceGlobal()


  function handleSelectBankClick() {
    meta.current.showDialog = true
    setRefresh({})
  }

  function handleSecondDialogOpen() {
    meta.current.showDialog1 = true
    setRefresh({})
  }
  
  function closeDialog() {
    meta.current.showDialog = false
    setRefresh({})
  }

  const mediaLogic: any = {
    xs: () => {
      headerConfig.flexDirection = 'column'
      headerConfig.alignItems = 'flex-start'
      headerConfig.chipSize = 'small'
      headerConfig.buttonSize = 'small'
      headerConfig.buttonTopMargin = '0.5rem'
      headerConfig.buttonRightMargin = '0px'
      headerConfig.textVariant = 'subtitle1'
      headerConfig.isButtonsIcon = false
    },
    sm: () => {
      headerConfig.flexDirection = 'row'
      headerConfig.alignItems = 'center'
      headerConfig.flexWrap = 'wrap'
      headerConfig.chipSize = 'small'
      headerConfig.buttonSize = 'small'
      headerConfig.buttonTopMargin = '0px'
      headerConfig.buttonRightMargin = '0px'
      headerConfig.textVariant = 'subtitle1'
      headerConfig.isButtonsIcon = false
    },
    md: () => {
      headerConfig.flexDirection = 'row'
      headerConfig.alignItems = 'center'
      headerConfig.chipSize = 'medium'
      headerConfig.buttonSize = 'medium'
      headerConfig.buttonTopMargin = '0px'
      headerConfig.buttonRightMargin = '0.5rem'
      headerConfig.textVariant = 'h6'
      headerConfig.isButtonsIcon = false
    },
    lg: () => {
      headerConfig.flexDirection = 'row'
      headerConfig.alignItems = 'center'
      headerConfig.chipSize = 'medium'
      headerConfig.buttonSize = 'large'
      headerConfig.buttonTopMargin = '0px'
      headerConfig.buttonRightMargin = '1rem'
      headerConfig.textVariant = 'h6'
      headerConfig.isButtonsIcon = true
    },
    xl: () => mediaLogic['lg']()
  }

  const columnsArray: any[] = [
    // { title: 'Index', field: "index", width: 20 },
    { title: "Id", field: "id", sorting: true, width: 20, type: 'numeric' },
    { title: "Tran date", field: "tranDate", sorting: true, type: 'date' },
    { title: "Auto ref no", field: "autoRefNo", },
    { title: "Instr no", field: "instrNo", editable: "always" },
    { title: "Debit", field: "debit", type: 'numeric', render: (rowData: any) => toDecimalFormat(rowData.debit) },
    { title: "Credit", field: "credit", type: 'numeric', render: (rowData: any) => toDecimalFormat(rowData.credit) },
    { title: "Clear date", field: "clearDate" },
    { title: "Balance", type: 'numeric', render: (rowData: any) => toDecimalFormat(rowData.balance) },
    { title: "Clear remarks", field: "clearRemarks", },
    { title: "Line ref no", field: "lineRefNo", },
    { title: "Line remarks", field: "lineRemarks", },
  ]

  meta.current.allBanks = [
    { id: 1, accName: 'Hdfc bank' },
    { id: 23, accName: 'Indian overseas bank international and thereafter pvt ltd' },
    { id: 232, accName: 'Overall banking system and service' },
    { id: 243, accName: 'All india banking federation' },
    { id: 293, accName: 'Icici international' },
    { id: 83, accName: 'Indian bank' },
    { id: 295, accName: 'American bank' },
    { id: 223, accName: 'Indian other bank' },
    { id: 215, accName: 'Rajasthan commercial bank' },
  ]

  function bankSelected(item: any) {
    meta.current.selectedBank = item.accName
    console.log(item.id)
    closeDialog()
  }

  function getAllBanksListItems() {
    const listItems = meta.current.allBanks.map((item: any) => {
      return <ListItem key={item.id} button>
        <ListItemText primary={item.accName}
          onClick={() => bankSelected(item)}
        ></ListItemText>
      </ListItem>
    })
    return listItems
  }
  const currentMediaSize = getCurrentMediaSize()
  currentMediaSize && mediaLogic[currentMediaSize]()

  function handleRowUpdate(newData: any, oldData: any, reslove: any) {

  }

  return (
    <Container className={classes.content}>
      <Box className={classes.header}>
        <Box className={classes.bank}>
          <Typography color='primary'
            variant={headerConfig.textVariant}
            component='span'>Reconcillation for</Typography>
          <Chip
            avatar={<Avatar>B</Avatar>}
            label={meta.current.selectedBank}
            className={classes.selectedBank}
            color='secondary'
            onClick={handleSelectBankClick}
            size={meta.current.headerConfig.chipSize}
          ></Chip>
          <Chip
            avatar={<Avatar>A</Avatar>}
            className={classes.selectedBank}
            color='primary'
            onClick={handleSecondDialogOpen}
            size={meta.current.headerConfig.chipSize}
          ></Chip>
        </Box>
        <Box component='div' className={classes.buttons}>
          <Button
            className={classes.buttons}
            size={meta.current.headerConfig.buttonSize}
            variant='contained' color='primary'
            startIcon={headerConfig.isButtonsIcon && <OpeningBalanceIcon></OpeningBalanceIcon>}
          >Opening bal</Button>
          <Button
            className={classes.buttons}
            size={meta.current.headerConfig.buttonSize}
            startIcon={headerConfig.isButtonsIcon && <RearrangeIcon></RearrangeIcon>}
            variant='contained' color='secondary'>Rearrange</Button>
          <Button
            size={meta.current.headerConfig.buttonSize}
            className={clsx(classes.buttons, classes.refresh)}
            startIcon={headerConfig.isButtonsIcon && <RefreshIcon></RefreshIcon>}
            variant='contained'>Refresh</Button>
          <Button
            size={meta.current.headerConfig.buttonSize}
            className={clsx(classes.buttons, classes.submit)}
            startIcon={headerConfig.isButtonsIcon && <SubmitIcon></SubmitIcon>}
            variant='contained'>Submit</Button>
        </Box>
      </Box>
      <MaterialTable
        // isLoading={meta.current.isLoading}
        icons={tableIcons}
        columns={columnsArray}
        data={reconData}
        title="Bank reconcillation"
        options={{
          paging: true,
          pageSize: 15,
          pageSizeOptions: [15, 20, 30, 50],
          search: true,
          draggable: true,
          // to make fixed header
          headerStyle: { position: 'sticky', top: 0 },
          maxBodyHeight: '580px'
        }}
        actions={[
          {
            icon: () => <Save />,
            tooltip: 'Save User',
            isFreeAction: true,
            onClick: (event, rowData) => {
              // Do save operation
            }
          },
          {
            icon: () => <Close />,
            tooltip: 'Delete User',
            isFreeAction: true,
            onClick: (event, rowData) => {
              // Do save operation
            }
          }
        ]}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve)
            })

        }}
      >
      </MaterialTable>

      <Dialog
        open={meta.current.showDialog1}
        onClose={() => {
          meta.current.showDialog1 = false
          setRefresh({})
        }}
      >
        <DialogTitle disableTypography
        >
          <h3>
            {meta.current.dialogConfig1.title}
          </h3>
          <IconButton size='small' color="default"
            onClick={() => {
              meta.current.showDialog1 = false
              setRefresh({})
            }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Button variant="contained" color="secondary"
          onClick={handleSelectBankClick}
          >Open</Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={meta.current.showDialog}
        fullScreen={true}
        // fullWidth={true}
        onClose={closeDialog}>
        <DialogTitle disableTypography id="generic-dialog-title"
          className={classes.dialogTitle}>
          <h3>
            {meta.current.dialogConfig.title}
          </h3>
          <IconButton size='small' color="default"
            onClick={closeDialog} aria-label="close">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <List component='nav' dense>
            {getAllBanksListItems()}
          </List>
          <Button variant="contained" color="secondary"
          onClick={handleSecondDialogOpen}
          >Open</Button>
        </DialogContent>
        <DialogActions className={classes.dialogActions}></DialogActions>
      </Dialog>
      
    </Container>
  )

  function toDecimalFormat(s: any) {
    s ?? (s = '')
    if (s === '') {
      return s
    }
    if (typeof s !== 'string') {
      s = String(s)
    }
    let ret: string = s //'0.00'
    const v = Number(s)
    if (!isNaN(v)) {
      ret = v.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
    return ret;
  }
}

export { Component1 }

const useStyles: any = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      minWidth: '100%'
    },
    selectedBank: {
      // backgroundColor: theme.palette.primary.light,
      // color: theme.palette.primary.contrastText,
      marginLeft: theme.spacing(1),
      maxWidth: '17rem',
    },
    dialogContent: {
      // maxHeight: '12rem'
    },

    dialogTitle: {
      display: 'flex'
      , justifyContent: 'space-between'
      , alignItems: 'center'
      , paddingBottom: '0px'
    },
    dialogActions: {
      minHeight: theme.spacing(4)
    },
    header: {
      display: 'flex',
      flexDirection: ({ headerConfig }): any => headerConfig.flexDirection,
      alignItems: ({ headerConfig }): any => headerConfig.alignItems,
      // fontWeight: 'bold',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      // marginBottom: theme.spacing(1),
    },
    bank: {
      display: 'flex',
      alignItems: 'center'
    },
    buttons: {
      marginRight: ({ headerConfig }: any) => headerConfig.buttonRightMargin,
      // marginBottom: theme.spacing(1),
      marginTop: ({ headerConfig }: any) => headerConfig.buttonTopMargin,
      borderRadius: '16px',
    },
    submit: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.primary.contrastText,
    },
    refresh: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.primary.contrastText,
    }
  }))

const reconData = [{ "autoRefNo": "head\\PAY\\92\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 30000, "id": 183, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "13,688.85 Dr" }, { "autoRefNo": "head\\PAY\\91\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 30000, "id": 181, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "13/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "16,311.15 Cr" }, { "autoRefNo": "head\\REC\\82\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 500000, "debit": 0, "id": 368, "instrNo": "000467", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "06/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "46,311.15 Cr" }, { "autoRefNo": "head\\PAY\\90\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 179, "instrNo": "000100", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "06/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "453,688.85 Dr" }, { "autoRefNo": "head\\PAY\\89\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 177, "instrNo": "000099", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "06/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "46,311.15 Cr" }, { "autoRefNo": "head\\REC\\81\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 100000, "debit": 0, "id": 366, "instrNo": "683857", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "546,311.15 Cr" }, { "autoRefNo": "head\\REC\\78\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 31301.82, "debit": 0, "id": 360, "instrNo": "000466", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "446,311.15 Cr" }, { "autoRefNo": "head\\PAY\\88\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 50000, "id": 175, "instrNo": "000098", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "415,009.33 Cr" }, { "autoRefNo": "head\\REC\\80\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 200000, "debit": 0, "id": 364, "instrNo": "683856", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/03/2020", "tranDetailsId": null, "userRefNo": "", "balance": "465,009.33 Cr" }, { "autoRefNo": "head\\REC\\79\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1178.82, "debit": 0, "id": 362, "instrNo": "002930", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "265,009.33 Cr" }, { "autoRefNo": "head\\PAY\\87\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 173, "instrNo": "card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "263,830.51 Cr" }, { "autoRefNo": "head\\PAY\\86\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 100000, "id": 171, "instrNo": "000097", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "264,774.51 Cr" }, { "autoRefNo": "head\\PAY\\85\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 100000, "id": 169, "instrNo": "000096", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "364,774.51 Cr" }, { "autoRefNo": "head\\PAY\\84\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 250000, "id": 167, "instrNo": "000095", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "464,774.51 Cr" }, { "autoRefNo": "head\\REC\\71\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 150000, "debit": 0, "id": 346, "instrNo": "000002", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "25/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "714,774.51 Cr" }, { "autoRefNo": "head\\PAY\\83\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 128734, "id": 165, "instrNo": "000094", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "25/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "564,774.51 Cr" }, { "autoRefNo": "head\\REC\\72\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 100000, "debit": 0, "id": 348, "instrNo": "683855", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "21/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "693,508.51 Cr" }, { "autoRefNo": "head\\REC\\69\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 500000, "debit": 0, "id": 342, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "593,508.51 Cr" }, { "autoRefNo": "head\\REC\\68\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 4428, "debit": 0, "id": 340, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "93,508.51 Cr" }, { "autoRefNo": "head\\PAY\\82\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 200000, "id": 163, "instrNo": "000091", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "89,080.51 Cr" }, { "autoRefNo": "head\\PAY\\81\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 442.8, "id": 161, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "289,080.51 Cr" }, { "autoRefNo": "head\\PAY\\80\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 16280.7, "id": 159, "instrNo": "000093", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "289,523.31 Cr" }, { "autoRefNo": "head\\PAY\\79\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 16263, "id": 157, "instrNo": "000092", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "19/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "305,804.01 Cr" }, { "autoRefNo": "head\\PAY\\78\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 100000, "id": 155, "instrNo": "000090", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "322,067.01 Cr" }, { "autoRefNo": "head\\REC\\67\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 200000, "debit": 0, "id": 338, "instrNo": "000015", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "12/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "422,067.01 Cr" }, { "autoRefNo": "head\\PAY\\77\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 153, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "11/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "222,067.01 Cr" }, { "autoRefNo": "head\\PAY\\76\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1200000, "id": 151, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "11/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "722,067.01 Cr" }, { "autoRefNo": "head\\PAY\\75\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1500000, "id": 149, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "11/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "1,922,067.01 Cr" }, { "autoRefNo": "head\\PAY\\74\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2000, "id": 147, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "3,422,067.01 Cr" }, { "autoRefNo": "head\\REC\\66\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 5318, "debit": 0, "id": 336, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "3,424,067.01 Cr" }, { "autoRefNo": "head\\REC\\65\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 600000, "debit": 0, "id": 334, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "3,418,749.01 Cr" }, { "autoRefNo": "head\\PAY\\73\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 531.8, "id": 145, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "2,818,749.01 Cr" }, { "autoRefNo": "head\\REC\\64\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 32844.6, "debit": 0, "id": 332, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "01/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "2,819,280.81 Cr" }, { "autoRefNo": "head\\REC\\63\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1100000, "debit": 0, "id": 330, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "01/02/2020", "tranDetailsId": null, "userRefNo": "", "balance": "2,786,436.21 Cr" }, { "autoRefNo": "head\\REC\\70\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 344, "instrNo": "002022", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "1,686,436.21 Cr" }, { "autoRefNo": "head\\PAY\\72\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 143, "instrNo": "card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "1,666,436.21 Cr" }, { "autoRefNo": "head\\REC\\62\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 13743, "debit": 0, "id": 328, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "1,667,380.21 Cr" }, { "autoRefNo": "head\\REC\\61\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1500000, "debit": 0, "id": 326, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "1,653,637.21 Cr" }, { "autoRefNo": "head\\PAY\\70\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1374.3, "id": 139, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "153,637.21 Cr" }, { "autoRefNo": "head\\PAY\\71\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 25653, "id": 141, "instrNo": "LIC", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "25/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "155,011.51 Cr" }, { "autoRefNo": "head\\PAY\\69\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1178.82, "id": 137, "instrNo": "card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "07/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "180,664.51 Cr" }, { "autoRefNo": "head\\PAY\\68\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1178.82, "id": 135, "instrNo": "card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "07/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "181,843.33 Cr" }, { "autoRefNo": "head\\REC\\60\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 324, "instrNo": "001932", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "183,022.15 Cr" }, { "autoRefNo": "head\\REC\\59\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 322, "instrNo": "001910", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/01/2020", "tranDetailsId": null, "userRefNo": "", "balance": "163,022.15 Cr" }, { "autoRefNo": "head\\REC\\57\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 4786, "debit": 0, "id": 318, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "143,022.15 Cr" }, { "autoRefNo": "head\\REC\\77\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 100000, "debit": 0, "id": 358, "instrNo": "000006", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "138,236.15 Cr" }, { "autoRefNo": "head\\REC\\58\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1122, "debit": 0, "id": 320, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "38,236.15 Cr" }, { "autoRefNo": "head\\REC\\20\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1356, "debit": 0, "id": 244, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "37,114.15 Cr" }, { "autoRefNo": "head\\PAY\\66\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 135.6, "id": 131, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "35,758.15 Cr" }, { "autoRefNo": "head\\PAY\\65\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 112.2, "id": 129, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "35,893.75 Cr" }, { "autoRefNo": "head\\PAY\\67\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 133, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "36,005.95 Cr" }, { "autoRefNo": "head\\PAY\\64\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 50000, "id": 127, "instrNo": "000087", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "21/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "36,949.95 Cr" }, { "autoRefNo": "head\\PAY\\63\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 125, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "21/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "86,949.95 Cr" }, { "autoRefNo": "head\\REC\\56\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1000000, "debit": 0, "id": 316, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "586,949.95 Cr" }, { "autoRefNo": "head\\REC\\55\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 10062, "debit": 0, "id": 314, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "413,050.05 Dr" }, { "autoRefNo": "head\\PAY\\62\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 123, "instrNo": "000086", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "423,112.05 Dr" }, { "autoRefNo": "head\\PAY\\61\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1006.2, "id": 121, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "76,887.95 Cr" }, { "autoRefNo": "head\\PAY\\60\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 800000, "id": 119, "instrNo": "000085", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "77,894.15 Cr" }, { "autoRefNo": "head\\REC\\54\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 700000, "debit": 0, "id": 312, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "877,894.15 Cr" }, { "autoRefNo": "head\\REC\\53\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 6610, "debit": 0, "id": 310, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "177,894.15 Cr" }, { "autoRefNo": "head\\PAY\\59\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 50000, "id": 117, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "171,284.15 Cr" }, { "autoRefNo": "head\\PAY\\58\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 661, "id": 115, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "221,284.15 Cr" }, { "autoRefNo": "head\\REC\\52\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 308, "instrNo": "001705", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "12/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "221,945.15 Cr" }, { "autoRefNo": "head\\REC\\51\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 200000, "debit": 0, "id": 306, "instrNo": "000014", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "201,945.15 Cr" }, { "autoRefNo": "head\\PAY\\57\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 300000, "id": 113, "instrNo": "000083", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,945.15 Cr" }, { "autoRefNo": "head\\PAY\\56\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 600000, "id": 111, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "301,945.15 Cr" }, { "autoRefNo": "head\\PAY\\55\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2000, "id": 109, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "04/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "901,945.15 Cr" }, { "autoRefNo": "head\\PAY\\54\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 16004, "id": 107, "instrNo": "000084", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "03/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "903,945.15 Cr" }, { "autoRefNo": "head\\PAY\\53\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2500, "id": 105, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/12/2019", "tranDetailsId": null, "userRefNo": "", "balance": "919,949.15 Cr" }, { "autoRefNo": "head\\PAY\\52\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 25541, "id": 103, "instrNo": "000082", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "922,449.15 Cr" }, { "autoRefNo": "head\\PAY\\51\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 101, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "947,990.15 Cr" }, { "autoRefNo": "head\\PAY\\50\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1500000, "id": 99, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "948,934.15 Cr" }, { "autoRefNo": "head\\REC\\50\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1500000, "debit": 0, "id": 304, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "2,448,934.15 Cr" }, { "autoRefNo": "head\\REC\\49\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 850000, "debit": 0, "id": 302, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "948,934.15 Cr" }, { "autoRefNo": "head\\REC\\48\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 22192, "debit": 0, "id": 300, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "98,934.15 Cr" }, { "autoRefNo": "head\\REC\\47\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 12575, "debit": 0, "id": 298, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "76,742.15 Cr" }, { "autoRefNo": "head\\PAY\\49\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2219.2, "id": 97, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "64,167.15 Cr" }, { "autoRefNo": "head\\PAY\\48\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1257.5, "id": 95, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "24/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "66,386.35 Cr" }, { "autoRefNo": "head\\PAY\\47\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 4178, "id": 93, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "67,643.85 Cr" }, { "autoRefNo": "head\\PAY\\46\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 31, "id": 91, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/11/2019", "tranDetailsId": null, "userRefNo": "", "balance": "71,821.85 Cr" }, { "autoRefNo": "head\\PAY\\45\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2000, "id": 89, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "71,852.85 Cr" }, { "autoRefNo": "head\\PAY\\44\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 87, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "73,852.85 Cr" }, { "autoRefNo": "head\\PAY\\43\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2000, "id": 85, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "74,796.85 Cr" }, { "autoRefNo": "head\\REC\\45\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1800, "debit": 0, "id": 294, "instrNo": "ACH", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "76,796.85 Cr" }, { "autoRefNo": "head\\REC\\46\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 8150, "debit": 0, "id": 296, "instrNo": "IRFC", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "15/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "74,996.85 Cr" }, { "autoRefNo": "head\\PAY\\42\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1000000, "id": 83, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "66,846.85 Cr" }, { "autoRefNo": "head\\PAY\\41\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 700000, "id": 81, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,066,846.85 Cr" }, { "autoRefNo": "head\\REC\\44\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 292, "instrNo": "001816", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "11/10/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,766,846.85 Cr" }, { "autoRefNo": "head\\REC\\43\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 4474, "debit": 0, "id": 290, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,746,846.85 Cr" }, { "autoRefNo": "head\\REC\\42\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1000000, "debit": 0, "id": 288, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,742,372.85 Cr" }, { "autoRefNo": "head\\REC\\41\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 9863, "debit": 0, "id": 286, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "742,372.85 Cr" }, { "autoRefNo": "head\\PAY\\40\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 986.3, "id": 79, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "732,509.85 Cr" }, { "autoRefNo": "head\\REC\\40\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1371, "debit": 0, "id": 284, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "733,496.15 Cr" }, { "autoRefNo": "head\\REC\\39\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1134, "debit": 0, "id": 282, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "732,125.15 Cr" }, { "autoRefNo": "head\\PAY\\39\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 137.1, "id": 77, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "730,991.15 Cr" }, { "autoRefNo": "head\\PAY\\38\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 113.4, "id": 75, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "731,128.25 Cr" }, { "autoRefNo": "head\\PAY\\37\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 73, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "731,241.65 Cr" }, { "autoRefNo": "head\\REC\\38\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 280, "instrNo": "001758", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "21/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "732,185.65 Cr" }, { "autoRefNo": "head\\REC\\37\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 700000, "debit": 0, "id": 278, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "20/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "712,185.65 Cr" }, { "autoRefNo": "head\\REC\\36\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 6904, "debit": 0, "id": 276, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "20/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "12,185.65 Cr" }, { "autoRefNo": "head\\PAY\\36\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 690.4, "id": 71, "instrNo": "TDS on FD interest", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "20/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "5,281.65 Cr" }, { "autoRefNo": "head\\PAY\\35\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 60000, "id": 69, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "5,972.05 Cr" }, { "autoRefNo": "head\\REC\\35\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 40252.95, "debit": 0, "id": 274, "instrNo": "000441", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "03/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "65,972.05 Cr" }, { "autoRefNo": "head\\PAY\\34\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2000, "id": 67, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/09/2019", "tranDetailsId": null, "userRefNo": "", "balance": "25,719.10 Cr" }, { "autoRefNo": "head\\REC\\34\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 272, "instrNo": "001603", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "27,719.10 Cr" }, { "autoRefNo": "head\\PAY\\33\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 11280, "id": 65, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "7,719.10 Cr" }, { "autoRefNo": "head\\PAY\\32\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1500000, "id": 63, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "26/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "18,999.10 Cr" }, { "autoRefNo": "head\\PAY\\31\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 850000, "id": 61, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "26/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,518,999.10 Cr" }, { "autoRefNo": "head\\PAY\\30\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 59, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "26/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "2,368,999.10 Cr" }, { "autoRefNo": "head\\PAY\\29\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 983, "id": 57, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "2,369,943.10 Cr" }, { "autoRefNo": "head\\REC\\33\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1500000, "debit": 0, "id": 270, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "2,370,926.10 Cr" }, { "autoRefNo": "head\\REC\\32\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 15411, "debit": 0, "id": 268, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "870,926.10 Cr" }, { "autoRefNo": "head\\PAY\\28\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1541.1, "id": 55, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "855,515.10 Cr" }, { "autoRefNo": "head\\REC\\31\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 800000, "debit": 0, "id": 266, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "13/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "857,056.20 Cr" }, { "autoRefNo": "head\\REC\\30\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 8219, "debit": 0, "id": 264, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "13/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "57,056.20 Cr" }, { "autoRefNo": "head\\PAY\\27\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 821.9, "id": 53, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "13/08/2019", "tranDetailsId": null, "userRefNo": "", "balance": "48,837.20 Cr" }, { "autoRefNo": "head\\PAY\\26\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1100000, "id": 51, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "49,659.10 Cr" }, { "autoRefNo": "head\\PAY\\25\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1000000, "id": 49, "instrNo": "FD booked", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,149,659.10 Cr" }, { "autoRefNo": "head\\REC\\29\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1100000, "debit": 0, "id": 262, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "2,149,659.10 Cr" }, { "autoRefNo": "head\\REC\\28\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 11301, "debit": 0, "id": 260, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,049,659.10 Cr" }, { "autoRefNo": "head\\PAY\\24\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1130.1, "id": 47, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,038,358.10 Cr" }, { "autoRefNo": "head\\REC\\27\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1000000, "debit": 0, "id": 258, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,039,488.20 Cr" }, { "autoRefNo": "head\\REC\\26\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 10274, "debit": 0, "id": 256, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "39,488.20 Cr" }, { "autoRefNo": "head\\PAY\\23\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1027.4, "id": 45, "instrNo": "TDS", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "29/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "29,214.20 Cr" }, { "autoRefNo": "head\\PAY\\22\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 43, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "30,241.60 Cr" }, { "autoRefNo": "head\\PAY\\21\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 700000, "id": 41, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "22/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "31,185.60 Cr" }, { "autoRefNo": "head\\REC\\25\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 640816.9, "debit": 0, "id": 254, "instrNo": "393806", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "20/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "731,185.60 Cr" }, { "autoRefNo": "head\\PAY\\20\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 449, "id": 39, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "20/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "90,368.70 Cr" }, { "autoRefNo": "head\\REC\\24\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 252, "instrNo": "001652", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "10/07/2019", "tranDetailsId": null, "userRefNo": "", "balance": "90,817.70 Cr" }, { "autoRefNo": "head\\REC\\23\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1757, "debit": 0, "id": 250, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "70,817.70 Cr" }, { "autoRefNo": "head\\REC\\22\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1371, "debit": 0, "id": 248, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "69,060.70 Cr" }, { "autoRefNo": "head\\REC\\21\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1134, "debit": 0, "id": 246, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "67,689.70 Cr" }, { "autoRefNo": "head\\PAY\\19\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 37, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "66,555.70 Cr" }, { "autoRefNo": "head\\PAY\\18\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 131.1, "id": 35, "instrNo": "TDS on FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "67,499.70 Cr" }, { "autoRefNo": "head\\PAY\\17\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 108.5, "id": 33, "instrNo": "TDS on FD Int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "28/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "67,630.80 Cr" }, { "autoRefNo": "head\\CON\\3\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 374, "instrNo": "000167", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "67,739.30 Cr" }, { "autoRefNo": "head\\REC\\19\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 6490, "debit": 0, "id": 242, "instrNo": "000774", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "25/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "47,739.30 Cr" }, { "autoRefNo": "head\\REC\\18\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 5900, "debit": 0, "id": 240, "instrNo": "000773", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "25/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "41,249.30 Cr" }, { "autoRefNo": "head\\PAY\\16\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 6490, "id": 31, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "21/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "35,349.30 Cr" }, { "autoRefNo": "head\\PAY\\15\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1500000, "id": 29, "instrNo": "FD booked", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "18/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "41,839.30 Cr" }, { "autoRefNo": "head\\REC\\17\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 50000, "debit": 0, "id": 238, "instrNo": "000016", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,541,839.30 Cr" }, { "autoRefNo": "head\\REC\\16\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 500000, "debit": 0, "id": 236, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,491,839.30 Cr" }, { "autoRefNo": "head\\REC\\15\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1000000, "debit": 0, "id": 234, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "991,839.30 Cr" }, { "autoRefNo": "head\\REC\\14\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 5137, "debit": 0, "id": 232, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "8,160.70 Dr" }, { "autoRefNo": "head\\REC\\13\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 10274, "debit": 0, "id": 230, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "13,297.70 Dr" }, { "autoRefNo": "head\\PAY\\14\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 513.7, "id": 27, "instrNo": "TDS on FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "23,571.70 Dr" }, { "autoRefNo": "head\\PAY\\13\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1027.4, "id": 25, "instrNo": "TDS on FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "23,058.00 Dr" }, { "autoRefNo": "head\\PAY\\12\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 2944.6, "id": 23, "instrNo": "TDS FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "16/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "22,030.60 Dr" }, { "autoRefNo": "head\\PAY\\11\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 50000, "id": 21, "instrNo": "CBDT", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "19,086.00 Dr" }, { "autoRefNo": "head\\PAY\\10\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 800000, "id": 19, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "14/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "30,914.00 Cr" }, { "autoRefNo": "head\\PAY\\9\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1180, "id": 17, "instrNo": "CARD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "12/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "830,914.00 Cr" }, { "autoRefNo": "head\\PAY\\8\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 5900, "id": 15, "instrNo": "982953", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "12/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "832,094.00 Cr" }, { "autoRefNo": "head\\REC\\12\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 800000, "debit": 0, "id": 228, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "08/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "837,994.00 Cr" }, { "autoRefNo": "head\\REC\\11\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 8219, "debit": 0, "id": 226, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "08/06/2019", "tranDetailsId": null, "userRefNo": "", "balance": "37,994.00 Cr" }, { "autoRefNo": "head\\REC\\10\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 224, "instrNo": "001499", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "29,775.00 Cr" }, { "autoRefNo": "head\\REC\\9\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1050000, "debit": 0, "id": 222, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "9,775.00 Cr" }, { "autoRefNo": "head\\REC\\8\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 10950, "debit": 0, "id": 220, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,040,225.00 Dr" }, { "autoRefNo": "head\\PAY\\7\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1100000, "id": 13, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "31/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "1,051,175.00 Dr" }, { "autoRefNo": "head\\REC\\7\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 1000000, "debit": 0, "id": 218, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "48,825.00 Cr" }, { "autoRefNo": "head\\REC\\6\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 10257, "debit": 0, "id": 216, "instrNo": "FD int", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "951,175.00 Dr" }, { "autoRefNo": "head\\PAY\\6\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1000000, "id": 11, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "961,432.00 Dr" }, { "autoRefNo": "head\\PAY\\5\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 9, "instrNo": "Debit card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/05/2019", "tranDetailsId": null, "userRefNo": "", "balance": "38,568.00 Cr" }, { "autoRefNo": "head\\REC\\5\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 214, "instrNo": "001452", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "30/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "39,512.00 Cr" }, { "autoRefNo": "head\\PAY\\4\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 944, "id": 7, "instrNo": "debit card", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "27/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "19,512.00 Cr" }, { "autoRefNo": "head\\REC\\4\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 700000, "debit": 0, "id": 212, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "20,456.00 Cr" }, { "autoRefNo": "head\\REC\\3\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 800000, "debit": 0, "id": 210, "instrNo": "FD mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "679,544.00 Dr" }, { "autoRefNo": "head\\PAY\\3\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 500000, "id": 5, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/04/2019", "tranDetailsId": null, "userRefNo": "FD", "balance": "1,479,544.00 Dr" }, { "autoRefNo": "head\\PAY\\2\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 1000000, "id": 3, "instrNo": "FD booked", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "17/04/2019", "tranDetailsId": null, "userRefNo": "FD", "balance": "979,544.00 Dr" }, { "autoRefNo": "head\\PAY\\1\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 0, "debit": 800000, "id": 1, "instrNo": "FD", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "09/04/2019", "tranDetailsId": null, "userRefNo": "FD Book", "balance": "20,456.00 Cr" }, { "autoRefNo": "head\\CON\\2\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 20000, "debit": 0, "id": 372, "instrNo": "trf", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "06/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "820,456.00 Cr" }, { "autoRefNo": "head\\REC\\1\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 456, "debit": 0, "id": 206, "instrNo": "interest", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "06/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "800,456.00 Cr" }, { "autoRefNo": "head\\REC\\2\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 700000, "debit": 0, "id": 208, "instrNo": "Fd mat", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "05/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "800,000.00 Cr" }, { "autoRefNo": "head\\CON\\1\\2019", "bankReconId": null, "clearDate": null, "clearRemarks": null, "credit": 100000, "debit": 0, "id": 370, "instrNo": "000013", "lineRefNo": "", "lineRemarks": "", "remarks": "", "tranDate": "02/04/2019", "tranDetailsId": null, "userRefNo": "", "balance": "100,000.00 Cr" }, { "lineRemarks": "Opening balance", "autoRefNo": "Opening balance", "tranDate": "01/04/2019", "clearDate": "01/04/2019", "debit": 0, "credit": 0, "balance": "0.00 Dr" }]

  // <Paper>
  // <Typography variant='h6'>Material-table demo</Typography>
  // <MaterialTable style={{ width: '100%' }}
  //   icons={tableIcons}
  //   title="All transactions"
  //   columns={columnsArray}
  //   data={data}
  //   options={{
  //     paging: true,
  //     pageSize: 20,
  //     pageSizeOptions: [10, 20, 30, 50],
  //     search: true,
  //     draggable: true,
  //     headerStyle: { position: 'sticky', top: 0 },
  //     maxBodyHeight: '650px'
  //   }}
  // >
  // </MaterialTable>
  // </Paper>
