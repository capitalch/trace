import { useIbuki } from '../../../common-utils/ibuki'
import { utilMethods } from '../../../common-utils/util-methods'
import { map } from 'rxjs/operators';
import moment from 'moment'
import { manageFormsState } from '../../../react-form/core/fsm'
import { manageEntitiesState } from '../../../common-utils/esm'
// import queries from './graphql-queries-mutations'
// import { graphqlService } from '../../../common-utils/graphql-service'
import {utils} from '../utils'
const { emit, hotFilterOn } = useIbuki()
const customMethods: any = {

  resetVoucher: async (props: any) => {
    const { formId } = props
    const { resetForm } = manageFormsState()
    const { getCurrentComponent } = manageEntitiesState()
    const mode = getCurrentComponent().mode //getFromBag('mode')
    if (mode === 'new') {
      resetForm(formId)
      emit('LOAD-MAIN-COMPONENT-NEW', getCurrentComponent()) // To reload the form for resetting all controls
    } else if (mode === 'edit') {
      emit('LOAD-MAIN-COMPONENT-VIEW', getCurrentComponent())
    }
  }

  , transformDataAndSubmit: async (formId: string) => {
    const { saveForm, extractAmount, removeProp } = utilMethods()
    const { getFormData, getMetaData } = manageFormsState()
    // function getMetaDetails(item: any, tableName: string, fieldNames: string[]) {
    //   const data: any = {}
    //   for (let fieldName of fieldNames) {
    //     data[fieldName] = item[fieldName]
    //   }
    //   return {
    //     "tableName": tableName,
    //     "fkeyName": "tranDetailsId",
    //     "data": data
    //   }
    // }

    function getGstDetails(item: any, tableName: string, gst: any) {
      function removeExtraChars(gst1: any) {
        gst1.rate = gst1.rate ? extractAmount(gst1.rate) : 0.00
        gst1.cgst = gst1.cgst ? extractAmount(gst1.cgst) : 0.00
        gst1.sgst = gst1.sgst ? extractAmount(gst1.sgst) : 0.00
        gst1.igst = gst1.igst ? extractAmount(gst1.igst) : 0.00
        gst1.isInput = true
        return gst1
      }
      const extractedGst = removeExtraChars({ ...gst })
      return {
        "tableName": tableName,
        "fkeyName": "tranDetailsId",
        "data": extractedGst
      }
    }

    function adjustItems(items: any, dc: string) {
      function pushDetails(item: any, detail: any) {
        if (!item.details) {
          item.details = []
        }
        item.details.push(detail)
      }
      items.forEach((item: any) => {
        item.dc = dc
        item.amount = extractAmount(item.amount)
        // if ('instrNo' in item) {
        //   if (item.instrNo) {
        //     let metaDetails = undefined
        //     metaDetails = getMetaDetails(item, 'ExtMetaTranD', ['instrNo'])
        //     item.instrNo = undefined
        //     pushDetails(item, metaDetails)
        //   }
        // }
        if ('gst' in item) {
          if (item.gst.isGst) {
            removeProp(item.gst, 'isGst') // delete the property otherwise it will create problem while saving in database 
            if (Object.keys(item.gst).length > 0) {
              const gstDetails = getGstDetails(item, 'ExtGstTranD', item.gst)
              pushDetails(item, gstDetails)
            }
          }
          item.gst = undefined
        }
      })
      return items
    }

    function getVoucher(formId: string) {
      const {getFromBag} = manageEntitiesState()
      const finYearId = getFromBag('finYearObject')?.finYearId
      const branchId = getFromBag('branchObject')?.branchId || 1
      const dateFormat = 'DD/MM/YYYY'
      const isoFormat = 'YYYY-MM-DD'
      const voucher: any[] = [{
        "tableName": "TranH",
        "data": [{
          "tranDate": null,
          "userRefNo": null,
          "remarks": null,
          "tags": null,
          "jData": "{}",
          // "tranTypeId": "2",
          "finYearId": finYearId,
          "branchId": branchId,
          "posId": "1",
          "autoRefNo": null,
          "details": []
        }]
      }]
      const formData = JSON.parse(JSON.stringify(getFormData(formId))) // to deep clone. The object destructuring only does shallow cloning
      const metaData = getMetaData(formId)     
      const header = formData.header
      header['tranDate'] = moment(header['tranDate'],dateFormat).format(isoFormat)
      if(metaData && metaData.tranTypeId){
          header.tranTypeId = metaData.tranTypeId
      }
      let credits = formData.credits
      let debits = formData.debits
      let deletedIds = formData.deletedIds
      if (!Array.isArray(credits)) { credits = [credits] }
      if (!Array.isArray(debits)) { debits = [debits] }
      credits = adjustItems(credits, 'C')
      debits = adjustItems(debits, 'D')
      voucher[0].data[0] = Object.assign(voucher[0].data[0], header)
      const dataArray: any[] = credits.concat(debits)
      const detail = {
        "tableName": "TranD",
        "fkeyName": "tranHeaderId",
        "data": dataArray,
        "deletedIds": deletedIds
      }
      voucher[0].data[0].details.push(detail)
      return voucher
    }

    const voucher: any = getVoucher(formId)
    // const ret = await saveForm(voucher, formId)
    const ret = await saveForm({
      data: voucher
      , formId:formId      
    })
    return (ret)
  },

  getFilteredAccounts: async (allArgs: any) => {
    const { item, setSelectOptions, setSelectedObject } = allArgs
    const {registerAccounts} = utils()
    const args: string[] = item.options.args
    const selectedValue = item.value || undefined
    const sub = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED')
      .pipe(
        // moving array filter at observable level
        map((d: any) => d.data.allAccounts.filter((el: any) => args.includes(el.accClass) && el.accLeaf === 'Y'))
      ).subscribe((d: any) => {
        registerAccounts(d)
        const selectOptions = d.map((el: any) => {
          return { "label": el.accName, "value": el.id }
        })
        if (selectedValue) {
          const obj = selectOptions.find((x: any) => x.value === selectedValue)
          setSelectedObject({ ...obj })
        }
        setSelectOptions([...selectOptions])
      })
    return sub
  }
}

export default customMethods
/*

*/