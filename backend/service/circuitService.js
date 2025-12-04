const db = require("../db");

const SQL = {
  getCircuit: 'SELECT id, name, description FROM circuits WHERE id = $1;',
  getComponents: 'SELECT id, circuit_id, type, display_x, display_y, bit_width, metadata FROM components WHERE circuit_id = $1',
  getConnections: 'SELECT C.id AS id, FC.type AS from_component_type, TC.type AS to_component_type, C.from_component_id, C.to_component_id, C.from_output_pin, C.to_input_pin FROM Connections AS C JOIN Components AS FC ON C.from_component_id = FC.id JOIN Components AS TC ON C.to_component_id = TC.id WHERE FC.circuit_id = $1 AND TC.circuit_id = $1;'
};

async function getCircuitByID(circuit_id) {
  const raw_result = db.task(async t => {
    // 1. Fetch circuit metadata
    const circuit = await t.oneOrNone(SQL.getCircuit, [circuit_id]);
    
    if (!circuit) {
        return null;
    }

    // 2. Fetch components and connections concurrently
    const [components, connections] = await t.batch([
        t.manyOrNone(SQL.getComponents, [circuit_id]),
        t.manyOrNone(SQL.getConnections, [circuit_id])
    ]);

    return {
        circuit,
        components,
        connections
    };
  })

  return raw_result;
}

module.exports = {
  getCircuitByID,
};