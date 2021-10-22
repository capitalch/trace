import { filter } from 'rxjs/operators';
import { Subject, BehaviorSubject, debounce } from 'rxjs';
import { debounceTime } from 'rxjs/operators'
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

    function debounceEmit(id: string, options: any) {
        subject.next({ id: id, data: options })
    }

    function debounceFilterOn(id: string, debouncePeriod:number = 1000) {
        return (subject.pipe(filter((d: any) => (d.id === id))).pipe(debounceTime(debouncePeriod)))
    }

    // function deb(){
    //     subject.pipe(debounceTime(1000)).subscribe(()=>{

    //     })
    // }
    return { emit, filterOn, hotEmit, hotFilterOn, debounceEmit, debounceFilterOn }
}
export { useIbuki, Subject, debounceTime }