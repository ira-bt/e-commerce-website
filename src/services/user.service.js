//Purpose: User CRUD (FakeStore API does NOT handle this)

import storageService from "./storage.service"
import axiosInstance from "../api/axiosInstance"
import { STORAGE_KEYS } from "../utils/enums"
import { createUserSchema } from "../utils/schema"
import { API_ENDPOINTS } from "../utils/apiEndpoints"

export const userService = {
  /**
   * Bootstrap users - Check localStorage first, then merge with API if needed
   * Merges localStorage registered users with API users, avoiding duplicates
   */
  async bootstrapUsers() {
    const existingUsers = storageService.get(STORAGE_KEYS.USERS) ?? []

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USERS.ALL)
      const apiUsers = response.data.map((user) => ({
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
        role: user.role || "user",
      }))

      // Merge: localStorage users + API users (no duplicates)
      const mergedUsers = [...existingUsers]
      const existingIds = new Set(existingUsers.map((u) => u.id))

      for (const apiUser of apiUsers) {
        if (!existingIds.has(apiUser.id)) {
          mergedUsers.push(apiUser)
        }
      }

      // Update localStorage with merged data
      storageService.set(STORAGE_KEYS.USERS, mergedUsers)
      return mergedUsers
    } catch (err) {
      console.log("API fetch failed, using localStorage only:", err.message)
      return existingUsers
    }
  },

  getAll() {
    return storageService.get(STORAGE_KEYS.USERS) ?? []
  },

  create(user) {
    const users = this.getAll()
    const baseUser = createUserSchema(user, users)
    const persistedUser = {
      ...baseUser,
      password: user.password, // demo-only
    }
    users.push(persistedUser)
    storageService.set(STORAGE_KEYS.USERS, users)
    return persistedUser
  },

  async createWithAPI(user) {
    try {
      const allUsers = await this.bootstrapUsers()
      const baseUser = createUserSchema(user, allUsers)
      const userPayload = {
        username: baseUser.username,
        email: baseUser.email,
        password: user.password,
        id: baseUser.id,
        role: baseUser.role,
        createdAt: baseUser.createdAt,
      }

      // Hit API first
      try {
        await axiosInstance.post(API_ENDPOINTS.USERS.ALL, userPayload)
        // API succeeded, use the complete userPayload for localStorage
        const users = this.getAll()
        users.push(userPayload)
        storageService.set(STORAGE_KEYS.USERS, users)
        return userPayload
      } catch (apiError) {
        // API failed, fallback to local creation with complete data
        console.log("API user creation failed, using local storage:", apiError.message)
        const users = this.getAll()
        users.push(userPayload)
        storageService.set(STORAGE_KEYS.USERS, users)
        return userPayload
      }
    } catch (err) {
      console.error("User creation error:", err)
      throw err
    }
  },

  findByUsername(username) {
    return this.getAll().find((u) => u.username === username)
  },

  getById(id) {
    return this.getAll().find((u) => u.id === id)
  },

  update(updatedUser) {
    const users = this.getAll()
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    storageService.set(STORAGE_KEYS.USERS, updatedUsers)
    return updatedUser
  },

  /**
   * Delete user - Hit API then sync localStorage
   */
  async delete(id) {
    try {
      try {
        await axiosInstance.delete(API_ENDPOINTS.USERS.SINGLE(id))
      } catch (apiError) {
        console.log("API delete failed:", apiError.message)
      }

      // Always sync to localStorage
      const users = this.getAll()
      const updatedUsers = users.filter((user) => user.id !== id)
      storageService.set(STORAGE_KEYS.USERS, updatedUsers)
    } catch (err) {
      console.error("Delete user error:", err)
      throw err
    }
  },
}
