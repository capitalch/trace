import { filter } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
// import axios from 'axios';

const subject = new Subject()
const behSubject = new BehaviorSubject<any>(0)

function useIbuki() {

    const emit = (id: string, options: any) => {
        subject.next({ id: id, data: options })
    }
    const filterOn = (id: string) => {
        return (subject.pipe(filter((d: any) => (d.id === id))))
    }
    const hotEmit = (id: string, options: any) => {
        behSubject.next({ id: id, data: options })
    }
    const hotFilterOn = (id: string) => {
        return behSubject.pipe(filter((d: any) => (d.id === id)));
    }
    return { emit, filterOn, hotEmit, hotFilterOn }
}
export { useIbuki }

/*
This listing contains all ibuki messages, source the target of such messages.
At run time the messages, source and receipients are validated. All ibuki messages, source and
target must exist in this file.
*/

const ibukiMessages = {
    'MENU-RECEIVED-FROM-SERVER': {
        source: ['App'],
        target: ['TraceHeader']
    },
    'TOP-MENU-ITEM-CLICKED': {
        source: ['TraceHeader'],
        target: ['TraceLeft']
    },
    'DATACACHE-SUCCESSFULLY-LOADED': {
        source: ['trace-left'],
        target: ['custom-methods']
    },
    'LOAD-MAIN-COMPONENT-NEW': {
        source: ['TraceTree', 'custom-methods', 'util-methods'],
        target: ['trace-main']
    },
    'PAYMENT-CREDITS': {
        source: ['custom-methods.creditAmountChange'],
        target: ['custom-controls.VoucherCredits']
    },
    'PAYMENT-DEBITS': {
        source: ['custom-methods.debitAmountChange'],
        target: ['custom-controls.VoucherSum']
    },
    'SHOW-MESSAGE': {
        source: ['util-methods.utilMethods', 'custom-methods.deleteTranH'],
        target: ['trace-header']
    },
    'DATABASE-SERVER-CONNECTION-RESULT': {
        source: ['App'],
        target: ['trace-subheader']
    },
    'LOAD-MAIN-COMPONENT-VIEW': {
        source: ['trace-subheader'],
        target: ['trace-main']
    },
    'LOAD-MAIN-COMPONENT-EDIT': {
        source: ['trace-subheader', 'data-view'],
        target: ['trace-main']
    },
    'LOAD-MAIN-JUST-REFRESH': {
        source: ['data-view-columns'],
        target: ['trace-main']
    },
    'DATA-VIEW-NO-OF-ROWS': {
        source: ['NoOfRowsSelector'],
        target: ['data-view']
    },
    'TRAN-HEADER-DELETED':{
        source:['custom-methods.deleteTranH'],
        target:['']
    },
    'SHOW-LEDGER':{
        source: [''],
        target:['trace-main.TraceMain']
    },
    'LOGIN-CLICKED':{
        source:['trace-header'],
        target:['trace-main']
    },
    'ACTIVATE-SUPERADMIN':{
        source:['trace-login-dialog'],
        target:['trace-header']
    },
    'LOAD-LEFT-MENU':{
        source:['trace-header.tsx'],
        target:['trace-left.tsx']
    },
    // 'CHANGE-UID': {
    //     source: [''],
    //     target:['']
    // }
}

export { ibukiMessages }
/*

*/