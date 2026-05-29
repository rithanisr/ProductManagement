import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FilterBar from "./FilterBar";

const UserNavbar = ({
  search,
  onSearch,
  categories,
  category,
  onCategory,
  status,
  onStatus,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="card shadow-sm rounded-4 border-0 mb-4">
      <div className="card-body">
        <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 mb-3">
          <div>
            <div className="d-flex align-items-center gap-3 mb-2"></div>
          </div>
        </div>

        <FilterBar
          search={search}
          onSearch={onSearch}
          categories={categories}
          category={category}
          onCategory={onCategory}
          status={status}
          onStatus={onStatus}
        />
      </div>
    </div>
  );
};

export default UserNavbar;
