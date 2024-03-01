import "./header.css";

const Header = (props: {
  navTo: "Main" | "History",
  setNavTo: React.Dispatch<React.SetStateAction<"Main" | "History">>
}) => {
  const {navTo, setNavTo} = props;

  return (
    <div className="header">
      <h1 className="header-logo">Photo Gallery</h1>
      <nav className="header-nav">
        <span className={`${navTo === "Main" && "active"}`} onClick={() => setNavTo("Main")}>Main</span>
        <span className={`${navTo === "History" && "active"}`} onClick={() => setNavTo("History")}>History</span>
      </nav>
    </div>
  );
}

export default Header;