import React, { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

const TABS = [
  { key: "borrowed", label: "Borrowed List" },
  { key: "user", label: "User" },
  { key: "book", label: "Book List" },
];

const API_URL = "https://library-backend-production-b9cf.up.railway.app/api/admin/users";

function getPaginationNumbers(current: number, total: number) {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 2) {
    return [1, 2, 3];
  }
  if (current >= total - 1) {
    return [total - 2, total - 1, total];
  }
  return [current - 1, current, current + 1];
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });
        if (search) params.append("q", search);

        const res = await fetch(`${API_URL}?${params.toString()}`, {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: ApiResponse = await res.json();
        if (data.success) {
          setUsers(data.data.users);
          setTotalPages(data.data.pagination.totalPages);
          setTotalEntries(data.data.pagination.total);
        }
      } catch (err) {
        setUsers([]);
        setTotalPages(1);
        setTotalEntries(0);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [page, search, token]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const paginationNumbers = getPaginationNumbers(page, totalPages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      <div className="flex flex-col flex-1 pt-[80px]">
        <div className="w-full flex flex-col items-stretch px-4 md:px-[120px]">
          {/* Tabs */}
          <div className="py-4 flex">
            <div className="flex p-2 bg-neutral-100 rounded-2xl gap-2 md:gap-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-gray-100 text-black shadow"
                      : "bg-white text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 mb-[105px] md:mb-[88px]">
            {/* Title */}
            <div className="font-bold text-xl md:text-2xl mb-4">User</div>
            {/* Search */}
            <div className="mb-6 flex justify-center md:justify-start">
              <div className="relative w-full md:max-w-[600px]">
                <input
                  type="text"
                  placeholder="Search user"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-full border border-neutral-300 px-4 py-2 text-md focus:outline-none"
                  style={{ maxWidth: "600px" }}
                />
                <span className="absolute right-4 top-2 text-gray-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="9" r="7" />
                    <line x1="15" y1="15" x2="19" y2="19" />
                  </svg>
                </span>
              </div>
            </div>

            {/* User List */}
            <div>
              {/* Mobile */}
              <div className="md:hidden flex flex-col gap-4">
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No users found.</div>
                ) : (
                  users.map((user, idx) => (
                    <div key={user.id} className="bg-white rounded-xl shadow-sm p-3 flex flex-col gap-2 w-full mx-auto">
                      {[
                        { label: "No", value: (page - 1) * 10 + idx + 1 },
                        { label: "Name", value: user.name },
                        { label: "Email", value: user.email },
                        { label: "Nomor Handphone", value: user.phone || "-" },
                        { label: "Created at", value: formatDate(user.createdAt) }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between text-sm font-semibold">
                          <span>{item.label}</span>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
                {/* Pagination mobile */}
                <div className="flex justify-center mt-0">
                  <nav className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-text-md font-medium text-neutral-950 flex items-center"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      <img src="/icons/chevron-left.svg" alt="Previous" className="w-6 h-6 mr-1" />
                      Previous
                    </button>
                    {page > 2 && totalPages > 3 && (
                      <span className="px-2 py-1">...</span>
                    )}
                    {paginationNumbers.map(p =>
                      page === p ? (
                        <button
                          key={p}
                          className="px-3 py-1 rounded-lg border bg-neutral-200 border-neutral-300 font-semibold"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ) : (
                        <button
                          key={p}
                          className="px-3 py-1 rounded-lg bg-transparent border-0 text-neutral-950 font-medium"
                          onClick={() => setPage(p)}
                          style={{ boxShadow: "none" }}
                        >
                          {p}
                        </button>
                      )
                    )}
                    {page < totalPages - 1 && totalPages > 3 && (
                      <span className="px-2 py-1">...</span>
                    )}
                    <button
                      className="px-2 py-1 text-neutral-950 text-text-medium font-medium flex items-center"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                      <img src="/icons/chevron-right.svg" alt="Next" className="w-6 h-6 ml-1" />
                    </button>
                  </nav>
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden md:block">
                <div className="w-full border border-neutral-300 bg-white p-4 rounded-xl shadow-md overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-text-md text-neutral-950 font-bold bg-neutral-50">
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Nomor Handphone</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Created at</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8">Loading...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td>
                        </tr>
                      ) : (
                        users.map((user, idx) => (
                          <tr key={user.id} className="text-text-md font-semibold text-neutral-950 border-b border-neutral-300">
                            <td className="py-3 px-4">{(page - 1) * 10 + idx + 1}</td>
                            <td className="py-3 px-4">{user.name}</td>
                            <td className="py-3 px-4">{user.phone || "-"}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Desktop: showing info & pagination */}
                  <div className="flex items-center justify-between mt-4 mb-4">
                    <div className="text-text-md font-medium text-neutral-950">
                      {`Showing ${(page - 1) * 10 + 1} to ${Math.min(page * 10, totalEntries)} of ${totalEntries} entries`}
                    </div>
                    <nav className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 text-text-md font-medium text-neutral-950 flex items-center hover:font-semibold"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <img src="/icons/chevron-left.svg" alt="Previous" className="w-6 h-6 mr-1" />
                        Previous
                      </button>
                      {page > 2 && totalPages > 3 && (
                        <span className="px-2 py-1">...</span>
                      )}
                      {paginationNumbers.map(p =>
                        page === p ? (
                          <button
                            key={p}
                            className="px-3 py-1 rounded-lg border bg-neutral-200 border-neutral-300 font-bold"
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </button>
                        ) : (
                          <button
                            key={p}
                            className="px-3 py-1 rounded-lg bg-transparent border-0 text-neutral-950 font-medium hover:font-semibold"
                            onClick={() => setPage(p)}
                            style={{ boxShadow: "none" }}
                          >
                            {p}
                          </button>
                        )
                      )}
                      {page < totalPages - 1 && totalPages > 3 && (
                        <span className="px-2 py-1">...</span>
                      )}
                      <button
                        className="px-2 py-1 text-text-md font-medium text-neutral-950 flex items-center hover:font-semibold"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                        <img src="/icons/chevron-right.svg" alt="Next" className="w-6 h-6 ml-1" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;