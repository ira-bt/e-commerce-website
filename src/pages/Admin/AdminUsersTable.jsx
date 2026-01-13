"use client"

import { useState, useEffect, useContext } from "react"
import { userService } from "../../services/user.service"
import { AuthContext } from "../../context/AuthContext"

export default function AdminUsersTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const { user: currentUser } = useContext(AuthContext)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const loadedUsers = await userService.bootstrapUsers()
        setUsers(loadedUsers)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleDelete = async (id) => {
    if (currentUser && Number(currentUser.id) === Number(id)) {
      setError("You cannot delete your own account!")
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      setLoading(true)
      await userService.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setSuccess("User deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError("Failed to delete user. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-table">
      <div className="admin-table__header">
        <h2>Users Management</h2>
        <span className="admin-table__user-count">{users.length} users</span>
      </div>

      {error && <div className="snackbar snackbar--error">{error}</div>}
      {success && <div className="snackbar snackbar--success">{success}</div>}

      <div className="admin-table__container">
        {loading && users.length === 0 ? (
          <div className="admin-table__loading">Loading users...</div>
        ) : (
          <table className="admin-table__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th className="admin-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="admin-table__cell-title">{user.username}</td>
                    <td className="admin-table__cell-email">{user.email}</td>
                    <td>
                      <span className={`admin-table__badge admin-table__badge--${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="admin-table__actions-cell">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={loading || (currentUser && currentUser.id === user.id)}
                        className="admin-table__action-btn admin-table__action-btn--delete"
                        title={
                          currentUser && currentUser.id === user.id ? "Cannot delete your own account" : "Delete user"
                        }
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-table__empty">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
