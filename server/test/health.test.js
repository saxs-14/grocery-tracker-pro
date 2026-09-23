const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../index');

test('GET /api/health returns a healthy API response', async () => {
    const server = http.createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const { port } = server.address();

    try {
        const response = await fetch(`http://127.0.0.1:${port}/api/health`);
        assert.equal(response.status, 200);
        const body = await response.json();
        assert.equal(body.status, 'ok');
        assert.equal(body.service, 'grocery-tracker-api');
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});
