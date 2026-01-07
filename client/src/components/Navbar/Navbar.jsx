import { useEffect, useMemo, useRef, useState, useContext } from "react";
import { BiMenu, BiMessageDetail, BiX } from "react-icons/bi";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

import Logo from "../Logo/Logo.jsx";
import Menu from "../Menu/Menu";
import SearchBar from "../Searchbar/Searchbar.jsx";
import Notification from "../Notification/Notification.jsx";
import axiosInstance from "../../utils/api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
// 1. IMPORT THE TOGGLE
import ThemeToggle from "./ThemeToggle.jsx";

import "./Navbar.css";

const API_BASE = "https://socialmediawebsite-92x4.onrender.com";
const isAbs = (s) => /^https?:\/\//i.test(s || "");
const url = (s) => (isAbs(s) ? s : s ? `${API_BASE}${s}` : "");

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // current user (context -> localStorage fallback)
  const { currentUser } = useContext(AuthContext) || {};
  const me = useMemo(() => {
    if (currentUser) return currentUser;
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed?.user || parsed || null;
    } catch {
      return null;
    }
  }, [currentUser]);
  const meId = me?._id ? String(me._id) : "";

  // Burger menu
  const [isOpen, setIsOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const autoCloseTimer = useRef(null);

  useEffect(() => {
    clearTimeout(autoCloseTimer.current);
    if (isOpen && !isHoveringMenu) {
      autoCloseTimer.current = setTimeout(() => setIsOpen(false), 4000);
    }
    return () => clearTimeout(autoCloseTimer.current);
  }, [isOpen, isHoveringMenu]);

  // Search data
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchBoxRef = useRef(null);

  // Prefetch lists for local search
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          axiosInstance.get("/users"),
          axiosInstance.get("/post/all"),
        ]);
        const uList = Array.isArray(uRes.data)
          ? uRes.data
          : uRes.data?.users || [];
        const pList = pRes.data?.timelinePosts || pRes.data?.posts || [];
        if (mounted) {
          setUsers(uList);
          setPosts(pList);
        }
      } catch (e) {
        console.error(
          "Failed to prefetch search lists:",
          e?.response?.data || e.message
        );
      }
    })();
    return () => (mounted = false);
  }, []);

  // Close search dropdown outside click or route change
  useEffect(() => {
    const onDocClick = (e) => {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  useEffect(() => setDropdownOpen(false), [location.pathname]);

  // Local filter search handler
  const handleSearch = useMemo(
    () => (q) => {
      const query = (q || "").toLowerCase();
      if (!query) {
        setResults({ users: [], posts: [] });
        setDropdownOpen(false);
        return;
      }

      const matchedUsers = users
        .filter((u) => (u.username || "").toLowerCase().includes(query))
        .slice(0, 5);

      const matchedPosts = posts
        .filter((p) => (p.desc || "").toLowerCase().includes(query))
        .slice(0, 5);

      setResults({ users: matchedUsers, posts: matchedPosts });
      setDropdownOpen(true);
    },
    [users, posts]
  );

  const goToUser = (u) => {
    setDropdownOpen(false);
    if (u?._id) navigate(`/profile/${u._id}`);
  };

  const goToPost = (p) => {
    setDropdownOpen(false);
    if (p?._id) navigate(`/post/${p._id}`);
  };

  const hasResults =
    (results.users?.length || 0) + (results.posts?.length || 0) > 0;

  // -----------------------------
  // Messages: unread menu + badge
  // -----------------------------
  const [msgOpen, setMsgOpen] = useState(false);
  const [unread, setUnread] = useState([]); // array of unread message docs
  const [msgLoading, setMsgLoading] = useState(false);
  const msgBoxRef = useRef(null);
  const socketRef = useRef(null);

  // Click outside → close messages dropdown
  useEffect(() => {
    const onDocClick = (e) => {
      if (msgBoxRef.current && !msgBoxRef.current.contains(e.target)) {
        setMsgOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const unreadCount = unread.length;

  const fetchUnreadMessages = async () => {
    if (!meId) return;
    try {
      setMsgLoading(true);
      const res = await axiosInstance.get(`/messages/unread/${meId}`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.messages || res.data || [];
      setUnread(Array.isArray(list) ? list : []);
    } catch (e) {
      // silent
      console.log(e);
    } finally {
      setMsgLoading(false);
    }
  };

  // init socket + live increment
  useEffect(() => {
    if (!meId) return;

    fetchUnreadMessages();

    const s = io(API_BASE, {
      transports: ["websocket"],
      query: { userId: meId },
    });
    socketRef.current = s;

    const onNewMessage = (msg) => {
      const recipientId = String(msg?.recipient || "");
      if (recipientId === meId) {
        // push newest to the top if not already included
        setUnread((prev) => {
          const exists = prev.some((m) => String(m._id) === String(msg._id));
          if (exists) return prev;
          return [msg, ...prev];
        });
      }
    };

    s.on("message:new", onNewMessage);

    return () => {
      s.off("message:new", onNewMessage);
      s.disconnect();
      socketRef.current = null;
    };
  }, [meId]);

  // Polling fallback
  useEffect(() => {
    if (!meId) return;
    fetchUnreadMessages();
    const t = setInterval(fetchUnreadMessages, 15000);
    return () => clearInterval(t);
  }, [meId]);

  // When navigating to the messages area, re-sync (the page may mark read)
  useEffect(() => {
    if (meId && location.pathname.startsWith("/messages")) {
      const t = setTimeout(fetchUnreadMessages, 800);
      return () => clearTimeout(t);
    }
  }, [location.pathname, meId]);

  // Mark one message as read and go to /messages/:senderId
  const openMessageFrom = async (msg) => {
    try {
      if (msg?._id) {
        await axiosInstance.put(`/messages/read/${msg._id}`, { userId: meId });
      }
    } catch {
      console.log();
    }
    // optimistic UI update
    setUnread((prev) => prev.filter((m) => String(m._id) !== String(msg._id)));

    const senderId =
      (msg?.sender && (msg.sender._id || msg.sender)) || msg?.sender;
    if (senderId) navigate(`/messages/${senderId}`);
    setMsgOpen(false);
  };

  // Mark all read

  const markAllMessagesRead = async () => {
    const ids = unread.map((m) => m._id).filter(Boolean);
    if (ids.length === 0) return;
    try {
      await Promise.all(
        ids.map((id) =>
          axiosInstance.put(`/messages/read/${id}`, { userId: meId })
        )
      );
      setUnread([]);
      setMsgOpen(false);
    } catch (e) {
      // keep UI stable even if one fails
      console.log(e);
      setUnread([]);
      setMsgOpen(false);
    }
  };

  const toggleMsgOpen = () => setMsgOpen((o) => !o);

  return (
    <>
      {/* 2. UPDATED NAVBAR CLASSES FOR DARK MODE */}
      <div className="navbar bg-white dark:bg-gray-900 text-slate-800 dark:text-white shadow-md transition-colors duration-300 border-b border-gray-200 dark:border-gray-700">
        <div className="navbar-left">
          <Logo />
        </div>

        {/* SEARCH */}
        <div
          className="navbar-center relative w-full max-w-3xl mx-4"
          ref={searchBoxRef}
        >
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search users or posts..."
            // Added dark classes for search input placeholder/bg if needed in SearchBar component
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {/* Search Dropdown */}
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-[44px] z-50 bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {!hasResults ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  No results
                </div>
              ) : (
                <>
                  {results.users?.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Users
                      </div>
                      <ul>
                        {results.users.map((u) => (
                          <li
                            key={u._id}
                            className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                            onClick={() => goToUser(u)}
                          >
                            <img
                              src={
                                url(u.profilePicture) || "/default-avatar.png"
                              }
                              alt=""
                              className="w-7 h-7 rounded-full object-cover"
                              onContextMenu={(e) => e.preventDefault()}
                              draggable="false"
                            />
                            <span className="text-sm">{u.username}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {results.posts?.length > 0 && (
                    <div className="border-t dark:border-gray-700">
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Posts
                      </div>
                      <ul>
                        {results.posts.map((p) => {
                          let authorName = "Unknown";
                          if (p.userId && typeof p.userId === "object") {
                            authorName = p.userId.username || "Unknown";
                          } else {
                            const matchUser = users.find(
                              (u) => u._id === p.userId
                            );
                            if (matchUser) authorName = matchUser.username;
                          }
                          return (
                            <li
                              key={p._id}
                              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => goToPost(p)}
                            >
                              <div className="text-sm line-clamp-2">
                                {p.desc || "—"}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                by {authorName}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT ICONS */}
        <div className="navbar-right gap-2">
          {/* Messages menu (like Notifications) */}
          <div className="relative" ref={msgBoxRef}>
            <button
              type="button"
              className="relative hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={toggleMsgOpen}
              title="Messages"
            >
              <BiMessageDetail className="icon-size" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {msgOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
                  <h4 className="font-semibold">Messages</h4>
                  <button
                    onClick={markAllMessagesRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                    disabled={msgLoading || unreadCount === 0}
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-96 overflow-auto">
                  {msgLoading ? (
                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      Loading…
                    </div>
                  ) : unreadCount === 0 ? (
                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      No new messages.
                    </div>
                  ) : (
                    unread.map((m) => {
                      const s = m.sender || {};
                      const senderId = typeof s === "object" ? s._id : s;
                      const senderName =
                        (typeof s === "object" && s.username) || "Someone";
                      const avatar =
                        (typeof s === "object" && s.profilePicture) || "";
                      return (
                        <div
                          key={m._id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => openMessageFrom(m)}
                          title="Open message"
                        >
                          <img
                            src={url(avatar) || "/default-avatar.png"}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                            onContextMenu={(e) => e.preventDefault()}
                            draggable="false"
                          />
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-semibold">
                                {senderName}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                              {m.text || "—"}
                            </div>
                          </div>
                          <Link
                            to={`/messages/${senderId}`}
                            className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications remain unchanged */}
          <div className="relative">
            <Notification />
          </div>

          {/* 3. TOGGLE BUTTON INSERTED HERE */}
          <ThemeToggle />

          {isOpen ? (
            <BiX
              className="menu-icon icon-size hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
              title="Close menu"
            />
          ) : (
            <BiMenu
              className="menu-icon icon-size hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(true)}
              title="Open menu"
            />
          )}
        </div>
      </div>

      {/* Slide-out Menu */}
      {/* 4. UPDATED MENU CONTAINER FOR DARK MODE */}
      <div
        className={`menu-container ${
          isOpen ? "open" : ""
        } dark:bg-gray-900 dark:text-white transition-colors duration-300`}
        onMouseEnter={() => setIsHoveringMenu(true)}
        onMouseLeave={() => setIsHoveringMenu(false)}
      >
        <Menu isOpen={isOpen} />
      </div>
    </>
  );
}
