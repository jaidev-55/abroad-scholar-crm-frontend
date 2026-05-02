"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  // RiDashboardLine,
  RiKanbanView,
  RiUser3Line,
  // RiUserFollowLine,
  // RiUserUnfollowLine,
  // RiUserSettingsLine,
  // RiTaskLine,
  // RiBarChartLine,
  // RiFileTextLine,
  // RiVisaLine,
  // RiGraduationCapLine,
  // RiLineChartLine,
  // RiSettings3Line,
  // RiLockPasswordLine,
  RiProfileLine,
  RiTeamLine,
  RiLineChartLine,
  RiDashboardLine,
  // RiVisaLine,
  // RiFileTextLine,
  // RiGraduationCapLine,
  // RiLockPasswordLine,
  // RiSettings3Line,
  // RiTaskLine,
  // RiUserSettingsLine,
  // RiTeamLine,
  // RiBarChartLine,
  // RiUserUnfollowLine,
  // RiUserFollowLine,
  // RiDashboardLine,
  // RiTeamLine,
} from "react-icons/ri";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineDoubleLeft,
} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/auth";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import NotificationBell from "../../components/common/notifications/NotificationBell";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  const userName =
    currentUser?.name || currentUser?.email?.split("@")[0] || "Admin";
  const userEmail = currentUser?.email || "";
  const userInitials = userName[0]?.toUpperCase() ?? "A";
  const isLoading = false;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    // ───── MAIN ─────
    {
      id: "dashboard",
      icon: RiDashboardLine,
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      id: "pipeline",
      icon: RiKanbanView,
      label: "Leads Pipeline",
      href: "/admin/leads-pipeline",
    },
    {
      id: "all-leads",
      icon: RiUser3Line,
      label: "All Leads",
      href: "/admin/all-leads",
    },

    // ───── LEAD MANAGEMENT ─────
    // {
    //   id: "followups",
    //   icon: RiUserFollowLine,
    //   label: "Follow-ups",
    //   href: "/admin/follow-ups",
    // },
    // {
    //   id: "lost-leads",
    //   icon: RiUserUnfollowLine,
    //   label: "Lost Leads",
    //   href: "/admin/lost-leads",
    // },
    // {
    //   id: "lead-sources",
    //   icon: RiBarChartLine,
    //   label: "Lead Sources",
    //   href: "/admin/lead-sources",
    // },

    // ───── TEAM MANAGEMENT ─────
    {
      id: "users",
      icon: RiTeamLine,
      label: "Users",
      href: "/admin/users",
    },
    // {
    //   id: "counselors",
    //   icon: RiUserSettingsLine,
    //   label: "Counselors",
    //   href: "/admin/counselors",
    // },
    // {
    //   id: "tasks",
    //   icon: RiTaskLine,
    //   label: "Tasks",
    //   href: "/admin/tasks",
    // },
    // {
    //   id: "performance",
    //   icon: RiLineChartLine,
    //   label: "Performance",
    //   href: "/admin/performance",
    // },

    // ───── STUDENT PROCESS ─────
    // {
    //   id: "ielts",
    //   icon: RiFileTextLine,
    //   label: "IELTS Tracking",
    //   href: "/admin/ielts",
    // },
    // {
    //   id: "applications",
    //   icon: RiFileTextLine,
    //   label: "Applications",
    //   href: "/admin/applications",
    // },
    // {
    //   id: "visa",
    //   icon: RiVisaLine,
    //   label: "Visa Processing",
    //   href: "/admin/visa",
    // },
    // {
    //   id: "enrolled",
    //   icon: RiGraduationCapLine,
    //   label: "Enrolled Students",
    //   href: "/admin/enrolled",
    // },

    // ───── SETTINGS ─────
    {
      id: "ad-integration",
      icon: RiLineChartLine,
      label: "Ad Integration",
      href: "/admin/ad-integration",
    },
    // {
    //   id: "settings",
    //   icon: RiSettings3Line,
    //   label: "System Settings",
    //   href: "/admin/settings",
    // },
    {
      id: "profile",
      icon: RiProfileLine,
      label: "My Profile",
      href: "/admin/my-profile",
    },
    // {
    //   id: "change-password",
    //   icon: RiLockPasswordLine,
    //   label: "Change Password",
    //   href: "/admin/change-password",
    // },
  ];

  useEffect(() => {
    const activeItem = menuItems.find((item) => pathname.startsWith(item.href));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeItem) setActiveMenu(activeItem.id);
  }, [pathname]);

  // Prevent background scroll when mobile sidebar open
  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileSidebarOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return null;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className="hidden lg:flex flex-col bg-white shadow-lg z-20 fixed h-full border-r border-gray-100"
      >
        {/* Logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 min-h-[65px]">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/admin/leads-pipeline")}
          >
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <BsBriefcase className="text-white" size={20} />
            </div>
            {isSidebarOpen && (
              <span className="text-base font-bold text-gray-800 whitespace-nowrap">
                Abroad Scholars CRM
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(!isSidebarOpen);
              }}
              className="text-gray-600 cursor-pointer hover:text-ablue-500 shrink-0"
            >
              <AiOutlineDoubleLeft size={18} />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex items-center ${
                  isSidebarOpen ? "justify-start px-4" : "justify-center"
                } gap-3 py-2.5 mx-2 rounded-lg cursor-pointer text-left transition-all ${
                  activeMenu === item.id
                    ? "bg-blue-50 text-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveMenu(item.id)}
              >
                <Icon size={20} className="shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium text-sm whitespace-nowrap truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full ${
              isSidebarOpen ? "px-3 py-2.5" : "justify-center py-2.5"
            }`}
          >
            <AiOutlineLogout size={20} className="shrink-0" />
            {isSidebarOpen && (
              <span className="font-medium text-sm">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-64 sm:w-72 max-w-[85%] bg-white shadow-2xl flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 min-h-[60px]">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BsBriefcase className="text-white" size={18} />
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-800">
                    Abroad Scholars CRM
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              {/* Menu */}
              <nav className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;

                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={() => {
                        setActiveMenu(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`group flex items-center gap-3 p-2.5 sm:p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors duration-200 ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-2 sm:p-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-3 w-full p-2.5 sm:p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <AiOutlineLogout size={18} className="shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-1.5 gap-2">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer lg:hidden shrink-0"
              >
                <AiOutlineMenu size={20} className="text-gray-700" />
              </button>

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                  Hi, {userName}!!
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block truncate">
                  Manage student leads, track applications, and monitor
                  counselor performance.
                </p>
              </div>
            </div>

            {/* Right Section - Profile */}
            <div className="flex items-center shrink-0">
              <NotificationBell />
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm shrink-0">
                    {userInitials}
                  </div>
                  <div className="hidden sm:block text-left min-w-0">
                    <p className="font-medium text-gray-700 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 hidden md:block">
                      My Account
                    </p>
                  </div>
                  <FiChevronDown
                    className={`hidden sm:block w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform shrink-0 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.2 }}
                    >
                      {/* User Info Section */}
                      <div className="p-3 sm:p-4 bg-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0">
                            {userInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                              {userName}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/admin/my-profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <RiProfileLine className="w-5 h-5 shrink-0" />
                          <span className="font-medium">My Profile</span>
                        </Link>

                        {/* <Link
                          to="/admin/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <RiSettings3Line className="w-5 h-5 shrink-0" />
                          <span className="font-medium">System Settings</span>
                        </Link> */}

                        {/* <Link
                          to="/admin/change-password"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <RiLockPasswordLine className="w-5 h-5 shrink-0" />
                          <span className="font-medium">Change Password</span>
                        </Link> */}
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 p-1.5 sm:p-2">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="flex cursor-pointer items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                        >
                          <AiOutlineLogout className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 bg-gray-50">
          <Outlet />
          <div className="text-center text-gray-600 text-xs sm:text-sm">
            © {new Date().getFullYear()} Abroad Scholars CRM
            <span className="mx-1">|</span>
            All Rights Reserved
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
