import type { ConnectionsProps } from "../model/Connections";

export function Connection(props: ConnectionsProps) {
  const offset = 30; // distance before turning

  const points = `
    ${props.from_x},${props.from_y}
    ${props.from_x + offset},${props.from_y}
    ${props.from_x + offset},${props.to_y}
    ${props.to_x},${props.to_y}
  `;

  return (
    <polyline
      points={points}
      fill="none"
      stroke={"red"}
      strokeWidth={1}
    />
  );
}