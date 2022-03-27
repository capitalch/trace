let globalKey = 0

function getKey() {
    return (globalKey++)
}

export { getKey }