const axios = require('axios');

const clockify = axios.create({
  baseURL: process.env.CLOCKIFY_BASE_URL,
  headers: {
    'X-Api-Key': process.env.CLOCKIFY_API_KEY,
    'Content-Type': 'application/json'
  }
});

module.exports = clockify;
