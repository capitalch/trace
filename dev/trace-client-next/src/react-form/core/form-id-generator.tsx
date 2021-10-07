let id = 0
const getNextId = () => {
    id = id + 1
    return id.toString()
}

export default getNextId