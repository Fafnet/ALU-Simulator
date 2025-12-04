DROP TABLE connections;
DROP TABLE components;
DROP TABLE circuits;

CREATE TABLE circuits(
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE components(
  id SERIAL PRIMARY KEY,
  circuit_id INT NOT NULL REFERENCES circuits (id),
  type VARCHAR(50) NOT NULL,
  display_x INT,
  display_y INT,
  bit_width INT,
  metadata JSONB
);

CREATE TABLE connections(
  id SERIAL PRIMARY KEY,
  from_component_id INT REFERENCES components (id),
  to_component_id INT REFERENCES components (id),
  from_output_pin INT,
  to_input_pin INT
);

---------------------------------------------------- 4-bit ALU circuit-------------------------------------------------
INSERT INTO circuits(name, description) -- 1
VALUES('4-bit ALU', '');

-- ORDER IS CRITITCAL FOR IDS IN CONNECTIONS!!!
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- OR (1)
VALUES(1, 'OR', 400, 360, NULL, '{"num_input_pins": 2, "num_output_pins": 1, "label": "OR", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- INPUT (2)
VALUES(1, 'INPUT', 0, 420, 4, '{"num_input_pins": 0, "num_output_pins": 1, "label": "A", "label_x": -13, "label_y": 13}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- INPUT (3)
VALUES(1, 'INPUT', 0, 540, 4, '{"num_input_pins": 0, "num_output_pins": 1, "label": "B", "label_x": -13, "label_y": 13}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- OUTPUT (4)
VALUES(1, 'OUTPUT', 700, 460, NULL, '{"num_input_pins": 1, "num_output_pins": 0, "label": "OUT", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- MUX (5)
VALUES(1, 'MUX', 560, 430, NULL, '{"num_input_pins": 4, "num_output_pins": 1, "label": "MUX", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- AND (6)
VALUES(1, 'AND', 400, 440, NULL, '{"num_input_pins": 2, "num_output_pins": 1, "label": "AND", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- OPCODE (7)
VALUES(1, 'INPUT', 580, 200, 2, '{"num_input_pins": 0, "num_output_pins": 1, "label": "OPCODE", "label_x": -5, "label_y": 35}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- ADDER (8)
VALUES(1, 'ADDER', 400, 540, NULL, '{"num_input_pins": 3, "num_output_pins": 3, "label": "ADDER", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- CARRY OUT (9)
VALUES(1, 'OUTPUT', 520, 560, 1, '{"num_input_pins": 1, "num_output_pins": 0, "label": "COUT", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- CARRY IN (10)
VALUES(1, 'INPUT', 340, 200, 1, '{"num_input_pins": 0, "num_output_pins": 1, "label": "CIN", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- OVERFLOW (11)
VALUES(1, 'OUTPUT', 520, 600, 1, '{"num_input_pins": 1, "num_output_pins": 0, "label": "OVERFLOW", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) -- BINVERT_INPUT (12)
VALUES(1, 'INPUT', 250, 200, 1, '{"num_input_pins": 0, "num_output_pins": 1, "label": "BINVERT", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) --  B_NOTGATE (13)
VALUES(1, 'NOT', 160, 510, NULL, '{"num_input_pins": 1, "num_output_pins": 1, "label": "NOTB", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) --  BMUX (14)
VALUES(1, 'MUX', 220, 500, NULL, '{"num_input_pins": 2, "num_output_pins": 1, "label": "BMUX", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) --  AMUX (15)
VALUES(1, 'MUX', 160, 380, NULL, '{"num_input_pins": 2, "num_output_pins": 1, "label": "AMUX", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) --  AINVERT_INPUT (16)
VALUES(1, 'INPUT', 190, 200, 1, '{"num_input_pins": 0, "num_output_pins": 1, "label": "AINVERT", "label_x": 0, "label_y": 0}'::jsonb);
INSERT INTO components(circuit_id, type, display_x, display_y, bit_width, metadata) --  A_NOTGATE (17)
VALUES(1, 'NOT', 100, 390, NULL, '{"num_input_pins": 1, "num_output_pins": 1, "label": "NOTA", "label_x": 0, "label_y": 0}'::jsonb);


--- FROM AMUX
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(15, 1, 0, 1); -- AMUX (15) - OR (1)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(15, 6, 0, 1); -- AMUX (15) - AND (6)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(15, 8, 0, 2); -- AMUX (15) - ADDER (8)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

--- FROM BMUX
VALUES(14, 1, 0, 0); -- BMUX (14) - OR (1)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(14, 6, 0, 0); -- BMUX (14) - AND (6)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(14, 8, 0, 1); -- BMUX (14) - ADDER (8)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

-- FROM OR
VALUES(1, 5, 0, 2); -- OR(1) - MUX (5)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

--FROM AND
VALUES(6, 5, 0, 1); -- AND(6) - MUX (5)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

-- FROM MUX
VALUES(5, 4, 0, 0); -- MUX (5) - OUTPUT (4)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

-- FROM OPCODE
VALUES(7, 5, 0, 4); -- OPCODE (7) - MUX (5)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)

-- FROM ADDER
VALUES(8, 5, 2, 0); -- ADDER (8) - MUX (5)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(8, 9, 1, 0); -- ADDER (8) - CARRY OUT (9)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(8, 11, 0, 0); -- ADDER (8) - OVERFLOW (11)

-- FROM CIN
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(10, 8, 0, 0); -- CARRY IN (10) - ADDER (8)

-- FROM B
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(3, 14, 0, 0); -- B (3) - BMUX (14)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(3, 13, 0, 0); -- B (3) - B_NOTGATE (13)

-- FROM B_NOTGATE
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(13, 14, 0, 1); -- B_NOTGATE (13) - BMUX (14)

-- FROM BINVERT_INPUT
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(12, 14, 0, 2); -- BINVERT_INPUT (13) - BMUX (14)

-- FROM A
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(2, 15, 0, 0); -- A (2) - AMUX (15)
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(2, 17, 0, 0); -- A (2) - A_NOTGATE (17)

-- FROM A_NOTGATE
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(17, 15, 0, 1); -- A_NOTGATE (17) - AMUX (15)

-- FROM AINVERT_INPUT
INSERT INTO connections(from_component_id, to_component_id, from_output_pin, to_input_pin)
VALUES(16, 15, 0, 2); -- AINVERT_INPUT (16) - AMUX (15)
-----------------------------------------------------------------------------------------------------------------------