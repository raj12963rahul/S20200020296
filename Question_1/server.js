const express = require('express');
const axios = require('axios');
const app = express();

app.get('/numbers', async (req, res) => {
    try {
        const answer = new Set();
        const urlArray = req.query.url;
        for (let i = 0; i < urlArray.length; i++) {
            const res = await axios.get(urlArray[i])
            const numArray = res.data.numbers;
            for (let j = 0; j < numArray.length; j++) {
                answer.add(numArray[j]);
            }
        }
        const arr = [...answer].sort((a, b) => a - b);
        res.status(200).send({
            "numbers": arr
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('internal server error')
    }
})



app.listen(8008, () => {
    console.log("server started")
})