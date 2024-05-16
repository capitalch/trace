export function useBranchTransferLineItem() {

    function getbranchesOptions() {
        return <>
            <option key='1' value={'branch1'}>Branch 1</option>
            <option key='2' value={'branch2'}>Branch 2</option>
            <option key='3' value={'branch3'}>Branch 3</option>
        </>
    }

    function handleAddLineItem() {
        console.log('Add Line Item')
    }

    function handleDeleteLineItem() {
        console.log('Delete Line Item')
    }

    return ({ getbranchesOptions, handleAddLineItem, handleDeleteLineItem })
}