export function Label({ x, y, text } : {x: number, y: number, text: string}) {
  return <text x={x} y={y} fontFamily="Verdana" fontSize={12}>{text}</text>
}