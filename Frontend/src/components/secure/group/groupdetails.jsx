import React, { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import {
    ChevronLeft,
    Settings,
    IndianRupee,
    Receipt,
    UserPlus,
    ShieldCheck,
    X,
    LogOut,
    Menu
} from "lucide-react";

// Import skeleton loader
import GroupDetailsSkeleton from "./grouploader";

// Lazy load the components
const AddExpenseForm = lazy(() => import("../admin/addexpense"));
const SettleUpForm = lazy(() => import("../admin/settleup"));
const GroupEditForm = lazy(() => import("../admin/editgroup"));
const AddMemberForm = lazy(() => import("../admin/addmember"));
const ChangeAdminForm = lazy(() => import("../admin/changeadmin"));

// Import the new components
import SummaryComponent from "./summary";
import ExpensesComponent from "./expenses";
import BalancesComponent from "./balances";
import SettleUpsComponent from "./settleups";
import MembersComponent from "./members";

const GroupDetails = () => {
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

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

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
                await axios.delete(`https://split-money-api.vercel.app/groups/${groupId}/leave`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Left Group successfully!");
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
        return <GroupDetailsSkeleton />;
    }

    if (!groupDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-white">
                <div className="text-xl">Error loading group details.</div>
            </div>
        );
    }

    if (isDeleted) return null;

    return (
        <div className="min-h-screen bg-auth-back text-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border-b border-gray-800 shadow-2xl backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <button
                            onClick={handleback}
                            className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                            <span className="hidden sm:inline font-medium">Back</span>
                        </button>

                        {/* Center: Group Info */}
                        <div className="flex-1 text-center px-4 min-w-0">
                            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                                {groupDetails.group.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-400 truncate">
                                <span className="text-green-700">Admin:</span> {groupDetails.group.admin.name}
                            </p>
                        </div>

                        {/* Right: Admin Actions or Leave Button */}
                        {isAdmin ? (
                            <button
                                onClick={toggleSidebar}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-600 hover:text-black  text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg"
                            >
                                <Menu className="w-5 h-5" />
                                <span className="hidden sm:inline">Admin</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleLeave}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Leave</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar - Responsive Design */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 md:w-[420px] lg:w-[480px] max-w-[100vw] bg-gradient-to-b from-gray-900 to-gray-950 border-l border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                } overflow-hidden flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
                                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-white truncate">Admin Actions</h2>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 flex-shrink-0"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
                        </button>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">Manage your group settings and actions</p>
                </div>

                {/* Sidebar Content - Scrollable */}
                <div className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto scrollbar-hide">
                    <button
                        onClick={toggleSettleUpForm}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-700 hover:border-green-700/50 active:scale-[0.98]"
                    >
                        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
                            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base">Settle Up</p>
                            <p className="text-xs text-gray-400 truncate">Record payment between members</p>
                        </div>
                    </button>

                    <button
                        onClick={toggleAddExpenseForm}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-700 hover:border-green-700/50 active:scale-[0.98]"
                    >
                        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
                            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base">Add Expense</p>
                            <p className="text-xs text-gray-400 truncate">Create a new group expense</p>
                        </div>
                    </button>

                    <button
                        onClick={toggleAddMemberForm}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-700 hover:border-green-700/50 active:scale-[0.98]"
                    >
                        <div className="p-1.5 sm:p-2 bg-green-700/10 rounded-lg flex-shrink-0">
                            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base">Add Member</p>
                            <p className="text-xs text-gray-400 truncate">Invite people to the group</p>
                        </div>
                    </button>

                    <div className="border-t border-gray-800 my-3 pt-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2 sm:px-4">Settings</p>
                    </div>

                    <button
                        onClick={toggleGroupEditForm}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-700 hover:border-yellow-500/50 active:scale-[0.98]"
                    >
                        <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base">Edit Group</p>
                            <p className="text-xs text-gray-400 truncate">Modify or delete group</p>
                        </div>
                    </button>

                    <button
                        onClick={toggleChangeAdminForm}
                        className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left text-white bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-300 border border-gray-700 hover:border-blue-500/50 active:scale-[0.98]"
                    >
                        <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-base">Change Admin</p>
                            <p className="text-xs text-gray-400 truncate">Transfer admin rights</p>
                        </div>
                    </button>

                    {/* Extra padding at bottom for mobile safe area */}
                    <div className="h-24 sm:h-4"></div>
                </div>

                {/* Sidebar Footer */}
                <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-800 bg-gray-950">
                    <button
                        onClick={handleLeave}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/50 active:scale-[0.98] text-sm sm:text-base"
                    >
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        Leave Group
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-24 p-4 flex flex-col items-center">
                <div className="w-full max-w-6xl space-y-6">
                    {/* Summary Component */}
                    <SummaryComponent summary={groupDetails.summary} />

                    {/* Expenses Component */}
                    <ExpensesComponent
                        expenses={groupDetails.group.expenses}
                        isAdmin={isAdmin}
                        groupId={groupId}
                        onExpenseUpdated={debouncedFetchGroupDetails}
                    />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Balances Component */}
                        <BalancesComponent balances={groupDetails.group.balances} />

                        {/* Settle Ups Component */}
                        <SettleUpsComponent transactions={groupDetails.group.transactionHistory} />
                    </div>

                    {/* Members Component */}
                    <MembersComponent
                        members={groupDetails.group.members}
                        isAdmin={isAdmin}
                        groupId={groupId}
                        onMemberRemoved={debouncedFetchGroupDetails}
                    />

                    {/* Messages */}
                    {message && (
                        <div className="p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-700 text-center">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
                            {error}
                        </div>
                    )}
                    {message1 && (
                        <div className="p-4 bg-green-700/10 border border-green-700/50 rounded-xl text-green-700 text-center">
                            {message1}
                        </div>
                    )}
                    {error1 && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
                            {error1}
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Forms with Skeleton fallback */}
            {isAddExpenseOpen && (
                <Suspense fallback={<GroupDetailsSkeleton />}>
                    <AddExpenseForm
                        groupId={groupId}
                        onClose={() => {
                            toggleAddExpenseForm();
                            debouncedFetchGroupDetails();
                        }}
                    />
                </Suspense>
            )}
            {isOpenAddMember && (
                <Suspense fallback={<GroupDetailsSkeleton />}>
                    <AddMemberForm
                        groupId={groupId}
                        onClose={() => {
                            toggleAddMemberForm();
                            debouncedFetchGroupDetails();}}
                />
            </Suspense>
        )}
        {isSettleUpOpen && (
            <Suspense fallback={<GroupDetailsSkeleton />}>
                <SettleUpForm
                    groupId={groupId}
                    onClose={() => {
                        toggleSettleUpForm();
                        debouncedFetchGroupDetails();
                    }}
                />
            </Suspense>
        )}
        {isGroupEditOpen && (
            <Suspense fallback={<GroupDetailsSkeleton />}>
                <GroupEditForm
                    groupId={groupId}
                    setIsDeleted={setIsDeleted}
                    onClose={() => {
                        toggleGroupEditForm();
                        debouncedFetchGroupDetails();
                    }}
                />
            </Suspense>
        )}
        {isChangeAdminOpen && (
            <Suspense fallback={<GroupDetailsSkeleton />}>
                <ChangeAdminForm
                    groupId={groupId}
                    onClose={() => {
                        toggleChangeAdminForm();
                        debouncedFetchGroupDetails();
                    }}
                />
            </Suspense>
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