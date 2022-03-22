

function Component1() {

    function func1() {
        console.log(var1())
    }
    func1()
    return (<div>Comp1</div>)

    function var1 (){return 'abcd'}
}
export { Component1 }