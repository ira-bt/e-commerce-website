//Purpose: User CRUD (FakeStore API does NOT handle this)

// src/services/user.service.js
import { storageService } from './storage.service';
import { STORAGE_KEYS } from '@/utils/enums';
import { createUserSchema } from '@/utils/schemas';

export const userService = {
  getAll() {
    return storageService.get(STORAGE_KEYS.USERS) ?? [];
  },

  create(user) {
    const users = this.getAll();
    const newUser = createUserSchema(user);
    users.push(newUser);
    storageService.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  findByEmail(email) {
    return this.getAll().find((u) => u.email === email);
  },
};
