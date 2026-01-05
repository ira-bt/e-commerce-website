import axiosInstance from "../api/axiosInstance";

/**
 * Calls FakeStore login API
 * @param {{username: string, password: string}} credentials 
 * @returns {Promise<{ token : string }>}
 */

export async function loginApi(credentials)
{
    const response = await axiosInstance.post("auth/login",credentials)
    return response.data;
}