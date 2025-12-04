import { LogicComponent } from "./LogicComponent";
import { Connection } from "./Connection";
import type { ComponentProps } from "../model/Component";
import { useEffect, useState } from "react";
import type { FetchData } from "../model/FetchData";

// LOGIC GATE SIZES (PIXEL X PIXEL)
// OR 50x50
// NOT 80x40
// AND 80x50
// INPUT/OUTPUT 20x20
// MUX 50x80
export const sizeMap = new Map([
  ["OR", [50, 50]],
  ["NOT", [40, 40]],
  ["AND", [80, 50]],
  ["OUTPUT", [20, 20]],
  ["INPUT", [20, 20]],
  ["MUX", [50, 80]],
  ["ADDER", [80, 60]]
]);

// PROBABLY CHANGE LATER
function getPinCords({ comp, pin_number, is_input = true } : { comp: ComponentProps, pin_number: number, is_input?: boolean } ) {
  if (!sizeMap.has(comp.type)) {
    console.error(`Nie ma zapisanych danych o rozmiarze dla obiektu: ${comp.type}`);
    return null;
  }
  
  let w = sizeMap.get(comp.type)![0];
  const h = sizeMap.get(comp.type)![1];
  
  let pin_x = comp.display_x;
  let pin_y = comp.display_y;
  let n_pins = comp.metadata.num_input_pins;

  if (comp.type == "OUTPUT" || comp.type == "INPUT") {
    w *= comp.bit_width!;
    is_input ? w -= 5 : w += 5;
  }

  if (!is_input) {
    pin_x = pin_x + w;
    n_pins = comp.metadata.num_output_pins;
  }


  if (comp.type == "MUX" && is_input && pin_number == comp.metadata.num_input_pins) {
    pin_x = pin_x + w - 15;
    pin_y = pin_y + h;
  }
  else {    
    const spacing = 20; // FIXED 20 pixels spacing between pins
    const center_y = comp.display_y + h / 2;

    const pin_0_y = center_y + (spacing / 2) * (n_pins - 1);
    pin_y = pin_0_y - (spacing * pin_number);
  }

  return { x: pin_x, y: pin_y };
}

export function Circuit({fetchedData, ref, transform}: { fetchedData: FetchData | null, ref?: React.Ref<SVGGElement> | undefined, transform?: any}) {
  if (!fetchedData) return;

  // INITIALIZE DATA
  const circuit_bit_width = 4;

  const circuit_components_data = fetchedData.components;
  const circuit_connections_data = fetchedData.connections;

  // INPUT / OUTPUT LOGIC INITIALIZATION
  // OUTPUT
  const initial_outputs = circuit_components_data.reduce((acc, component) => {
    const arrayOfOutputs = Array(component.metadata.num_output_pins).fill(Array(component.bit_width ? component.bit_width : circuit_bit_width).fill(0));

    acc[component.id] = arrayOfOutputs;

    return acc;
  }, {} as Record<number, number[][]>);

  // INPUT
  const initial_inputs = circuit_components_data.reduce((acc, component) => {
    const arrayOfInputs = Array(component.metadata.num_input_pins + 1).fill(Array(component.bit_width ? component.bit_width : circuit_bit_width).fill(0));

    acc[component.id] = arrayOfInputs;

    return acc
  }, {} as Record<number, number[][]>);

  const [componentsOutputs, setComponentOutputs] = useState<Record<number, number[][]>>(initial_outputs);
  const [componentsInputs, setComponentInputs] = useState<Record<number, number[][]>>(initial_inputs);

  // CALLBACK: OUTPUT HANDLER FOR COMPONENTS
  const handleOutputChange = (id: number, newValue: number[][]) => {
    setComponentOutputs(prevOoutputs => ({
      ...prevOoutputs,
      [id]: newValue,
    }));
  }
  
  const componentMap = circuit_components_data.reduce((map: Record<number, ComponentProps>, comp) => {
    map[comp.id] = comp;
    return map;
  }, {});

  // Update the inputs for the components
  useEffect(() => {
    circuit_connections_data.forEach(conn => {
      const from_comp = componentMap[conn.from_component_id];
      const to_comp = componentMap[conn.to_component_id];

      setComponentInputs(prevInputs => {
        const newInput = componentsOutputs[from_comp.id];
        const oldArray = componentsInputs[to_comp.id];

        oldArray[conn.to_input_pin] = newInput[conn.from_output_pin];

        const updatedInputs = oldArray;
        
        return {
          ...prevInputs,
          [to_comp.id]: updatedInputs
        }
      });
    });
  }, [componentsOutputs]);

  // Display connections
  const rendered_connections = circuit_connections_data.map(conn =>{
    const from_comp = componentMap[conn.from_component_id];
    const to_comp = componentMap[conn.to_component_id];

    const start_cords = getPinCords({comp: from_comp, pin_number: conn.from_output_pin, is_input: false});
    const end_cords = getPinCords({comp: to_comp, pin_number: conn.to_input_pin, is_input: true});

    if (!start_cords || !end_cords) {
      return null;
    }
    
    let s = false;
    const from_comp_outputs = componentsOutputs[from_comp.id]
    if (from_comp_outputs[conn.from_output_pin]) {
      if (from_comp_outputs[conn.from_output_pin].reduce((acc, bit) => acc << 1 | bit, 0) > 0) {
        s = true;
      }
    }

    const distance_x = Math.sqrt(Math.pow(end_cords.x - start_cords.x, 2));
    let off = distance_x / 2;
  
    return (
      <Connection
        key={conn.id}
        from_x={start_cords.x}
        from_y={start_cords.y}
        to_x={end_cords.x}
        to_y={end_cords.y}
        signal={s}
        offset={(off)}
      />
    )
  });

  // Display whole circuit
  return (
    <g ref={ref} transform={transform}>
      {rendered_connections}

      {circuit_components_data.map(comp => {
        const BW = comp.bit_width ? comp.bit_width : circuit_bit_width;
        
        return (
        <LogicComponent
          key={comp.id}
          {...comp}
          onOutputChange={handleOutputChange}
          bit_width={BW}
          inputs={componentsInputs[comp.id]}
        />)
      })}

    </g>
  )
}

