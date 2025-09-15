import { useUser } from "@clerk/nextjs";
import DeleteBuildButton from "./DeleteBuild";
import EditBuildButton from "./EditBuild";

type BuildActionsProps = {
  buildId: string;
};

const BuildActions = ({ buildId }: BuildActionsProps) => {
  const { user } = useUser();

  if (user)
    return (
      <div className="justify-content-between flex items-center gap-4">
        <EditBuildButton />
        <DeleteBuildButton buildId={buildId} />
      </div>
    );
};

export default BuildActions;
