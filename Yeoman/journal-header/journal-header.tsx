function JournalHeader(){
	const [, setRefresh] = useState({})

    return(<div className=''>
    	JournalHeader
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