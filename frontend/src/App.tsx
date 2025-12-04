import { Grid } from './component/Grid'
import { Header } from './component/Header'
import './assets/style/App.css'
import { useEffect, useState } from 'react';

function App() {
  const [circuitID, setCircuitID] = useState(0);

  const handleCircuitChange = (cid: number) => {
    setCircuitID(cid);
  }

  useEffect(()=> {
    document.title = "ALU Simulator";

  }, []);

  return (
    <div>
      {/* <Header onCircuitChange={handleCircuitChange}/> */}
      <Grid circuit_id={1}/>
    </div>
  );
}

export default App
