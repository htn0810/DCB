import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_BE_URL,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
});
