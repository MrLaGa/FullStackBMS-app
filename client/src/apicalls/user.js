import { axiosInstance } from ".";

export const RegisterUser = async (payload)=>{
    try{
        const response = await axiosInstance.post('/register',payload)
        return response.data
    }catch(err){
        return err
    }
}

export const LoginUser = async (payload)=>{
    try{
     const response = await axiosInstance.post('/login', payload)
     return response.data
    }
    catch(err){
     return err;
    }
}