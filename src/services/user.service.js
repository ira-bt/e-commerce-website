//Purpose: User CRUD (FakeStore API does NOT handle this)

// src/services/user.service.js
import  storageService  from './storage.service';
import { STORAGE_KEYS } from '../utils/enums';
import { createUserSchema } from '../utils/schema';

export const userService = {
  getAll() {
    return storageService.get(STORAGE_KEYS.USERS) ?? [];
  },

  create(user) {
    const users = this.getAll();
    const baseUser = createUserSchema(user);
    //demo auth
    const persistedUser = {
      ...baseUser,
      password: user.password, // demo-only
    };
    users.push(persistedUser);
    storageService.set(STORAGE_KEYS.USERS, users);
    return persistedUser;
  },

  findByUsername(username) {
    return this.getAll().find(
      (u) => u.username === username
    );
  },
};
