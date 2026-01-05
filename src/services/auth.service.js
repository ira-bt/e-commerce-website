import axiosInstance from "../api/axiosInstance";

export async function loginApi(credentials)
{
    const response = await axiosInstance.post("auth/login",credentials)
    return response.data;
}