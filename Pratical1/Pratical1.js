let login = 0
let logout = 0
let purchase = 0
let update = 0

class EventEmitter {
    constructor() {
        this.events = {}
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callback)
    }
    
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args))
        }
    }
}

const em = new EventEmitter()

em.on("login", (user) => {
    login++
    addLog(`${user} logged in`, 'login-event')
    updateStats()
})

em.on("logout", (user) => {
    logout++
    addLog(`${user} logged out`, 'logout-event')
    updateStats()
})

em.on("purchase", (user, item) => {
    purchase++
    addLog(`${user} bought ${item}`, 'purchase-event')
    updateStats()
})

em.on("update", (user, field) => {
    update++
    addLog(`${user} updated ${field}`, 'update-event')
    updateStats()
})

em.on("summary", () => {
    addLog(`Summary - Logins: ${login}, Logouts: ${logout}, Purchases: ${purchase}, Updates: ${update}`, 'summary-event')
})

function addLog(message, className) {
    const logList = document.getElementById('logList')
    const li = document.createElement('li')
    li.textContent = message
    li.className = className
    logList.appendChild(li)
    logList.scrollTop = logList.scrollHeight
}

function updateStats() {
    document.getElementById('loginCount').textContent = login
    document.getElementById('logoutCount').textContent = logout
    document.getElementById('purchaseCount').textContent = purchase
    document.getElementById('updateCount').textContent = update
}

document.getElementById('loginBtn').onclick = () => {
    const user = document.getElementById('username').value
    if (user) em.emit('login', user)
}

document.getElementById('logoutBtn').onclick = () => {
    const user = document.getElementById('username').value
    if (user) em.emit('logout', user)
}

document.getElementById('purchaseBtn').onclick = () => {
    const user = document.getElementById('username').value
    const product = document.getElementById('productSelect').value
    if (user) em.emit('purchase', user, product)
}

document.getElementById('updateBtn').onclick = () => {
    const user = document.getElementById('username').value
    const email = document.getElementById('emailInput').value
    if (user && email) {
        em.emit('update', user, `Email to ${email}`)
        document.getElementById('emailInput').value = ''
    }
}

document.getElementById('summaryBtn').onclick = () => {
    em.emit('summary')
}
