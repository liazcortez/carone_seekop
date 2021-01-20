import axios from 'axios';

let baseURL;

if (process.env.NODE_ENV === 'production') {
  console.log('we are in prod');
  baseURL = 'https://apidealerprox2020.herokuapp.com/api/v1';
} else {
  console.log('we are in dev');
  baseURL = 'http://localhost:5001/api/v1';
}

export default axios.create({
  baseURL: baseURL
});

//