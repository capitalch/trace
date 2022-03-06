import { useEffect } from 'react';
import { manageFormsState } from "./fsm";

const ErrorDisplay = (props: any) => {
    const { formId, controlId } = props // formId is used in case of server error or form level error only
    const {
        getValidationFabric }: any = manageFormsState()
    const { getItemErrors } = getValidationFabric()
    const fn = () => {
        let out: any[] = []
        const errors: string[] = getItemErrors(formId, controlId)
        errors.forEach((err: string, index: number) => {
            err && out.push(<li key={index}>{err}</li>);
        })
        return out;
    }
    useEffect(() => {
        return (() => {
        })
    }, [])

    const comp =
        <div className="x-error" >
            <small>
                {
                    <ul>
                        {fn()}
                    </ul>
                }
            </small>
        </div>
    return comp;
}
export { ErrorDisplay };
