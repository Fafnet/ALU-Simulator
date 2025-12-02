export type ConnectionsProps = {
  from_x: number, // source pin
  from_y: number,
  to_x: number, // destination pin
  to_y: number,
  signal?: boolean
}

export type ConnectionDBProps = {
  id: number,
  from_component_id: number,
  to_component_id: number,
  from_output_pin: number,
  to_input_pin: number
}