import type { ConnectionsProps } from "../model/Connections";

export function Connection(props: ConnectionsProps) {
  let offset = props.offset;

  const points = `
    ${props.from_x},${props.from_y}
    ${props.from_x + offset!},${props.from_y}
    ${props.from_x + offset!},${props.to_y}
    ${props.to_x},${props.to_y}
  `;

  return (
    <polyline
      points={points}
      fill="none"
      stroke={props.signal ? "red" : "black"}
      strokeWidth={1}
    />
  );
}