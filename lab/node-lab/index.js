const axios = require('axios')
const http = require('http')

const server = http.createServer((req, res) => {
    res.end('hello')
})


function func1(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`func:${time}`)
            console.log(`func1:${time}`)
        }, time)
    })
    // return async function f() {
    //     setTimeout(() => {
    //         // reject(`func22:${time}`)
    //         console.log(`func1:${time}`)
    //     }, time)
    // }
}

function func2(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(`func22:${time}`)
            console.log(`func2:${time}`)
        }, time)
    })
}

async function func() {
    //serial
    const startDate = Date.now()
    const val1 = await func1(1000)
    console.log(val1)
    console.log(await func1(2000))
    console.log(await func1(3000))
    const endDate = Date.now()
    console.log('Delta:', endDate - startDate)
}

async function funcP() {
    try {
        const startDate = Date.now()
        await Promise.allSettled([
            func1(1000),
            func2(1000),
            func1(1000),
            func1(1000),
        ])
        // await Promise.all([func1(1000), func2(1000), func1(1000), func1(1000)])
        const endDate = Date.now()
        console.log('Delta:', endDate - startDate)
    } catch (e) {
        console.log(e.message)
    }
}

funcP()

server.listen(3000, async (err) => {
    console.log('server listening at port 3001')
})


// const startDate = Date.now()
// let endDate