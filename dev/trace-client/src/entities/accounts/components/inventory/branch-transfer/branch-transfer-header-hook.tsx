import { getFromBag } from "../redirect"

export function useBranchTransferheader(){
    
    function getbranchesOptions() {
        const branches: any[] = getFromBag('branches')
        const options: any[] = branches.map((branch: any) => {
            return <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>
        })
        options.unshift(<option key={0} value={''}>--- Select branch ---</option>)
        return (options)
    }

    function getCurrentBranchObject(){
        const branchObject = getFromBag('branchObject')
        // const branchId = branchObject.branchId
        return(branchObject)
    }
    return ({ getbranchesOptions, getCurrentBranchObject })
}