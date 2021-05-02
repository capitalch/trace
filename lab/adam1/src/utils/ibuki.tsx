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
This listing contains all ibuki messages, source the recipients of such messages.
At run time the messages, source and receipients are validated. All ibuki messages, source and
recipients must exist in this file.
*/

const ibukiMessages = {
    'MENU-RECEIVED-FROM-SERVER': {
        sources: ['App'],
        recipients: ['TraceHeader']
    },
    'TOP-MENU-ITEM-CLICKED': {
        sources: ['TraceHeader'],
        recipients: ['TraceLeft']
    },
    'LOAD-COMPONENT-ON-LEFT-MENU-CLICK': {
        sources: ['TraceTree'],
        recipients: ['TraceComponentLoader']
    },
    'PAYMENT-VOUCHER-CREDITS' :{
        sources:['custom-methods.creditAmountChange'],
        recipients:['custom-controls.VoucherCredits']
    },
    'PAYMENT-VOUCHER-DEBITS' :{
        sources:['custom-methods.debitAmountChange'],
        recipients:['custom-controls.VoucherDebits']
    },
    // 'REGISTER-ARTIFACTS':{
    //     // 1) from entities/accounts/register-artifacts.tsx
    //     // 2) from entities/sample-forms/register-artifacts.tsx
    //     sources:['entities/accounts/artifacts/emit-artifacts.tsx', 'entities/sample-forms/use-artifacts.tsx:useArtifacts'], 
    //     recipients:['register-artifacts.tsx:registerArtifacts'] 
    // },
    'DATACACHE-SUCCESSFULLY-LOADED':{
        sources:['trace-left'],
        recipients:['custom-methods']
    }
}

export { ibukiMessages }
/*
class Ibuki {
    subject = new Subject();
    behSubject = new BehaviorSubject<any>(0);

    emit(id: String, options: any) {
        this.subject
            .next({ id: id, data: options });
    };

    filterOn(id: String) {
        return (this.subject.pipe(filter((d: any) => (d.id === id))));
    }

    asyncFilterOn(id: String, f: any) {
        return this.subject.pipe(filter((d: any) => d.id === id))
            .subscribe(d => {
                f(d);
            });
    }

    hotEmit(id: string, options: any) {
        this.behSubject.next({ id: id, data: options });
    }

    hotFilterOn(id: string) {
        return this.behSubject.pipe(filter((d: any) => (d.id === id)));
    }

    async httpGet1(url: string) {
        const res = await fetch(url);
        const json = await res.json();
        return json;
    }

    async httpGet(url: string) {
        const res = await axios.get(url);
        return res; //res.data has actual data
    }

    async httpPost(url: string, data: any) {
        const res = await axios.post(url, data);
        return res; //res.data has actual data
    }

    async httpPost1(url: string, data: any) {
        let ret = '';
        try {
            const res = await fetch(url, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencoded",
                },
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            });
            const json = await res.json();
            ret = json;
        } catch (e) {
            console.log(e);
            ret = e;
        }
        return ret;
    }

    httpPost2(url: string, data: any) {
        const promise = fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then((res) => {
                const ret = res.json();
                return ret;
            })
            .then(json => {
                return json;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
        return promise;
    }

}

const ibuki = new Ibuki();
export { ibuki };
*/