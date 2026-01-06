import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../utils/apiEndpoints";

export const fakeStoreUserService = {
    async usernameExists(username) {
    const { data: users } = await axiosInstance.get(API_ENDPOINTS.USERS.ALL);

    return users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  },
};
