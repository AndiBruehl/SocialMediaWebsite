import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <img
        src="/logo.png"
        alt="velvet-vibe-logo"
        className="h-[60px] w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
