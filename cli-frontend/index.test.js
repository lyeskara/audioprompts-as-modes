const readlineSync = require('readline-sync');
const axios = require('axios');
const app = require('./index.js');  

jest.mock('readline-sync');
jest.mock('axios');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

test('test the communication between chatgpt and users', async () => {
    
  const mockResponse = {
    data: "gpt response in text"
  };
  
  // Set up the mock implementation for Axios
  axios.post.mockImplementation(() => Promise.resolve(mockResponse));
  
  // Call the Axios method in your test
  axios.post(`${process.env.api_url}/userprompt`).then((response) => {
    expect(response.data).toEqual(mockResponse.data);
  })

})