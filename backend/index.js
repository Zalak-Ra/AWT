const express = require("express");
const app = express();

app.use(express.json());

let users = []; 

app.post("/signup", (req, res) => {
  const { username, password, con_password} = req.body;

  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
    return res.status(400).json({ message: "Weak password" });
  }
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if(password != con_password){
    return res.status(400).json({message : "please enter password and confirm password same"})
  }

  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.json({ message: "Signup successful" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

app.post("/logout", (req, res) => {
  const token = req.headers["authorization"]; 

  if (activeTokens[token]) {
    delete activeTokens[token]; 
    return res.json({ message: "Logout successful" });
  }

  res.status(400).json({ message: "Invalid token or already logged out" });
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});