import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/Home';
import Layout from './components/Layout';

function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={
        <Layout><Home/></Layout>
        }/>

    </Routes>
  
    </>
  )
}

export default App
