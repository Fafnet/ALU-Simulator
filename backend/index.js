const express = require('express'); // Express module
const cors = require('cors');
const Router = require('./route/circuitRoute'); // routing

// App
const app = express();
const port = 8080;

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(Router);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})