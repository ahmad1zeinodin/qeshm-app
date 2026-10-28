import express from 'express';
const app = express();
app.get('/', (req, res) => {
  res.send('Hello from test');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Test server running on port ' + PORT));
