import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Dropdown,
  message,
  Tooltip,
  Avatar,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FiSearch,
  FiUsers,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiUserPlus,
  FiShield,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiX,
  FiMail,
  FiLock,
  FiUser,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

import CustomModal from "../../components/common/CustomModal";
import CustomInput from "../../components/common/CustomInput";
import CustomSelect from "../../components/common/CustomSelect";

// Update this to match your project's API base URL
const API_BASE = "http://localhost:3000";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "COUNSELOR" | string;
  createdAt: string;
}

interface AddUserFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

// ─── Dummy Data ───
const DUMMY_USERS: User[] = [
  {
    id: "ca614a2f-d6ed-4bef-834f-0d218ee08758",
    name: "Ganesh Kumar",
    email: "ganesh@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-03-06T06:39:10.749Z",
  },
  {
    id: "50d51d86-e099-4000-89d0-13aca3ed44f5",
    name: "Jai Prakash",
    email: "jai@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2026-03-05T09:10:04.438Z",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Priya Sharma",
    email: "priya@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-02-20T14:22:33.112Z",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Arjun Mehta",
    email: "arjun@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2026-02-15T08:45:19.887Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Sneha Reddy",
    email: "sneha@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-01-28T11:33:45.221Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    name: "Ravi Shankar",
    email: "ravi@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-01-10T16:18:07.554Z",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    name: "Ananya Iyer",
    email: "ananya@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2025-12-22T09:55:30.998Z",
  },
  {
    id: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    name: "Vikram Singh",
    email: "vikram@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2025-12-01T07:12:44.667Z",
  },
];

// ─── Role config ───
const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  ADMIN: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  COUNSELOR: { color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
};

const getRoleStyle = (role: string) =>
  ROLE_CONFIG[role] || { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" };

// ─── Avatar color from name ───
const getAvatarColor = (name: string) => {
  const colors = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#0ea5e9",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(DUMMY_USERS);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [editRole, setEditRole] = useState<string>("");
  const [actionLoading, setActionLoading] = useState(false);

  // Add User modal
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);

  const {
    handleSubmit: handleAddUserSubmit,
    control: addUserControl,
    reset: resetAddUserForm,
    formState: { errors: addUserErrors },
  } = useForm<AddUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // ─── Fetch users ───
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data: User[] = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch {
      // Fallback to dummy data if API fails
      console.warn("API unavailable, using dummy data");
      setUsers(DUMMY_USERS);
      setFilteredUsers(DUMMY_USERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─── Search & filter ───
  useEffect(() => {
    let result = [...users];

    if (searchText) {
      const query = searchText.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query),
      );
    }

    if (roleFilter) {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchText, roleFilter, users]);

  // ─── Add user ───
  const onAddUser = async (data: AddUserFormValues) => {
    setAddUserLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create user");
      }

      message.success(`${data.name} has been added successfully!`);
      setAddUserOpen(false);
      resetAddUserForm();
      fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add user";
      message.error(errorMessage);
    } finally {
      setAddUserLoading(false);
    }
  };

  // ─── Delete user ───
  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/users/${deleteModal.user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      message.success(`${deleteModal.user.name} has been removed`);
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      message.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Update user role ───
  const handleUpdateRole = async () => {
    if (!editModal.user) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/auth/user/${editModal.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: editRole }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      message.success(`${editModal.user.name}'s role updated to ${editRole}`);
      setEditModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      message.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // ─── Export CSV ───
  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Joined"],
      ...filteredUsers.map((u) => [
        u.name,
        u.email,
        u.role,
        new Date(u.createdAt).toLocaleDateString("en-IN"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    message.success("Exported successfully!");
  };

  // ─── Stats ───
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <FiUsers size={18} />,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: <FiShield size={18} />,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
    },
    {
      label: "Counselors",
      value: users.filter((u) => u.role === "COUNSELOR").length,
      icon: <FiUserPlus size={18} />,
      color: "#0369a1",
      bg: "#f0f9ff",
      border: "#bae6fd",
    },
    {
      label: "This Month",
      value: users.filter((u) => {
        const d = new Date(u.createdAt);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: <FiRefreshCw size={18} />,
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
  ];

  // ─── Table columns ───
  const columns: ColumnsType<User> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={36}
            style={{
              backgroundColor: getAvatarColor(name),
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {getInitials(name)}
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-[#1a2540] m-0 leading-tight">
              {name}
            </p>
            <p className="text-xs text-[#8a95b0] m-0 mt-0.5">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 200,
      align: "center",
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "Counselor", value: "COUNSELOR" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => {
        const style = getRoleStyle(role);
        return (
          <Tag
            style={{
              color: style.color,
              backgroundColor: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 12,
              padding: "2px 10px",
            }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      align: "center",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (date: string) => {
        const d = new Date(date);
        return (
          <div>
            <p className="text-sm text-[#1a2540] m-0 font-medium">
              {d.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-[11px] text-[#8a95b0] m-0 mt-0.5">
              {d.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,

      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "edit",
                label: (
                  <span className="flex items-center gap-2 text-sm">
                    <FiEdit2 size={13} />
                    Edit Role
                  </span>
                ),
                onClick: () => {
                  setEditRole(record.role);
                  setEditModal({ open: true, user: record });
                },
              },
              { type: "divider" },
              {
                key: "delete",
                label: (
                  <span className="flex items-center gap-2 text-sm text-red-500">
                    <FiTrash2 size={13} />
                    Remove User
                  </span>
                ),
                onClick: () => setDeleteModal({ open: true, user: record }),
              },
            ],
          }}
        >
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all duration-200">
            <FiMoreVertical size={15} className="text-[#8a95b0]" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto px-6 py-8">
        {/* ═══ Header ═══ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a2540] m-0 leading-tight">
              Team Members
            </h1>
            <p className="text-sm text-[#8a95b0] mt-1 m-0">
              Manage staff accounts, roles & permissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip title="Export CSV">
              <Button
                icon={<FiDownload size={15} />}
                onClick={handleExport}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Tooltip title="Refresh">
              <Button
                icon={<FiRefreshCw size={15} />}
                onClick={fetchUsers}
                loading={loading}
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<FiUserPlus size={15} />}
              onClick={() => {
                resetAddUserForm();
                setAddUserOpen(true);
              }}
              className="flex items-center gap-2"
            >
              Add User
            </Button>
          </div>
        </div>

        {/* ═══ Stats Cards ═══ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon, color, bg, border }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-4 border transition-all duration-200 hover:shadow-md"
              style={{ borderColor: border }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: bg, color }}
                >
                  {icon}
                </div>
              </div>
              <p className="text-2xl font-extrabold m-0" style={{ color }}>
                {value}
              </p>
              <p className="text-xs font-medium text-[#8a95b0] m-0 mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ═══ Table Card ═══ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search by name or email..."
                prefix={<FiSearch size={14} className="text-[#b4bcd4]" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 280 }}
                className="rounded-lg"
              />
              <Select
                placeholder={
                  <span className="flex items-center gap-1.5">
                    <FiFilter size={13} />
                    Role
                  </span>
                }
                allowClear
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                style={{ width: 150 }}
                options={[
                  { label: "Admin", value: "ADMIN" },
                  { label: "Counselor", value: "COUNSELOR" },
                ]}
              />
            </div>

            <p className="text-xs text-[#8a95b0] m-0">
              Showing{" "}
              <span className="font-semibold text-[#1a2540]">
                {filteredUsers.length}
              </span>{" "}
              of {users.length} users
            </p>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
              style: { padding: "12px 20px", margin: 0 },
            }}
            style={{ borderRadius: 0 }}
            rowClassName={() =>
              "hover:bg-blue-50/30 transition-colors duration-150"
            }
          />
        </div>
      </div>

      {/*  Add User Modal  */}
      <CustomModal
        open={addUserOpen}
        onClose={() => {
          setAddUserOpen(false);
          resetAddUserForm();
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FiUserPlus size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                Add New Team Member
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                Create a new staff account
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAddUserOpen(false);
              resetAddUserForm();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleAddUserSubmit(onAddUser)}
          className="px-6 py-5 space-y-4"
        >
          {/* Info banner */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
            <FiShield size={14} className="text-blue-500 shrink-0" />
            <span className="text-xs font-semibold text-blue-800">
              An OTP verification email will be sent to the new member
            </span>
          </div>

          <CustomInput
            name="name"
            label="Full Name"
            placeholder="e.g. Priya Sharma"
            control={addUserControl}
            size="large"
            type="text"
            icon={<FiUser size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
          />

          <CustomInput
            name="email"
            label="Staff Email"
            placeholder="newmember@abroadscolar.com"
            control={addUserControl}
            size="large"
            type="email"
            icon={<FiMail size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            }}
          />

          <CustomInput
            name="password"
            label="Temporary Password"
            placeholder="Create a temporary password"
            control={addUserControl}
            size="large"
            type="password"
            icon={<FiLock size={14} className="text-[#b4bcd4]" />}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            }}
          />

          <CustomSelect
            name="role"
            label="Assign Role"
            placeholder="Select a role"
            control={
              addUserControl as unknown as import("react-hook-form").Control<FieldValues>
            }
            errors={
              addUserErrors as unknown as import("react-hook-form").FieldErrors<FieldValues>
            }
            required
            rules={{ required: "Role is required" }}
            options={[
              {
                value: "ADMIN",
                label: (
                  <span className="flex items-center gap-2">
                    <FiShield size={13} className="text-purple-500" />
                    Admin
                  </span>
                ),
              },
              {
                value: "COUNSELOR",
                label: (
                  <span className="flex items-center gap-2">
                    <FiUsers size={13} className="text-sky-500" />
                    Counselor
                  </span>
                ),
              },
            ]}
          />

          {/* Modal Footer */}
          <div className="flex gap-3 pt-3">
            <Button
              block
              size="large"
              onClick={() => {
                setAddUserOpen(false);
                resetAddUserForm();
              }}
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              loading={addUserLoading}
            >
              {!addUserLoading && (
                <span className="flex items-center justify-center gap-2">
                  <FiUserPlus size={15} />
                  Add Member
                </span>
              )}
            </Button>
          </div>
        </form>
      </CustomModal>

      {/* Delete Confirmation Modal  */}
      <CustomModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
      >
        <div className="px-6 py-5">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={22} className="text-red-500" />
            </div>

            <h3 className="text-lg font-bold text-[#1a2540] m-0 mb-2">
              Remove {deleteModal.user?.name}?
            </h3>

            <p className="text-sm text-[#8a95b0] mb-6">
              This will permanently remove their account and revoke all access.
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                block
                size="large"
                onClick={() => setDeleteModal({ open: false, user: null })}
              >
                Cancel
              </Button>
              <Button
                block
                size="large"
                danger
                type="primary"
                loading={actionLoading}
                onClick={handleDelete}
              >
                Remove User
              </Button>
            </div>
          </div>
        </div>
      </CustomModal>

      {/*Edit Role Modal  */}
      <CustomModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FiEdit2 size={18} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1a2540] m-0">
                Edit Role
              </h3>
              <p className="text-xs text-[#8a95b0] m-0 mt-0.5">
                {editModal.user?.name} — {editModal.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditModal({ open: false, user: null })}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border border-transparent hover:bg-gray-100 hover:border-gray-200 cursor-pointer transition-all duration-200"
          >
            <FiX size={16} className="text-[#8a95b0]" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Assign Role
            </label>
            <Select
              value={editRole}
              onChange={(val) => setEditRole(val)}
              style={{ width: "100%" }}
              size="large"
              options={[
                { label: "Admin", value: "ADMIN" },
                { label: "Counselor", value: "COUNSELOR" },
              ]}
            />
          </div>

          <div className="flex gap-3">
            <Button
              block
              size="large"
              onClick={() => setEditModal({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              block
              size="large"
              type="primary"
              loading={actionLoading}
              onClick={handleUpdateRole}
              disabled={editRole === editModal.user?.role}
            >
              Update Role
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UsersPage;
