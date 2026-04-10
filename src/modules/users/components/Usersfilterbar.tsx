import React from "react";
import { Input, Select } from "antd";
import { FiSearch, FiFilter } from "react-icons/fi";

interface Props {
  searchText: string;
  roleFilter: string | null;
  totalCount: number;
  filteredCount: number;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: string | null) => void;
}

const UsersFilterBar: React.FC<Props> = ({
  searchText,
  roleFilter,
  totalCount,
  filteredCount,
  onSearchChange,
  onRoleChange,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-5 flex-wrap">
      <Input
        prefix={<FiSearch size={13} className="text-slate-400" />}
        placeholder="Search by name or email…"
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        allowClear
        style={{ width: 380, borderRadius: 6, fontSize: 13 }}
      />
      <Select
        placeholder={
          <span className="flex items-center gap-1.5">
            <FiFilter size={12} /> Role
          </span>
        }
        allowClear
        value={roleFilter}
        onChange={onRoleChange}
        style={{ width: 140 }}
        options={[
          { label: "Admin", value: "ADMIN" },
          { label: "Counselor", value: "COUNSELOR" },
        ]}
      />
    </div>
    <span className="text-xs text-slate-400">
      Showing{" "}
      <span className="font-semibold text-slate-700">{filteredCount}</span> of{" "}
      {totalCount} users
    </span>
  </div>
);

export default UsersFilterBar;
