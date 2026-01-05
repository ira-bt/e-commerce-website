import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

/**
 * Calls FakeStore login API
 * @param {{username: string, password: string}} credentials 
 * @returns {Promise<{ token : string }>}
 */

export async function loginApi(credentials)
{
    const response = await axiosInstance.post({API_ENDPOINTS.AUTH.LOGIN},credentials)
    return response.data;
}