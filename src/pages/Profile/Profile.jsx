import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { userService } from "../../services/user.service"
import axiosInstance from "../../api/axiosInstance" // Import axiosInstance directly for the API call
import { API_ENDPOINTS } from "../../utils/apiEndpoints"

export default function Profile() {
  const navigate = useNavigate()
  const { user: currentUser } = useContext(AuthContext)
  const [editingFields, setEditingFields] = useState({})
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })
  const [originalData, setOriginalData] = useState({
    username: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (currentUser) {
      const data = {
        username: currentUser.username || "",
        email: currentUser.email || "",
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [currentUser])

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  const startEditing = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: true,
    }))
  }

  const cancelEditing = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: false,
    }))
    setFormData((prev) => ({
      ...prev,
      [field]: originalData[field],
    }))
  }

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateFields = () => {
    if (!formData.username.trim()) {
      setErrorMessage("Username cannot be empty")
      return false
    }

    const existingUser = userService.findByUsername(formData.username.trim())
    if (existingUser && existingUser.id !== currentUser.id) {
      setErrorMessage("Username already taken")
      return false
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email cannot be empty")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address")
      return false
    }

    return true
  }

  const handleUpdate = async () => {
    if (!validateFields()) {
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      if (!currentUser || !currentUser.id || isNaN(currentUser.id)) {
        setErrorMessage("User ID not found. Please try logging in again.")
        setTimeout(() => setErrorMessage(""), 3000)
        setIsLoading(false)
        return
      }

      const updatePayload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      }

      await axiosInstance.put(API_ENDPOINTS.USERS.SINGLE(currentUser.id), updatePayload)

      setOriginalData({
        username: formData.username.trim(),
        email: formData.email.trim(),
      })
      setEditingFields({})
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Profile update error:", error)
      setErrorMessage("Failed to update profile. Please try again.")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!currentUser) {
    return <div className="profile__loading">Loading...</div>
  }

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__header">
          <h1 className="profile__title">My Profile</h1>
          <p className="profile__subtitle">View and manage your account information</p>
        </div>

        {/* Success Message */}
        {successMessage && <div className="snackbar snackbar--success">{successMessage}</div>}

        {/* Error Message */}
        {errorMessage && <div className="snackbar snackbar--error">{errorMessage}</div>}

        <div className="profile__fields">
          {/* Username Field */}
          <div className="profile__field">
            <div className="profile__field-label">Username</div>
            <div className="profile__field-content">
              {editingFields.username ? (
                <input
                  type="text"
                  className="profile__field-input"
                  value={formData.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              ) : (
                <span className="profile__field-value">{formData.username}</span>
              )}
              {editingFields.username ? (
                <button
                  className="profile__field-action-btn profile__field-action-btn--cancel"
                  onClick={() => cancelEditing("username")}
                  disabled={isLoading}
                  title="Cancel"
                >
                  ✕
                </button>
              ) : (
                <button
                  className="profile__field-action-btn"
                  onClick={() => startEditing("username")}
                  disabled={isLoading}
                  aria-label="Edit username"
                  title="Edit username"
                >
                  ✏️
                </button>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="profile__field">
            <div className="profile__field-label">Email</div>
            <div className="profile__field-content">
              {editingFields.email ? (
                <input
                  type="email"
                  className="profile__field-input"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              ) : (
                <span className="profile__field-value">{formData.email}</span>
              )}
              {editingFields.email ? (
                <button
                  className="profile__field-action-btn profile__field-action-btn--cancel"
                  onClick={() => cancelEditing("email")}
                  disabled={isLoading}
                  title="Cancel"
                >
                  ✕
                </button>
              ) : (
                <button
                  className="profile__field-action-btn"
                  onClick={() => startEditing("email")}
                  disabled={isLoading}
                  aria-label="Edit email"
                  title="Edit email"
                >
                  ✏️
                </button>
              )}
            </div>
          </div>

          {/* User ID - Read Only */}
          <div className="profile__field profile__field--readonly">
            <div className="profile__field-label">User ID</div>
            <div className="profile__field-content">
              <span className="profile__field-value">{currentUser.id}</span>
            </div>
          </div>

          {/* Role - Read Only */}
          <div className="profile__field profile__field--readonly">
            <div className="profile__field-label">Role</div>
            <div className="profile__field-content">
              <span className="profile__field-value profile__field-value--role">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile__footer">
          <button className="profile__btn profile__btn--secondary" onClick={() => navigate("/")} disabled={isLoading}>
            Go Back
          </button>
          <button
            className="profile__btn profile__btn--primary"
            onClick={handleUpdate}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  )
}
