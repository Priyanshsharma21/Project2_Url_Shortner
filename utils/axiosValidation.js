const axios = require('axios');

const checkValidURL = async (url) => {
  try {
    if (!url) {
      return {
        isValid: false,
        statusCode: 400,
        message: 'Missing URL',
      };
    }

    const response = await axios.get(url);
    console.log(response)
    if (response.status === 200) {
      return {
        isValid: true,
        statusCode: 200,
        message: 'Valid URL',
      };
    } else {
      return {
        isValid: false,
        statusCode: response.status,
        message: 'Invalid URL',
      };
    }
  } catch (error) {
    return {
      isValid: false,
      statusCode: 500,
      message: 'Internal Server Error',
    };
  }
};

module.exports.checkValidURL = checkValidURL;
