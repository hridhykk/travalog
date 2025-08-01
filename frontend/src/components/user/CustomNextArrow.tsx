
import { ChevronRight } from "lucide-react";

const CustomNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}  right-2 z-10`}
      style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClick}
    >
      <ChevronRight className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer hover:bg-opacity-80" />
    </div>
  );
};

export default CustomNextArrow;
