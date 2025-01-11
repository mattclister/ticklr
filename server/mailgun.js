const axios = require('axios');
const jwt = require("jsonwebtoken");

// This is currently not being used

// Check an email is valid with mailgun

async function validateEmailMailgun(email) {
  try {
    const response = await axios.get('https://api.mailgun.net/v4/address/validate', {
      auth: {
        username: 'api',
        password: process.env.MAILGUN_API_KEY,
      },
      params: { address: email },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Validation Error:', error.response?.data || error.message);
  }
} 
