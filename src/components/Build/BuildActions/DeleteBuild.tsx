"use client";

import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type DeleteBuildButtonProps = {
  buildId: string;
};

const DeleteBuildButton = ({ buildId }: DeleteBuildButtonProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const deleteBuildMutation = api.build.delete.useMutation({
    onSuccess: async () => {
      // Invalida specificamente la cache della query getInfinite
      await utils.build.getInfinite.invalidate();
      router.push("/");
    },
    onError: (error) => {
      console.error("Failed to delete build:", error);
      alert("Error deleting build. Please try again.");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this build?")) {
      deleteBuildMutation.mutate({ id: buildId });
    }
  };

  return (
    <Button
      color="red"
      className="cursor-pointer"
      onClick={handleDelete}
      loading={deleteBuildMutation.isPending}
    >
      Delete build
    </Button>
  );
};

export default DeleteBuildButton;
