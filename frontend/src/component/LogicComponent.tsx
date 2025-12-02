import { useEffect, useState } from "react";
import type { ComponentProps } from "../model/Component";
import { sizeMap } from "./Circuit";

function NOTGate({ baseData, input, onOutputChange } : { baseData: ComponentProps, input?: number[], onOutputChange?: (id: number, newValue: number[][]) => void }) {
  let newOutput = Array(baseData.bit_width).fill(0);
  useEffect(() => {
    if (input && onOutputChange) {
      for(var i = 0; i < baseData.bit_width!; i++) {
        newOutput[i] = input[i] == 0 ? 1 : 0;
      }

      onOutputChange(baseData.id, [newOutput]);
    }
  }, [input]);

  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`} className="notGate">
      <polygon points="10, 0 10,40 50,20" fill="white" stroke="black" strokeWidth="1"/>
      <circle cx="60" cy="20" r="5" fill="white" stroke="black" strokeWidth="1"/>
      <line x1="0" y1="20" x2="10" y2="20" stroke="black" strokeWidth="1"/>
      <line x1="65" y1="20" x2="85" y2="20" stroke="black" strokeWidth="1"/>
    </g>
  );
}

function ORGate({ baseData, input1, input2, onOutputChange} : {baseData: ComponentProps, input1?: number[], input2?: number[], onOutputChange?: (id: number, newValue: number[][]) => void }) {
  let newOutput = Array(baseData.bit_width).fill(0);

  useEffect(() => {
    if (input1 && input2 && onOutputChange) {
      for(var i = 0; i < baseData.bit_width!; i++) {
        newOutput[i] = input1[i] | input2[i];
      }

      onOutputChange(baseData.id, [newOutput]);
    }
  }, [input1, input2]);
  
  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`} className="orGate">
      {/* Input */}
      <line x1="0" y1="15" x2="15" y2="15" stroke="black" strokeWidth="1"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="black" strokeWidth="1"/>
      {/* Body */}
      <path d="M0 0 C 0 0, 30 0, 40 25 C 30 50, 10 50, 0 50 Q 30 25, 0 0" stroke="black" fill="white" strokeWidth="1"/>
      {/* Output */}
      <line x1="40" y1="25" x2="50" y2="25" stroke="black"/>
    </g>
  )
}

function ANDGate({ baseData, input1, input2, onOutputChange } : { baseData: ComponentProps, input1?: number[], input2?: number[], onOutputChange?: (id: number, newValue: number[][]) => void}) {
  let newOutput = Array(baseData.bit_width).fill(0);

  useEffect(() => {
    if (input1 && input2 && onOutputChange) {
      for(var i = 0; i < baseData.bit_width!; i++) {
        newOutput[i] = input1[i] & input2[i];
      }

      onOutputChange(baseData.id, [newOutput]);
    }
  }, [input1, input2]);

  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`} className="andGate">
      {/* Input */}
      <line x1="0" y1="15" x2="15" y2="15" stroke="black" strokeWidth="1"/>
      <line x1="0" y1="35" x2="15" y2="35" stroke="black" strokeWidth="1"/>
      {/* Body */}
      <path d="M50 50 L 15 50 L 15 0 L 50 0" fill="white" stroke="black" strokeWidth="1"/>
      <path d="M50 0 C 70 0 70 50 50 50" fill="white" stroke="black" strokeWidth="1"/>
      {/* Output */}
      <line x1="65" y1="25" x2="80" y2="25" stroke="black" strokeWidth="1"/>
    </g>
  )
}

function BitBus({ baseData, input, onOutputChange }: { baseData: ComponentProps, input?: number[], onOutputChange?: (id: number, newValue: number[][]) => void }) {
  const [bits, setBits] = useState(Array(baseData.bit_width).fill(0));
  
  useEffect(() => {
    if(input){
      setBits(input);
    }
  }, [input]);


  const handleToggle = (index: number) => {
    if (baseData.type == "OUTPUT") return;
    let newBits = [...bits];
    newBits[index] = bits[index] == 0 ? 1 : 0;
    setBits(newBits);

    if(onOutputChange) onOutputChange(baseData.id, [newBits]);
  }

  const bus = bits.map((value, index) => <BitCell key={index} x={20 * index} y={0} mode={baseData.type} onToggle={() => handleToggle(index)} value={value}/>);
  
  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`} className="bitBus">
      {bus}
      <line x1={baseData.type == "INPUT" ? 20 * baseData.bit_width! : 0} y1="10" x2={baseData.type == "INPUT" ? 20 * baseData.bit_width! + 5 : -5} y2="10" stroke="black" strokeWidth="1"/>
    </g>
  )
}

function BitCell({ x, y, mode = "INPUT", value, onToggle }: { x: number, y: number, mode?: string, value?: number, onToggle?: () => void}) {
  const handleClick = () => {
    if(mode == "INPUT" && onToggle) onToggle();
  };

  return (
    <g transform={`translate(${x}, ${y})`} className="bitCell" onClick={handleClick} style={{cursor: mode == "INPUT" ? "pointer" : "default", userSelect: "none"}}>
      <rect width="20" height="20" x="0" y="0" fill="white" stroke={mode == "INPUT" ? "green" : "red"}/>
      <text x="5" y="15" fontFamily="Verdana">{value}</text>
    </g>
  )
}

function Mux({ baseData, inputs, onOutputChange } : { baseData: ComponentProps, inputs: number[][], onOutputChange?: (id:number, newValue: number[][]) => void }) {
  const opcode = inputs[inputs.length - 1]; // LAST PIN IN ARRAY IS ALWAYS FOR OPCODE (OPERATION CODE)
  const inputIndex = opcode.reduce((acc, bit) => acc << 1 | bit, 0);

  useEffect(() => {
    if (inputs && onOutputChange) {
      onOutputChange(baseData.id, [inputs[inputIndex]]);
    }
  }, [...inputs]);

  const inputPins = inputs.slice(0, inputs.length - 1).map((val, index) => {
    const spacing = 20;
    const h = sizeMap.get("MUX")![1];
    const center_y = h / 2;
    let ni_pins = baseData.metadata.num_input_pins;
    const pin_0_y = center_y + (spacing / 2) * (ni_pins - 1);
    const pin_y = pin_0_y - (spacing * index);
    
    return <line x1="0" y1={pin_y} x2="10" y2={pin_y} stroke="black" strokeWidth="1"></line>
  })
  
  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`}>
      {/* Input */}
      {inputPins}
      {/* Body */}
      <path d="M10 0 L 40 20 L 40 60 L 10 80 L 10 0" stroke="black" fill="white" strokeWidth="1"/>
      {/* Output */}
      <line x1="40" y1="40" x2="55" y2="40" stroke="black" strokeWidth="1"></line>
      {/* Operation Input */}
      <line x1="35" y1="65" x2="35" y2="80" stroke="black" strokeWidth="1"></line>
    </g>
  );
}

function Adder({ baseData, inputs, onOutputChange } : { baseData: ComponentProps, inputs: number[][], onOutputChange?: (id: number, newValue: number[][]) => void }) {
  useEffect(() => {  
    if (inputs && onOutputChange){
      let newOutput = Array(baseData.bit_width).fill(0);
      let cin = inputs[0][0];
      const A = inputs[1];
      let B = inputs[2];

      if (cin == 1) {
        let invB = Array(B.length).fill(0);
        for (let i = 0; i < B.length; i++) {
          invB[i] = B[i] ^ cin;  // invert B if cin=1
        }

        B = invB;
      }

      for(var i=A.length - 1; i >= 0; i--) {
        const abit = A[i];
        const bbit = B[i];

        newOutput[i] = abit ^ bbit ^ cin
        cin = (abit & bbit) | (cin & (abit ^ bbit))
      }

      onOutputChange(baseData.id, [newOutput, [cin]]);
    }
  }, [...inputs]);

  return (
    <g transform={`translate(${baseData.display_x}, ${baseData.display_y})`}>
      {/* Input */}
      <line x1="0" y1="10" x2="10" y2="10" stroke="black"/>
      <line x1="0" y1="30" x2="10" y2="30" stroke="black"/>
      <line x1="0" y1="50" x2="10" y2="50" stroke="black"/>
      {/* Body */}
      <rect width="60" height="60" x="10" y="0" fill="white" stroke="black"/>
      {/* Output */}
      <line x1="70" y1="30" x2="80" y2="30" stroke="black"/>
      {/* Carry out */}
      <line x1="70" y1="40" x2="80" y2="40" stroke="black"/>
    </g>
  )
}

export function LogicComponent(props: ComponentProps) {
  let inp = Array(props.metadata.num_input_pins + 1).fill(Array(props.bit_width ? props.bit_width : 1).fill(0))
  if (props.inputs) {
    inp = props.inputs;
  }
  
  switch(props.type) {
    case "MUX":
      return <Mux baseData={props} inputs={inp} onOutputChange={props.onOutputChange}/>
    case "NOT":
      return <NOTGate baseData={props} input={inp[0]} onOutputChange={props.onOutputChange}/>
    case "OR":
      return <ORGate baseData={props} input1={inp[0]} input2={inp[1]} onOutputChange={props.onOutputChange}/>
    case "AND":
      return <ANDGate baseData={props} input1={inp[0]} input2={inp[1]} onOutputChange={props.onOutputChange}/>
    case "INPUT":
      return <BitBus baseData={props} onOutputChange={props.onOutputChange}/>
    case "OUTPUT":
      return <BitBus baseData={props} input={inp[0]} />
    case "ADDER":
      return <Adder baseData={props} inputs={inp} onOutputChange={props.onOutputChange}/>
  }

  return null;
}