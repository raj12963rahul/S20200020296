const express = require('express');
const axios = require('axios');
const app = express();


function isValidURL(str) {
    const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' + 
        '((([a-z\\d]([a-z\\d-][a-z\\d]))\\.)+[a-z]{2,}|' + 
        '((\\d{1,3}\\.){3}\\d{1,3}))' + 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+])' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$', 
        'i'
    );
    return pattern.test(str);
}

app.get('/numbers', async (req, res) => {
    try {
        const answer = new Set();
        const urlArray = req.query.url;
        for (let i = 0; i < urlArray.length; i++) {
            console.log(urlArray[i])
            if (isValidURL(urlArray[i])) {
                const res = await axios.get(urlArray[i])
                const numArray = res.data.numbers;
                for (let j = 0; j < numArray.length; j++) {
                    answer.add(numArray[j]);
                }
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