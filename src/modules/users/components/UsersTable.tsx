import React from "react";
import { Table, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { User } from "../api/user"; // ← from API, not constants
import { UserAvatar, RoleBadge } from "./UserAtoms";
import { formatJoinDate, formatJoinTime } from "../utils/helpers";

interface Props {
  data: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UsersTable: React.FC<Props> = ({ data, loading, onEdit, onDelete }) => {
  const columns: ColumnsType<User> = [
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Member
        </span>
      ),
      dataIndex: "name",
      key: "name",
      width: 280,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, rec: User) => (
        <div className="flex items-center gap-2.5 py-0.5">
          <UserAvatar name={name} size={34} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight m-0">
              {name}
            </p>
            <p className="text-[11px] text-slate-400 truncate m-0 mt-0.5">
              {rec.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Role
        </span>
      ),
      dataIndex: "role",
      key: "role",
      width: 130,
      align: "center",
      filters: [
        { text: "Admin", value: "ADMIN" },
        { text: "Counselor", value: "COUNSELOR" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => <RoleBadge role={role} />,
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Joined
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      align: "center",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
      render: (date: string) => (
        <div>
          <p className="text-[13px] font-semibold text-slate-700 m-0">
            {formatJoinDate(date)}
          </p>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">
            {formatJoinTime(date)}
          </p>
        </div>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Actions
        </span>
      ),
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record: User) => (
        <div className="flex justify-center">
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "edit",
                  label: (
                    <span className="flex items-center gap-2 text-[13px]">
                      <FiEdit2 size={13} /> Edit Role
                    </span>
                  ),
                  onClick: () => onEdit(record),
                },
                { type: "divider" },
                {
                  key: "delete",
                  label: (
                    <span className="flex items-center gap-2 text-[13px] text-red-500">
                      <FiTrash2 size={13} /> Remove User
                    </span>
                  ),
                  onClick: () => onDelete(record),
                },
              ],
            }}
          >
            <button className="w-8 h-8 rounded-xl flex items-center justify-center bg-transparent border border-transparent hover:bg-slate-100 hover:border-slate-200 cursor-pointer transition-all duration-150 outline-none">
              <FiMoreVertical size={15} className="text-slate-400" />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) => (
            <span className="text-xs text-slate-400">
              {range[0]}–{range[1]} of{" "}
              <strong className="text-slate-600">{total}</strong> users
            </span>
          ),
          style: { padding: "12px 20px", margin: 0 },
        }}
        rowClassName={() =>
          "hover:bg-slate-50/60 transition-colors duration-150"
        }
      />
    </div>
  );
};

export default UsersTable;
