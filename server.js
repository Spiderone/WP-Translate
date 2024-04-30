const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const DEEPL_API_KEY = '0f1efd94-f201-45eb-937f-062d1cf120a7:fx';
const DEEPL_BASE_URL = 'https://api-free.deepl.com/v2/translate';

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', '*'); // Allow specified headers
    res.setHeader('Access-Control-Max-Age', '3600'); // Cache preflight requests for 1 hour
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        next();
    }
});

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to handle translation requests
app.post('/translate', async (req, res) => {
    // Check if request body exists and contains required properties
    if (!req.body || !req.body.text || !req.body.target_lang) {
        console.error('Invalid request body:', req.body);
        return res.status(400).json({ error: 'Invalid request body' });
    }
    
    const { text, target_lang } = req.body;
    try {
        const response = await axios.post(DEEPL_BASE_URL, {
            text,
            target_lang,
        }, {
            headers: {
                'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });
        const translatedText = response.data.translations[0].text;
        res.json({ translatedText });
    } catch (error) {
        console.error('Error translating text:', error);
        res.status(500).json({ error: 'Error translating text' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
