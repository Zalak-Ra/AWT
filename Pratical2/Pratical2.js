const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const FILE = "todos.json";

const app = express();
app.use(express.json());
app.use(session({
    secret: 'todo-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function readfile() {
    return new Promise((resolve, reject) => {
        fs.readFile(FILE, "utf-8", (err, data) => {
            if (err) {
                resolve({ users: {} });
                return;
            } else {
                try {
                    resolve(data.trim() ? JSON.parse(data) : { users: {} });
                } catch (parseErr) {
                    resolve({ users: {} });
                }
            }
        });
    });
}

function writefile(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(FILE, JSON.stringify(data, null, 2), (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function checkAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

async function listtodos(req, res) {
    let data = await readfile();
    let list = data.users[req.session.user] || [];
    res.json(list);
}

async function addtodo(req, res) {
    let val = req.body.todo;
    let data = await readfile();
    if (!data.users[req.session.user]) data.users[req.session.user] = [];
    let demostr = {
        todo: val,
        status: "❌"
    };
    data.users[req.session.user].push(demostr);
    await writefile(data);
    console.log("ADDED!!");
    res.json({ message: "todo added successfully" });
}

async function deltodo(req, res) {
    let val = req.body.todo;
    let data = await readfile();
    let list = data.users[req.session.user] || [];
    let index = list.findIndex((item) => item.todo === val);
    if (index !== -1) list.splice(index, 1);
    data.users[req.session.user] = list;
    await writefile(data);
    console.log(index !== -1 ? "DELETED!!" : "not found todo u entered!!");
    res.json({ message: index !== -1 ? "todo deleted successfully" : "todo not found" });
}
 
async function marktodo(req, res) {
    let val = req.body.todo;
    let data = await readfile();
    let list = data.users[req.session.user] || [];
    let index = list.findIndex((item) => item.todo === val);
    if (index === -1) {
        console.log("not found todo u entered!!");
        res.json({ message: "todo not found" });
        return;
    }
    list[index].status = "✔️";
    data.users[req.session.user] = list;
    await writefile(data);
    console.log("Marked!!");
    res.json({ message: "todo marked successfully" });
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        let data = await readfile();
        if (!data.users[username]) data.users[username] = [];
        await writefile(data);
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Please enter username and password' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'login.html'));
    }
});

app.get('/index.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

app.get('/script.js', checkAuth, (req, res) => {
    res.type('application/javascript');
    res.send(`
        async function loadTodos() {
            const res = await fetch('/listtodos');
            const todos = await res.json();
            const list = document.getElementById('todoList');
            list.innerHTML = '';
            todos.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = \`\${item.status} \${item.todo} 
                    <button onclick="markTodo('\${item.todo}')">Mark</button>
                    <button onclick="deleteTodo('\${item.todo}')">Delete</button>\`;
                list.appendChild(li);
            });
        }

        async function addTodo() {
            const input = document.getElementById('todoInput');
            const todo = input.value.trim();
            if (!todo) return;
            await fetch('/addtodo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo })
            });
            input.value = '';
            loadTodos();
        }

        function logout() {
            window.location.href = '/logout';
        }

        async function deleteTodo(todo) {
            await fetch('/deltodo', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo })
            });
            loadTodos();
        }

        async function markTodo(todo) {
            await fetch('/marktodo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo })
            });
            loadTodos();
        }

        loadTodos();
    `);
});

app.post('/addtodo', checkAuth, addtodo);
app.delete('/deltodo', checkAuth, deltodo);
app.get('/listtodos', checkAuth, listtodos);
app.put('/marktodo', checkAuth, marktodo);

app.listen(3000, () => {
    console.log("Server started at port 3000");
});
