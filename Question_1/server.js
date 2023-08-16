const express = require('express');
const axios = require('axios');
const app = express();

function isValidURL(str) {
    const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-][a-z\\d]))\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+])' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(str);
}

async function fetchUrl(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
}

async function fetchAllUrls(urls) {
    const promises = urls.map(fetchUrl);

    try {
        const result = await Promise.race([
            Promise.all(promises),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), 500))
        ]);
        return result;
    } catch (error) {
        throw new Error(`Request timed out: ${error.message}`);
    }
}


app.get('/numbers', async (req, res) => {
    try {
        const answer = new Set();
        const urlArray = req.query.url;
        for (let i = 0; i < urlArray.length; i++) {
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