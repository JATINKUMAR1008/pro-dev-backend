const express = require("express")
const cors = require("cors")
require('dotenv').config()
const app = express()

app.use(cors())

app.get("/", (req, res) => {
    res.send("hello")
})
app.get('/getAccessToken', async function (req, res) {
    const params = "?client_id=" + process.env.CLIENT_KEY + "&client_secret=" + process.env.CLIENT_SECRET + "&code=" + req.query.code
    await fetch("https://github.com/login/oauth/access_token" + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        console.log(data)
        res.json(data)
    })
})

app.get("/getUserData", async function (req, res) {
    res.get('Authorization')
    await fetch("https://api.github.com/user", {
        method: "GET",
        headers: {
            "Authorization": req.get("Authorization")
        }
    }).then((response) => {
        return response.json()
    }).then((data) => {
        res.json(data)
    })
})
const paginationMiddleware = () => {
    return (req, res, next) => {
        const pageNumber = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 1
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        req.pagination = {
            page: pageNumber,
            limit: pageSize,
            startIndex,
            endIndex
        };

        next();
    };
};
app.get('/repo/data', paginationMiddleware(), async(req, res) => {
    const { startIndex, endIndex } = req.pagination;
    const {user} = req.query
    console.log(user)
    console.log(startIndex)
    await fetch(`https://api.github.com/users/${user}/repos`,{
        method:'GET',
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data.length)
        res.json({ data: data.slice(startIndex,endIndex), count: data.length });
    })
});

app.listen(4000, () => {
    console.log("server is running")
})

