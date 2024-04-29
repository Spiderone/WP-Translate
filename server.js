const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const DEEPL_API_KEY = '0f1efd94-f201-45eb-937f-062d1cf120a7:fx';
const DEEPL_BASE_URL = 'https://api-free.deepl.com/v2/translate';

// Define the allowCors middleware function
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
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

// Apply the allowCors middleware to all routes
app.use(allowCors);

// Endpoint to handle translation request
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
                Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`
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