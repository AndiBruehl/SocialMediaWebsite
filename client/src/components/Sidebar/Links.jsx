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
    <ul className="flex flex-col gap-1">
      <Link
        to="/"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <BiHomeAlt className="text-xl" />
        <span className="font-medium">Feed</span>
      </Link>

      {/* <Link to="/groups" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
        <MdGroups className="text-xl" />
        <span className="font-medium">Groups</span>
      </Link> */}

      <Link
        to="/messages"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <PiChatsBold className="text-xl" />
        <span className="font-medium">Chats</span>
      </Link>

      {/* <Link to="/bookmarks" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
        <HiOutlineBookmark className="text-xl" />
        <span className="font-medium">Bookmarks</span>
      </Link> */}

      <Link
        to="/questions"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <AiOutlineQuestionCircle className="text-xl" />
        <span className="font-medium">Questions</span>
      </Link>

      <Link
        to="/jobs"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <LiaBriefcaseSolid className="text-xl" />
        <span className="font-medium">Jobs</span>
      </Link>

      <Link
        to="/courses"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <PiGraduationCapBold className="text-xl" />
        <span className="font-medium">Courses</span>
      </Link>

      <Link
        to="/events"
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
      >
        <FaRegCalendarCheck className="text-xl" />
        <span className="font-medium">Events</span>
      </Link>
    </ul>
  );
}
