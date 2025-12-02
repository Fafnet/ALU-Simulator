import type { CircuitProps } from "./Circuit"
import type { ComponentProps } from "./Component"
import type { ConnectionDBProps } from "./Connections"

export type FetchData = {
  circuit: CircuitProps,
  components: ComponentProps[],
  connections: ConnectionDBProps[]
}