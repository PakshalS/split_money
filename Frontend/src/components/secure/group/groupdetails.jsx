import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import { useTheme } from "../../../context/themeContext";
import { ChevronLeft, LogOut, Menu } from "lucide-react";
import { useOutletContext } from "react-router-dom";

// Import skeleton loader
import GroupDetailsSkeleton from "./grouploader";

// Import the new AdminSidebar component
import AdminSidebar from "../admin/adminsidebar";

// Lazy load the components
import AddExpenseForm from "../admin/addexpense";
import SettleUpForm from "../admin/settleup";
import GroupEditForm from "../admin/editgroup";
import AddMemberForm from "../admin/addmember";
import ChangeAdminForm from "../admin/changeadmin";

// Import the other components
import SummaryComponent from "./summary";
import ExpensesComponent from "./expenses";
import BalancesComponent from "./balances";
import SettleUpsComponent from "./settleups";
import MembersComponent from "./members";

const GroupDetails = () => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [message1, setMessage1] = useState("");
  const [error1, setError1] = useState("");
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);
  const [isGroupEditOpen, setIsGroupEditOpen] = useState(false);
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isChangeAdminOpen, setIsChangeAdminOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const { onRefreshGroups, friends, requests, onRefreshFriends } = useOutletContext();

  const fetchGroupDetails = async () => {
    if (isDeleted) return;
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await axios.get(
        `https://split-money-api.vercel.app/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setGroupDetails(response.data);
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      setIsAdmin(response.data.group.admin._id === userId);
      setIsLoading(false);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "Error fetching group details");
      console.error("Error fetching group details:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, [groupId, isDeleted]);

  const debouncedFetchGroupDetails = debounce(() => {
    if (!isDeleted) {
      fetchGroupDetails();
    }
  }, 300);

  const toggleAddExpenseForm = () => {
    setIsAddExpenseOpen(!isAddExpenseOpen);
    setIsSidebarOpen(false);
  };
  const toggleSettleUpForm = () => {
    setIsSettleUpOpen(!isSettleUpOpen);
    setIsSidebarOpen(false);
  };
  const toggleGroupEditForm = () => {
    setIsGroupEditOpen(!isGroupEditOpen);
    setIsSidebarOpen(false);
  };
  const toggleChangeAdminForm = () => {
    setIsChangeAdminOpen(!isChangeAdminOpen);
    setIsSidebarOpen(false);
  };
  const toggleAddMemberForm = () => {
    setIsOpenAddMember(!isOpenAddMember);
    setIsSidebarOpen(false);
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLeave = async () => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      if (window.confirm("Are you sure you want to leave?")) {
        await axios.delete(
          `https://split-money-api.vercel.app/groups/${groupId}/leave`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Left Group successfully!");
        if (onRefreshGroups) onRefreshGroups();
        navigate("/home");
      }
    } catch (error) {
      console.error("Error leaving:", error);
      setError1(error.response?.data?.error || "Error leaving");
    }
  };

  const handleback = () => {
    navigate("/home");
  };

  // Show skeleton loader while loading
  if (isLoading) {
    return <GroupDetailsSkeleton isDark={isDark} />;
  }

  if (!groupDetails) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isDark ? "bg-gray-800" : "bg-gray-50"
        } ${isDark ? "text-white" : "text-gray-900"}`}
      >
        <div className="text-xl">Error loading group details.</div>
      </div>
    );
  }

  if (isDeleted) return null;

  return (
    <div
      className={`h-full flex flex-col relative ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex-shrink-0 ${
          isDark
            ? "bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        } border-b shadow-lg`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Back Button (Mobile only) */}
            <button
              onClick={handleback}
              className={`md:hidden flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Center: Group Info */}
            <div className="flex-1 min-w-0">
              <h1
                className={`text-base sm:text-lg font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {groupDetails.group.name}
              </h1>
              <p
                className={`text-xs truncate ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span className="text-green-600">Admin:</span>{" "}
                {groupDetails.group.admin.name}
              </p>
            </div>

            {/* Right: Admin Actions or Leave Button */}
            {isAdmin ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                <Menu className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Admin</span>
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Leave</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Sidebar Component */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isDark={isDark}
        onSettleUp={toggleSettleUpForm}
        onAddExpense={toggleAddExpenseForm}
        onAddMember={toggleAddMemberForm}
        onEditGroup={toggleGroupEditForm}
        onChangeAdmin={toggleChangeAdminForm}
        onLeave={handleLeave}
      />

      {/* Main Content - Scrollable */}
      <div
        className={`flex-1 overflow-y-auto scrollbar-hide ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Summary Component */}
          <SummaryComponent summary={groupDetails.summary} isDark={isDark} />

          {/* Expenses Component */}
          <ExpensesComponent
            expenses={groupDetails.group.expenses}
            isAdmin={isAdmin}
            groupId={groupId}
            onExpenseUpdated={debouncedFetchGroupDetails}
            isDark={isDark}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Balances Component */}
            <BalancesComponent
              balances={groupDetails.group.balances}
              isDark={isDark}
            />

            {/* Settle Ups Component */}
            <SettleUpsComponent
              transactions={groupDetails.group.transactionHistory}
              isDark={isDark}
            />
          </div>

            {/* Members Component */}
            <MembersComponent
            members={groupDetails.group.members}
            isAdmin={isAdmin}
            groupId={groupId}
            onMemberRemoved={debouncedFetchGroupDetails}
            isDark={isDark}
            friends={friends || []}
            requests={requests || []}  // Add this line
            onFriendRequestSent={onRefreshFriends}
            currentUserId={JSON.parse(atob(Cookies.get("authToken").split(".")[1])).userId}
            />

          {/* Messages */}
          {message && (
            <div className="p-3 bg-green-600/10 border border-green-500/50 rounded-lg text-green-500 text-center text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center text-sm">
              {error}
            </div>
          )}
          {message1 && (
            <div className="p-3 bg-green-600/10 border border-green-500/50 rounded-lg text-green-500 text-center text-sm">
              {message1}
            </div>
          )}
          {error1 && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center text-sm">
              {error1}
            </div>
          )}
        </div>
      </div>

      {/* Admin Forms */}
      {isAddExpenseOpen && (
        <AddExpenseForm
          groupId={groupId}
          onClose={() => {
            toggleAddExpenseForm();
            debouncedFetchGroupDetails();
          }}
          isDark={isDark}
        />
      )}

      {isOpenAddMember && (
        <AddMemberForm
          groupId={groupId}
          onClose={() => {
            toggleAddMemberForm();
            debouncedFetchGroupDetails();
          }}
          isDark={isDark}
        />
      )}

      {isSettleUpOpen && (
        <SettleUpForm
          groupId={groupId}
          onClose={() => {
            toggleSettleUpForm();
            debouncedFetchGroupDetails();
          }}
          isDark={isDark}
        />
      )}

      {isGroupEditOpen && (
        <GroupEditForm
          groupId={groupId}
          setIsDeleted={setIsDeleted}
          onClose={() => {
            toggleGroupEditForm();
            debouncedFetchGroupDetails();
          }}
          isDark={isDark}
        />
      )}

      {isChangeAdminOpen && (
        <ChangeAdminForm
          groupId={groupId}
          onClose={() => {
            toggleChangeAdminForm();
            debouncedFetchGroupDetails();
          }}
          isDark={isDark}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GroupDetails;