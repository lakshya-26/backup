import { useState } from 'react'
import './App.css'
import TransportationTracker from './components/TransportationTracker.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TransportationTracker />
    </>
  )
}

export default App
