import { useState } from 'react'
import './App.css'
import FoodTracker from './components/FoodTracker'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FoodTracker />
    </>
  )
}

export default App
