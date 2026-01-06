const API_URL = "https://fakestoreapi.com/users";

export const fakeStoreUserService = {
  async usernameExists(username) {
    const response = await fetch(API_URL);
    const users = await response.json();

    return users.some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  },
};
