import { getFromBag } from "../redirect"

export function useBranchTransferheader(){
    
    function getOptionsOtherThanCurrentBranch() {
        const branches: any[] = getFromBag('branches')
        const branchObject = getFromBag('branchObject')
        const currentBranchId = branchObject.branchId
        const filteredBranches = branches.filter((branch: any) => branch.branchId !== currentBranchId)
        const options: any[] = filteredBranches.map((branch: any) => {
            return <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>
        })
        options.unshift(<option key={0} value={''}>--- Select branch ---</option>)
        return (options)
    }

    function getCurrentBranchObject(){
        const branchObject = getFromBag('branchObject')
        // 
        return(branchObject)
    }
    return ({ getOptionsOtherThanCurrentBranch, getCurrentBranchObject })
}