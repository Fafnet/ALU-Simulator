const circuit_service = require('../service/circuitService');

async function getCircuit(req, res) {
  try {
    const circuit_id = parseInt(req.params.id, 10);

    if (isNaN(circuit_id) || circuit_id <= 0) {
      return res.status(400).json({ error: 'Invalid circuit ID provided.' });
    }

    const circuit_data = await circuit_service.getCircuitByID(circuit_id);

    if(!circuit_data) {
      return res.status(400).json({error: `Circuit with id ${circuit_id} was not found.`});
    }

    res.json(circuit_data);
  }
  catch (error){
    console.log("Error fetching circuit data: " + error );
    res.status(500).json({error: "Internal Server Error"});
  }
}

module.exports = {
  getCircuit,
};