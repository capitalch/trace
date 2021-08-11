function <%= compName %>(){
	const [, setRefresh] = useState({})

    return(<div className=''>
    	<%= compName %>
    </div>)

    const meta: any = useRef({
        isMounted: false,
    })

    useEffect(() => {
        meta.current.isMounted = true

        return (() => {
            meta.current.isMounted = false
        })
    }, [])

    function test(){
        
    }
}