import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCircle2, User } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import HackathonCard from "../components/HackathonCard";
import { ChevronDown } from "lucide-react";
import TeamCard from "../components/TeamCard";
import EditProfileModal from "../components/EditProfileModal";
import RequestsModal from "../components/RequestsModal";
import { toast } from 'react-hot-toast';
import JoinRequestsModal from "../components/JoinRequestsModal";
import UserPanel from "../components/UserPanel";


export default function Dashboard() {
    // 🔁 State declarations
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [activeTab, setActiveTab] = useState("projects");
    const [showAll, setShowAll] = useState(true);
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTech, setFilterTech] = useState("");
    const [hackathons, setHackathons] = useState([]);
    const [hackathonSearch, setHackathonSearch] = useState("");
    const [modeFilter, setModeFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [themeFilter, setThemeFilter] = useState("");
    const [locations, setLocations] = useState([]);
    const [themes, setThemes] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [teamsCreated, setTeamsCreated] = useState([]);
    const [teamsJoined, setTeamsJoined] = useState([]);
    const [modalTeam, setModalTeam] = useState(null);
    const hasPendingRequests = teamsCreated.some(team => team.joinRequests?.length > 0);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProjectRequestsModal, setShowProjectRequestsModal] = useState(false);
    const [activeProjectRequests, setActiveProjectRequests] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [requestedProjectIds, setRequestedProjectIds] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "hackathons"; // default to 'projects'
    const [suggestedProjects, setSuggestedProjects] = useState([]);
    const [suggestedHackathons, setSuggestedHackathons] = useState([]);
    const [suggestionsFetched, setSuggestionsFetched] = useState(false);

    const handleTabChange = (tabName) => {
        setSearchParams({ tab: tabName });
    };
    const navigate = useNavigate();

    const handleOpenProjectRequestsModal = async (project) => {
        try {
            const res = await fetch(`http://localhost:5070/api/projects/${project._id}/requests`, {
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                setActiveProjectRequests(data);
                setActiveProjectId(project._id);
                setShowProjectRequestsModal(true);
            } else {
                toast.error(data.error || "Failed to load requests");
            }
        } catch {
            toast.error("Error loading requests");
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5070/api/projects/${activeProjectId}/requests/${userId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ action: "accept" }),
            });
            if (res.ok) {
                setActiveProjectRequests(prev => prev.filter(r => r.user._id !== userId));
                toast.success("Accepted");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to accept");
            }
        } catch {
            toast.error("Accept failed");
        }
    };

    const handleRejectRequest = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5070/api/projects/${activeProjectId}/requests/${userId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({ action: "reject" }),
            });
            if (res.ok) {
                setActiveProjectRequests(prev => prev.filter(r => r.user._id !== userId));
                toast.success("Rejected");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to reject");
            }
        } catch {
            toast.error("Reject failed");
        }
    };

    const handleJoinProject = async (projectId) => {
        try {
            const res = await fetch(`http://localhost:5070/api/projects/${projectId}/join-request`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Update state locally so UI re-renders
                setRequestedProjectIds((prev) => [...prev, projectId]);
                toast.success("Join request sent!");
            } else {
                toast.error(data.error || "Failed to send request");
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    // 📡 Fetch current user
    useEffect(() => {
        fetch("http://localhost:5070/api/auth/me", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    navigate("/login");
                }
                setLoading(false);
            })
            .catch(() => {
                navigate("/login");
            });
    }, []);

    // 📡 Fetch all projects
    useEffect(() => {
        fetch("http://localhost:5070/api/projects", { credentials: "include" })
            .then(res => res.json())
            .then(data => setProjects(data))
            .catch(err => console.error("Failed to fetch projects:", err));
    }, []);


    useEffect(() => {
        if (!user || projects.length === 0) return;

        const requested = projects
            .filter(p =>
                Array.isArray(p.joinRequests) &&
                p.joinRequests.some(req =>
                    req.user === user._id || req.user?._id === user._id
                )
            )
            .map(p => p._id);

        setRequestedProjectIds(requested);
    }, [user, projects]);


    const fetchSuggestions = async () => {
        try {
            const res = await fetch(`http://localhost:5070/api/suggestions/projects/${user._id}`, {
                credentials: "include",
            });
            const data = await res.json();

            console.log("Received suggestion data:", data);

            const suggested = data.suggested_projects || [];

            // Map to full project details using `projects` state
            const enriched = suggested
                .map(sp => {
                    const full = projects.find(p => p._id === sp._id);
                    if (!full) return null;
                    return { ...full, match_score: sp.match_score };
                })
                .filter(Boolean); // Remove any nulls in case of missing matches

            setSuggestedProjects(enriched);
        } catch (err) {
            console.error("Failed to fetch suggestions", err);
        }
    };

    const fetchHackathonSuggestions = async () => {
        try {
            const res = await fetch(`http://localhost:5070/api/suggestions/hackathons/${user._id}`, {
                credentials: "include",
            });
            const data = await res.json();
            console.log("Hackathon suggestions:", data);

            const suggested = data.suggested_hackathons || [];

            const fullSuggestedHackathons = suggested
                .map((s) => hackathons.find((h) => h._id === s._id))
                .filter(Boolean);

            setSuggestedHackathons(fullSuggestedHackathons);
        } catch (err) {
            console.error("Failed to fetch hackathon suggestions", err);
        }
    };


    // Call this after setting user info
    useEffect(() => {
        if (user?._id && projects.length > 0 && !suggestionsFetched) {
            fetchSuggestions();
            fetchHackathonSuggestions();
            setSuggestionsFetched(true);
        }
    }, [user, projects, hackathons, suggestionsFetched]);


    useEffect(() => {
        fetch("http://localhost:5070/api/hackathons", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setHackathons(data);

                const locs = [...new Set(data.map(h => h.location).filter(Boolean))];
                const thms = [...new Set(data.flatMap(h => h.themes || []).filter(t => t && t.trim() !== ""))];

                setLocations(locs);
                setThemes(thms);
            })
            .catch(err => console.error("Failed to fetch hackathons:", err));
    }, []);

    useEffect(() => {
        if (activeTab === "hackathons" && !showAll) {
            fetch("http://localhost:5070/api/teams/my-teams", {
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => {
                    setTeamsCreated(data.filter(team => team.creator?._id === user._id));
                    setTeamsJoined(data.filter(team => team.creator?._id !== user._id));

                })
                .catch((err) => {
                    console.error("Failed to fetch your teams:", err);
                });
        }
    }, [activeTab, showAll, user?._id]);

    async function handleAccept(teamId, userId) {
        try {
            const res = await fetch(`http://localhost:5070/api/teams/${teamId}/accept`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error("Failed to accept user");
            refetchMyTeams();
            setModalTeam(null);
        } catch (err) {
            console.error("Accept error:", err);
            alert("Failed to accept user");
        }
    }

    async function handleReject(teamId, userId) {
        console.log("Rejecting user:", userId, "from team:", teamId, typeof teamId);
        try {
            const res = await fetch(`http://localhost:5070/api/teams/${teamId}/reject`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error("Failed to reject user");
            refetchMyTeams();
            setModalTeam(null);
        } catch (err) {
            console.error("Reject error:", err);
            alert("Failed to reject user");
        }
    }

    function refetchMyTeams() {
        if (!user?._id) return;

        fetch("http://localhost:5070/api/teams/my-teams", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const created = data.filter((team) => team.creator?._id === user._id);  // ✅ FIXED
                const joined = data.filter(
                    (team) =>
                        team.creator?._id !== user._id &&
                        team.members?.some((member) => member._id === user._id)
                );
                setTeamsCreated(created);
                setTeamsJoined(joined);
                console.log("Refetched teams", { created, joined });
            })
            .catch((err) => console.error("Failed to fetch your teams:", err));
    }



    if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

    // 🔍 Apply search, tech filter, and my/all filter
    const filteredProjects = projects
        .filter((p) => {
            const isCreator = p.createdBy?._id === user._id;
            const isMember = p.teamMembers.some((m) => m.user?._id === user._id);
            if (showAll) {
                // In "All Projects" tab, show projects not created by or joined by the user
                return !isCreator && !isMember;
            } else {
                // In "My Projects" tab, show projects created by or joined by the user
                return isCreator || isMember;
            }
        })
        .filter((p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((p) => !filterTech || p.techStack.includes(filterTech));


    const filteredHackathons = hackathons
        .filter((h) =>
            h.title?.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
            h.host?.toLowerCase().includes(hackathonSearch.toLowerCase()) ||
            (h.themes || []).some((theme) =>
                theme.toLowerCase().includes(hackathonSearch.toLowerCase())
            )
        )
        .filter((h) => {
            if (!modeFilter) return true;

            const isOnline = h.location?.toLowerCase().trim() === "online";
            return modeFilter === "online" ? isOnline : !isOnline;
        })

        .filter((h) => !locationFilter || h.location === locationFilter)
        .filter((h) => !themeFilter || (h.themes || []).includes(themeFilter));

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-slate-100 dark:from-[#0f0f0f] dark:via-[#131313] dark:to-[#1a1a1a] text-gray-900 dark:text-white transition-colors duration-500 p-6">
            {/* Top Bar */}
            <header className="flex justify-between items-center border-b border-zinc-300 dark:border-zinc-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-blue-500">TeamUp</h1>
                    {/* <span className="text-xl font-semibold">Dashboard</span> */}
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/70 dark:bg-white/10 border border-white/30 hover:bg-white/90 dark:hover:bg-white/20 transition" title="Profile">
                        <UserCircle2 className="text-gray-900 dark:text-white" size={24} />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-zinc-300 dark:border-zinc-700">
                {[{ key: "hackathons", label: "Hackathons" }, { key: "projects", label: "Projects" }].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`px-6 py-2 rounded-t-lg font-medium transition-all duration-300 ${activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-700 dark:hover:text-white"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>


            {/* 🔍 Search & Filter Toolbar */}
            {activeTab === "projects" && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search Projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/10 rounded-md text-white placeholder:text-gray-400"
                        />
                        <select
                            value={filterTech}
                            onChange={(e) => setFilterTech(e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/10 rounded-md text-white"
                        >
                            <option value="">Filter by Tech</option>
                            <option value="MERN">MERN</option>
                            <option value="React">React</option>
                            <option value="Node.js">Node.js</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Python">Python</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-md ${showAll ? "bg-blue-600" : "bg-white/10"}`} onClick={() => setShowAll(true)}>
                            All Projects
                        </button>
                        <button className={`px-4 py-2 rounded-md ${!showAll ? "bg-blue-600" : "bg-white/10"}`} onClick={() => setShowAll(false)}>
                            My Projects
                        </button>
                        <button
                            onClick={() => navigate("/projects/new")}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                            + Create
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "hackathons" && (
                <div className="relative mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text"
                            placeholder="Search Hackathons..."
                            value={hackathonSearch}
                            onChange={(e) => setHackathonSearch(e.target.value)}
                            className="px-4 py-2 bg-white/10 border border-white/10 rounded-md text-white placeholder:text-gray-400"
                        />

                        {/* Filter Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 text-white rounded-md"
                            >
                                Filter <ChevronDown size={16} />
                            </button>

                            {showFilterDropdown && (
                                <div className="absolute mt-2 w-72 p-5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-20">
                                    <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

                                    {/* Mode Filter */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-zinc-300 mb-1">Mode</label>
                                        <select
                                            value={modeFilter}
                                            onChange={(e) => setModeFilter(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                                        >
                                            <option value="">All</option>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                        </select>
                                    </div>

                                    {/* Location Filter */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-zinc-300 mb-1">Location</label>
                                        <select
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                                        >
                                            <option value="">All</option>
                                            {locations.map((loc, i) => (
                                                <option key={i} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Theme Filter */}
                                    <div className="mb-4">
                                        <label className="block text-sm text-zinc-300 mb-1">Theme</label>
                                        <select
                                            value={themeFilter}
                                            onChange={(e) => setThemeFilter(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                                        >
                                            <option value="">All</option>
                                            {themes.map((theme, i) => (
                                                <option key={i} value={theme}>{theme}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between gap-3 mt-4">
                                        <button
                                            onClick={() => setShowFilterDropdown(false)}
                                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                        >
                                            Apply
                                        </button>
                                        <button
                                            onClick={() => {
                                                setModeFilter("");
                                                setLocationFilter("");
                                                setThemeFilter("");
                                                setShowFilterDropdown(false);
                                            }}
                                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-md ${showAll ? "bg-blue-600" : "bg-white/10"}`} onClick={() => setShowAll(true)}>
                            All Hackathons
                        </button>

                        <button
                            className={`relative px-4 py-2 rounded-md ${!showAll ? "bg-blue-600" : "bg-white/10"}`}
                            onClick={() => setShowAll(false)}
                        >
                            Your Teams
                            {hasPendingRequests && (
                                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
                            )}
                        </button>

                    </div>
                </div>
            )}

            {/* 📦 Project List */}
            {activeTab === "projects" && (
                <div>
                    {suggestedProjects.length > 0 && showAll && (
                        <div className="mb-6">
                            <div className="flex items-center justify-center my-8">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="mx-4 text-gray-400 text-lg">Suggested Projects</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedProjects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={{ ...project, loggedInUserId: user._id }}
                                        onOpenRequestsModal={handleOpenProjectRequestsModal}
                                        onJoinProject={handleJoinProject}
                                        hasRequested={requestedProjectIds.includes(project._id)}
                                    />
                                ))}
                            </div>
                            {/* Divider */}
                            <div className="flex items-center justify-center my-8">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="mx-4 text-gray-400 text-lg">Other Projects</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>
                        </div>
                    )}
                    {filteredProjects.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20 text-xl">No projects found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={{ ...project, loggedInUserId: user._id }}
                                    onOpenRequestsModal={handleOpenProjectRequestsModal}
                                    onJoinProject={handleJoinProject}
                                    hasRequested={requestedProjectIds.includes(project._id)}
                                />
                            ))}

                        </div>
                    )}
                </div>
            )}

            {activeTab === "hackathons" && showAll && (
                <div>
                    {suggestedHackathons.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-center my-8">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="mx-4 text-gray-400 text-lg">Suggested Hackathons</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedHackathons.map((hackathon) => (
                                    <HackathonCard key={hackathon._id} hackathon={hackathon} />
                                ))}
                            </div>
                            {/* Divider */}
                            <div className="flex items-center justify-center my-8">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="mx-4 text-gray-400 text-lg">Other Hackathons</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredHackathons.map((hackathon, i) => (
                            <HackathonCard key={i} hackathon={hackathon} />
                        ))}
                    </div>
                </div>

            )}

            {activeTab === "hackathons" && !showAll && (
                <>
                    {/* Teams Created by Me */}
                    <h2 className="text-2xl font-bold text-white mt-8 mb-4">Teams You Created</h2>
                    {teamsCreated.length === 0 ? (
                        <div className="text-center text-gray-400 mb-10">You haven't created any teams yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamsCreated.map((team) => (
                                <TeamCard key={team._id} team={team} onAccept={handleAccept} onReject={handleReject} onOpenRequestsModal={(team) => setModalTeam(team)} />
                            ))}
                        </div>
                    )}

                    {/* Teams Joined by Me */}
                    <h2 className="text-2xl font-bold text-white mt-10 mb-4">Teams You Joined</h2>
                    {teamsJoined.length === 0 ? (
                        <div className="text-center text-gray-400 mb-10">You're not a member of any other team.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teamsJoined.map((team) => (
                                <TeamCard key={team._id} team={team} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* 👤 Slide-In User Panel */}
            <UserPanel
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                user={user}
                setShowEditModal={setShowEditModal}
            />

            {
                modalTeam && (
                    <JoinRequestsModal
                        team={modalTeam}
                        onClose={() => setModalTeam(null)}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                )
            }

            {showEditModal && (
                <EditProfileModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showProjectRequestsModal && (
                <RequestsModal
                    requests={activeProjectRequests}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    onClose={() => setShowProjectRequestsModal(false)}
                />
            )}

        </div>

    );
}