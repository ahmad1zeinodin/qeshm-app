import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from pure Node');
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Pure node server on ' + PORT));
