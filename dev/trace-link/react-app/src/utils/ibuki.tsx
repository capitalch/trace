import { filter } from 'rxjs/operators'
import { Subject, BehaviorSubject } from 'rxjs'

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

function usingIbuki() {

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

export { useIbuki, usingIbuki }