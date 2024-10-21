import { FormData } from '../Components/UserRegisterForm';
import axios from 'axios'; 

const apiClient = axios.create({
    baseURL: "http://localhost:3000"
  });

// Create User

export const CreateUser = async (data: FormData) => {

const formDataPacket = {
    ...data,
    confirmPassword: undefined,
  };

  console.log(formDataPacket);

  apiClient.post("/users",formDataPacket)
  .then(response => {
    console.log('Data submitted successfully', response.data);
})
.catch(error => {
    console.error('Error submitting data', error);
});

}