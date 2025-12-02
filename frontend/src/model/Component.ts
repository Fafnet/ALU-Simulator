export type ComponentMetadata = {
  num_input_pins: number,
  num_output_pins: number,
  label: string,
}


export type ComponentProps = {
  id: number,
  circuit_id: number,
  type: string,
  display_x: number,
  display_y: number,
  bit_width?: number,
  inputs?: number[][],
  metadata: ComponentMetadata,
  onOutputChange?: (id: number, newValue: number[][]) => void
}