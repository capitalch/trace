import './App.scss'
import { Comp1 } from './components/comp1'

function App() {
    const userProfile = {
        name: 'Sushant',
        address: '12 JL',
    }

    return (
        <div className="App">
            <Comp1 />
        </div>
    )
}

export default App
