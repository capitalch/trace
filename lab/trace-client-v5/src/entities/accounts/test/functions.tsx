import { utils } from '../utils'

const { isImproperDate, isInvalidStateCode } = utils()

function test() {
    const { isInvalidDate } = utils()
    function testIsImproperDate() {
        const obj: any = {}
        obj.ret1 = isImproperDate('1900-01-01')
        obj.ret2 = isImproperDate('1910-01-01')
        obj.ret3 = isImproperDate('1930-01-01')
        obj.ret4 = isImproperDate('1948-12-01')
        obj.ret5 = isImproperDate('2022-01-30')
        console.log(obj)
    }

    function testIsInvalidStateCode() {
        const obj: any = {
            a: isInvalidStateCode(0),
            b: isInvalidStateCode(1),
            c: isInvalidStateCode(40),
            d: isInvalidStateCode(null),
            e: isInvalidStateCode(undefined),
            f: isInvalidStateCode(''),
            g: isInvalidStateCode('abcd'),
        }
        console.log(obj)
    }

    function testIsInvalidDate1() {
       
    }

    function testIsInvalidDate() {
        isInvalidDate('24/03/2022')
    }

    return {
        testIsInvalidDate,
        testIsInvalidDate1,
        testIsImproperDate,
        testIsInvalidStateCode,
    }
}

export { test }
