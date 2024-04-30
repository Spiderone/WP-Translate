const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to enable CORS (Cross-Origin Resource Sharing)
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://coinaute.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    return await fn(req, res);
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to handle translation requests
app.post('/translate', allowCors(async (req, res) => {
    // Check if request body exists and contains required properties
    if (!req.body || !req.body.text || !req.body.target_lang) {
        console.error('Invalid request body:', req.body);
        return res.status(400).json({ error: 'Invalid request body' });
    }
    
    const { text, target_lang } = req.body;
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY; // Access the API key from environment variable
    const DEEPL_BASE_URL = 'https://api-free.deepl.com/v2/translate';
    try {
        const response = await axios.post(DEEPL_BASE_URL, {
            text,
            target_lang,
        }, {
            headers: {
                'Authorization': `DeepL-Auth-Key 07dd6ad1-4048-447b-9984-7d3cd86f9cf3:fx`,
                'Content-Type': 'application/json',
            }
        });

        // Forward DeepL API response to client with appropriate CORS headers
        res.setHeader('Access-Control-Allow-Origin', 'https://coinaute.com');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const translatedText = response.data.translations[0].text;
        res.json({ translatedText });
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).json({ error: 'Error translating text' });
    }
}));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
