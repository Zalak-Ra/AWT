const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Create an EventEmitter instance
const eventEmitter = new EventEmitter();

// Object to track event counts
const eventCounts = {
    'user-login': 0,
    'user-logout': 0,
    'user-purchase': 0,
    'profile-update': 0
};

// Event listeners
eventEmitter.on('user-login', (username) => {
    eventCounts['user-login']++;
    console.log(`User ${username} logged in.`);
});

eventEmitter.on('user-logout', (username) => {
    eventCounts['user-logout']++;
    console.log(`User ${username} logged out.`);
});

eventEmitter.on('user-purchase', (username, item) => {
    eventCounts['user-purchase']++;
    console.log(`User ${username} purchased ${item}.`);
});

eventEmitter.on('profile-update', (username, field) => {
    eventCounts['profile-update']++;
    console.log(`User ${username} updated ${field}.`);
});

// Create HTTP server
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/') {
        // Serve the main page with forms and summary
        res.writeHead(200, {'Content-Type': 'text/html'});
        let html = `
        <html>
        <head><title>Event Tracker</title></head>
        <body>
        <h1>Event Tracker</h1>
        <form action="/login" method="GET">
            Username: <input name="username" required><button type="submit">Login</button>
        </form>
        <form action="/logout" method="GET">
            
            Username: <input name="username" required><button type="submit">Logout</button>
        </form>
        <form action="/purchase" method="GET">
            Username: <input name="username" required> Item: <input name="item" required><button type="submit">Purchase</button>
        </form>
        <form action="/update" method="GET">
            Username: <input name="username" required> Field: <input name="field" required><button type="submit">Update Profile</button>
        </form>
        <h2>Summary</h2>
        <ul>
        `;
        for (const [event, count] of Object.entries(eventCounts)) {
            html += `<li>${event}: ${count} times</li>`;
        }
        html += `
        </ul>
        </body>
        </html>
        `;
        res.end(html);
    } else if (url.pathname === '/login') {
        const username = url.searchParams.get('username');
        if (username) eventEmitter.emit('user-login', username);
        res.writeHead(302, {Location: '/'});
        res.end();
    } else if (url.pathname === '/logout') {
        const username = url.searchParams.get('username');
        if (username) eventEmitter.emit('user-logout', username);
        res.writeHead(302, {Location: '/'});
        res.end();
    } else if (url.pathname === '/purchase') {
        const username = url.searchParams.get('username');
        const item = url.searchParams.get('item');
        if (username && item) eventEmitter.emit('user-purchase', username, item);
        res.writeHead(302, {Location: '/'});
        res.end();
    } else if (url.pathname === '/update') {
        const username = url.searchParams.get('username');
        const field = url.searchParams.get('field');
        if (username && field) eventEmitter.emit('profile-update', username, field);
        res.writeHead(302, {Location: '/'});
        res.end();
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Start the server
server.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});