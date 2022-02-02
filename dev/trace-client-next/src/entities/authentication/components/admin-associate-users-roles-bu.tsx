import { useEffect, useRef, useState } from '../../../imports/regular-imports'
import { useSharedElements } from './shared-elements-hook'
import { ReactForm, } from '../../../imports/trace-imports'

function AdminAssociateUsersRolesBu() {
    const [, setRefresh] = useState({})
    const meta: any = useRef({
        title: 'Admin associate users with roles and Bu',
        showDialog: false,
        sharedData: undefined,
        dialogConfig: {
            isEditMode: false,
            title: '',
            tableName: 'TraceUser',
            formId: 'admin-manage-bu',
            actions: () => {},
            content: () => <></>,
        },
    })
    const {
        emit,
        filterOn,
        getCurrentEntity,
        getFormData,
        resetForm,
        TraceFullWidthSubmitButton,
    } = useSharedElements()
    return <div>Associate</div>
}

export { AdminAssociateUsersRolesBu }