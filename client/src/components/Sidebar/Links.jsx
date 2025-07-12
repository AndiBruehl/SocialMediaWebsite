import { BiHomeAlt } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { PiChatsBold } from "react-icons/pi";
import { HiOutlineBookmark } from "react-icons/hi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { PiGraduationCapBold } from "react-icons/pi";
import { FaRegCalendarCheck } from "react-icons/fa";
import { RiMore2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Links() {
  return (
    <ul className="sidebar-links">
      <Link to="/" className="sidebar-link">
        <BiHomeAlt className="sidebar-icon" />
        <span className="link-text">Feed</span>
      </Link>
      <Link to="/groups" className="sidebar-link">
        <MdGroups className="sidebar-icon" />
        <span className="link-text">Groups</span>
      </Link>
      <Link to="/chats" className="sidebar-link">
        <PiChatsBold className="sidebar-icon" />
        <span className="link-text">Chats</span>
      </Link>
      <Link to="/bookmarks" className="sidebar-link">
        <HiOutlineBookmark className="sidebar-icon" />
        <span className="link-text">Bookmarks</span>
      </Link>
      <Link to="/questions" className="sidebar-link">
        <AiOutlineQuestionCircle className="sidebar-icon" />
        <span className="link-text">Questions</span>
      </Link>
      <Link to="/jobs" className="sidebar-link">
        <LiaBriefcaseSolid className="sidebar-icon" />
        <span className="link-text">Jobs</span>
      </Link>
      <Link to="/courses" className="sidebar-link">
        <PiGraduationCapBold className="sidebar-icon" />
        <span className="link-text">Courses</span>
      </Link>
      <Link to="/events" className="sidebar-link">
        <FaRegCalendarCheck className="sidebar-icon" />
        <span className="link-text">Events</span>
      </Link>
    </ul>
  );
}
