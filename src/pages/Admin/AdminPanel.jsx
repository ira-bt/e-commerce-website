import { useState } from "react"
import AdminProductsTable from "./AdminProductsTable"
import AdminUsersTable from "./AdminUsersTable"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h1 className="admin-panel__title">Admin Dashboard</h1>
        <p className="admin-panel__subtitle">Manage products and users</p>
      </div>

      <div className="admin-panel__tabs">
        <button
          className={`admin-panel__tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`admin-panel__tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>

      <div className="admin-panel__content">
        {activeTab === "products" && <AdminProductsTable />}
        {activeTab === "users" && <AdminUsersTable />}
      </div>
    </div>
  )
}
