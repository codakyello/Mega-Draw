import { Box } from "@chakra-ui/react";
import Filter from "@/app/_components/Filter";
import Sort from "@/app/_components/Sort";
import Collaborators from "@/app/_components/Collaborators";
import { getUser } from "@/app/_lib/data-service";

export default async function Page() {
  const user = await getUser();
  console.log(user);
  const organisationId = user.organisationId;

  return (
    <Box className="flex pl-[2rem] flex-col gap-[3.2rem]">
      <Box className="flex flex-col justify-between xl:flex-row gap-8 pt-1 pr-1 whitespace-nowrap">
        <h1 className="">All collaborators</h1>
        <Box className="flex flex-col md:flex-row flex-wrap gap-6">
          <Filter
            defaultValue="all"
            paramName="status"
            filters={[
              { name: "All", value: "all" },
              { name: "Pending", value: "pending" },
              { name: "Accepted", value: "accepted" },
            ]}
          />

          <Sort
            className=" max-w-[39rem]"
            defaultValue="startDate-desc"
            options={[
              {
                name: "Sort by username (A-Z)",
                value: "username-asc",
              },
              {
                name: "Sort by username (Z_A)",
                value: "username-desc",
              },
            ]}
          />
        </Box>
      </Box>

      <Collaborators organisationId={organisationId} />
    </Box>
  );
}