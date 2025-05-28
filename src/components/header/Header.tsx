import { useMediaQuery } from "react-responsive";
import LargeScreenHeader from "./LargeScreenHeader";
import SmallScreenHeader from "./SmallScreenHeader";

const Header: React.FC = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  return isLargeScreen ? <LargeScreenHeader /> : <SmallScreenHeader />;
};

export default Header;
