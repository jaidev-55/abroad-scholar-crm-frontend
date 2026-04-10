import { useState, useMemo } from "react";
import { message } from "antd";
import { FiDownload, FiRefreshCw, FiUserPlus } from "react-icons/fi";
import { Spin } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUserRole,
  type User,
} from "../api/user";
import type { AddUserFormValues } from "../utils/constants";
import { exportUsersCSV } from "../utils/helpers";
import UserStatsRow from "../components/UserStatsRow";
import UsersTable from "../components/UsersTable";
import AddUserModal from "../components/AddUserModal";
import UsersFilterBar from "../components/Usersfilterbar";
import { DeleteUserModal, EditRoleModal } from "../components/UserModals";

const UsersPage = () => {
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [deleteUser_, setDeleteUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success(`${vars.name} added successfully!`);
      setAddUserOpen(false);
    },
    onError: (err: Error) => message.error(err.message || "Failed to add user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success(`${deleteUser_?.name} removed`);
      setDeleteUser(null);
    },
    onError: () => message.error("Delete failed"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateUserRole(id, { role }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success(`${editUser?.name}'s role updated to ${vars.role}`);
      setEditUser(null);
    },
    onError: () => message.error("Update failed"),
  });

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (searchText) {
      const q = searchText.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    if (roleFilter) list = list.filter((u) => u.role === roleFilter);
    return list;
  }, [users, searchText, roleFilter]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddUser = (data: AddUserFormValues) => addMutation.mutate(data);
  const handleDelete = () =>
    deleteUser_ && deleteMutation.mutate(deleteUser_.id);
  const handleUpdateRole = (role: string) =>
    editUser && roleMutation.mutate({ id: editUser.id, role });

  return (
    <div className="flex flex-col p-3 gap-5 w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1">
            Team Members
          </h1>
          <p className="text-[13px] text-slate-400">
            Manage staff accounts, roles & permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportUsersCSV(filteredUsers)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer transition-all shadow-sm"
            title="Export CSV"
          >
            <FiDownload size={15} />
          </button>
          <button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["users"] })
            }
            disabled={isLoading}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer transition-all shadow-sm disabled:opacity-50"
            title="Refresh"
          >
            {isLoading ? <Spin size="small" /> : <FiRefreshCw size={15} />}
          </button>
          <button
            onClick={() => setAddUserOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold border-none cursor-pointer transition-all shadow-sm"
          >
            <FiUserPlus size={14} /> Add User
          </button>
        </div>
      </div>

      <UserStatsRow users={users} />

      <UsersFilterBar
        searchText={searchText}
        roleFilter={roleFilter}
        totalCount={users.length}
        filteredCount={filteredUsers.length}
        onSearchChange={setSearchText}
        onRoleChange={setRoleFilter}
      />

      <UsersTable
        data={filteredUsers}
        loading={isLoading}
        onEdit={setEditUser}
        onDelete={setDeleteUser}
      />

      <AddUserModal
        open={addUserOpen}
        loading={addMutation.isPending}
        onClose={() => setAddUserOpen(false)}
        onSubmit={handleAddUser}
      />
      <DeleteUserModal
        user={deleteUser_}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteUser(null)}
      />
      <EditRoleModal
        user={editUser}
        loading={roleMutation.isPending}
        onConfirm={handleUpdateRole}
        onClose={() => setEditUser(null)}
      />
    </div>
  );
};

export default UsersPage;
