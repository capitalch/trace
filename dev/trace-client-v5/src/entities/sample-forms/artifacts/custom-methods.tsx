import { manageFormsState } from '../../../react-form/core/fsm'
import { graphqlService } from '../../../common-utils/graphql-service';
import { usingIbuki } from '../../../common-utils/ibuki'
import { utilMethods } from '../../../common-utils/util-methods'
// import { manageEntitiesState } from '../../../utils/esm'
import graphqlQueries from './graphql-queries-mutations'
import { map } from 'rxjs/operators'
const { queryGraphql, mutateGraphql }: any = graphqlService()


const { hotFilterOn } = usingIbuki()
// const { getSubscription, setSubscription } = manageEntitiesState()
// let formId: string = '0'

const customMethods: any = {

  // test2: () => console.log('test2'),
  test1: () => {
    return [
      {
        label: "---select---",
        value: ""
      },
      {
        label: "Male",
        value: "M"
      },
      {
        label: "female",
        value: "F"
      }
    ];
  },
  industries: () => {
    return [
      {
        label: "---select---",
        value: ""
      },
      {
        label: "Software",
        value: "software"
      }, {
        label: "Garment",
        value: "garment"
      }, {
        label: "Entertainment",
        value: "entertainment"
      }, {
        label: "Food",
        value: "food"
      }
    ];
  },
  numericZeroToTen: () => {
    return [
      {
        label: "---select---",
        value: ""
      },
      {
        label: "Zero",
        value: "0"
      }, {
        label: "One",
        value: "1"
      }, {
        label: "Two",
        value: "2"
      }, {
        label: "Three",
        value: "3"
      }, {
        label: "Four",
        value: "4"
      }, {
        label: "Five",
        value: "5"
      }, {
        label: "Six",
        value: "6"
      }, {
        label: "Seven",
        value: "7"
      }, {
        label: "Eight",
        value: "8"
      }, {
        label: "Nine",
        value: "9"
      }, {
        label: "Ten",
        value: "10"
      }
    ];
  },
  electronicProduct: () => {
    return [
      {
        label: "---select---",
        value: ""
      },
      {
        label: "Television",
        value: "television"
      }, {
        label: "Desktop",
        value: "desktop"
      }, {
        label: "Laptop",
        value: "laptop"
      }, {
        label: "projector",
        value: "projector"
      }, {
        label: "Cooler",
        value: "cooler"
      }
    ];
  },

  basicQueryForSelect: async (args: any) => {
    // const { registerServerError } = manageFormsState();
    let ret: any = {}
    ret.data = {}
    let arg1 = ''
    if (args && Array.isArray(args) && (args.length > 0)) {
      arg1 = args[0]
      ret.data[arg1] = []
      try {
        ret = await queryGraphql(graphqlQueries['basicQueryForSelect'](arg1))
      } catch (e) {
        ret.data[arg1] = []
      }
    }
    return ret.data[arg1]
  },
  getStatesAndCities: async (allArgs: any) => {
    const { item, setSelectOptions, setSelectedObject } = allArgs
    const args: string[] = item.options.args
    const selectedValue = item.value || undefined
    const sub = hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED')
      .pipe(
        // moving array filter at observable level
        map((d: any) => d.data.data.sampleForms[args[0]]))
      .subscribe((d: any) => {
        const selectOptions = d.map((el: any) => {
          return { "label": el.label, "value": el.value }
        })
        if (selectedValue) {
          const obj = selectOptions.find((x: any) => x.value === selectedValue)
          setSelectedObject({ ...obj })
        }
        setSelectOptions([...selectOptions])
      })
    return sub
  },

  dataCache: (args: any) => new Promise((resolve, reject) => {
    const arg1 = args[0]
    hotFilterOn('DATACACHE-SUCCESSFULLY-LOADED').subscribe(d => {
      const ret = d.data.data.accDataCache[arg1]
      resolve(ret)
    })
    // setSubscription(entityName, message, sub)
  })
}

export default customMethods
