import http from 'node:http'

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
})

server.listen(4000, () => {
    console.log('server running at http://localhost:4000')
})