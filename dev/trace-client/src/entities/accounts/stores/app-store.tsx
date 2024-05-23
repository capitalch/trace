import { Signal, signal } from "@preact/signals-react";
import _ from "lodash";
import { FC } from "react";

const appStoreT: AppStoreType = {
    modalDialogA: {
        body: signal(() => <></>),
        defaultData: signal(undefined),
        isOpen: signal(false),
        isCentered: false,
        isFullScreen: false,
        itemData: signal({}),
        maxWidth: signal('sm'),
        title: signal(''),
        toShowCloseButton: signal(false),
        onModalDialogClose: () => { }
    },

    modalDialogB: {
        body: signal(() => <></>),
        defaultData: signal(undefined),
        isOpen: signal(false),
        isCentered: false,
        maxWidth: signal('md'),
        title: signal(''),
        toShowCloseButton: signal(false),
    },

    syncFusionGrid: {
        pur: {
            searchText: signal(''),
            viewLimit: signal(100)
        },
        ret: {
            searchText: signal(''),
            viewLimit: signal(100)
        }
    }
}

const AppStore: AppStoreType = _.cloneDeep(appStoreT)
export { AppStore }

type AppStoreType = {
    modalDialogA: {
        body: Signal<FC>
        defaultData: Signal<any>
        isOpen: Signal<boolean>
        isCentered?: boolean
        isFullScreen?: boolean
        itemData: Signal<any>
        maxWidth: Signal<'md' | 'sm' | 'lg' | 'md'>
        title: Signal<string>
        toShowCloseButton: Signal<boolean>
        onModalDialogClose: (item?:any) => void
    },

    modalDialogB: {
        body: Signal<FC>
        defaultData: Signal<any>
        isOpen: Signal<boolean>
        isCentered?: boolean
        maxWidth: Signal<'md' | 'sm' | 'lg' | 'md'>
        title: Signal<string>
        toShowCloseButton: Signal<boolean>
    },

    syncFusionGrid: {
        [key: string]: {
            searchText: Signal<string>,
            viewLimit: Signal<number>
        }
    }
}