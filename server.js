const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const DEEPL_API_KEY = '0f1efd94-f201-45eb-937f-062d1cf120a7:fx';
const DEEPL_BASE_URL = 'https://api-free.deepl.com/v2/translate';

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
            auth_key: DEEPL_API_KEY,
            text,
            target_lang,
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
