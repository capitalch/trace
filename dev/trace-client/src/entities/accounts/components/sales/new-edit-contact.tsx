import { useNewEditContact} from './new-edit-contact-hook'

function NewEditContact({arbitraryData}: any){
	const {Form} = useNewEditContact(arbitraryData)
        return(<Form />)
}

export {NewEditContact}