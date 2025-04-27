interface ConnectionsNavbarProps {
  owner_username: string;
}

const btn_style_green: string =
  "bg-[#1c5f3a] text-white font-bold py-1 px-3 rounded-3xl cursor-default";
const btn_style_white: string =
  "bg-white border border-neutral-300 text-neutral-500 font-bold py-1 px-3 rounded-3xl cursor-default";
const nav_text_style: string = "text-neutral-500 font-bold cursor-default";

const ConnectionsNavbar: React.FC<ConnectionsNavbarProps> = ({
  owner_username,
}) => {
  return (
    <div
      className="bg-white h-[4rem] w-full flex items-center justify-center gap-2"
      style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)" }}
    >
      <div className={btn_style_green}>People ▾</div>
      <div className="w-[0.1rem] h-[2rem] bg-neutral-300"></div>
      <div className={btn_style_green}>Connections ▾</div>
      <div className={btn_style_green}>{owner_username} ▾</div>
      <div className={btn_style_white}>Locations ▾</div>
      <div className={btn_style_white}>Current company ▾</div>
      <div className="w-[0.1rem] h-[2rem] bg-neutral-300"></div>
      <div className={btn_style_white}>All filters</div>
      <div className={nav_text_style}>Reset</div>
    </div>
  );
};

export default ConnectionsNavbar;
