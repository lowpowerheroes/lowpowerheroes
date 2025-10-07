import { useUser } from "@clerk/nextjs";
import DeleteBuildButton from "./DeleteBuild";

type BuildActionsProps = {
  buildId: string;
};

const BuildActions = ({ buildId }: BuildActionsProps) => {
  const { user } = useUser();

  if (user)
    return (
      <div className="justify-content-between flex items-center gap-4">
        <DeleteBuildButton buildId={buildId} />
      </div>
    );
};

export default BuildActions;
