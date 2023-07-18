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
        // selectedItem:signal({}),
        title: signal(''),
        toShowCloseButton: signal(false),
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
}

const AppStore: AppStoreType = _.cloneDeep(appStoreT)
export { AppStore }

type AppStoreType = {
    modalDialogA: {
        body: Signal<FC>
        defaultData: Signal<any>
        isOpen: Signal<boolean>
        isCentered?: boolean
        isFullScreen?:boolean
        itemData: Signal<any>
        maxWidth: Signal<'md' | 'sm' | 'lg' | 'md'>
        // selectedItem?:Signal<any>
        title: Signal<string>
        toShowCloseButton: Signal<boolean>
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
}