
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BoardHeaderProps {
  title: string;
  description: string;
  boardPath: string;
}

const BoardHeader = ({ title, description, boardPath }: BoardHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button asChild>
          <Link to={`${boardPath}/write`}>글쓰기</Link>
        </Button>
      </div>
    </div>
  );
};

export default BoardHeader;
