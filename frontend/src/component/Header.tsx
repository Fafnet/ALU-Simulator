import '../assets/style/Header.css'

export function Header( { onCircuitChange } : { onCircuitChange: (cid: number) => void }) {
  return (
    <div id='header'>
        <h2 id='header_title'>ALU SIMULATOR</h2>
        <Button text={"1-bit ALU"} newID={1} onCircuitChange={onCircuitChange}/>
    </div>
  )
};


function Button({ text, newID, onCircuitChange } : { text: string, newID: number, onCircuitChange: (cid: number) => void}) {
  const handleClick = () => {
    onCircuitChange(newID);
  };
  
  return <button className='header_button' onClick={handleClick}>{text}</button>
}

