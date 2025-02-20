import { Box } from "@chakra-ui/react";
import DashboardLayout from "@/app/_components/DashboardLayout";

export const metadata = {
  title: "Dashboard",
};

function Page() {
  return (
    <Box className="flex px-[2rem] flex-col gap-[3.2rem]">
      <Box className="flex flex-col md:flex-row justify-between">
        <h1>Overview</h1>
      </Box>

      <DashboardLayout />
    </Box>
  );
}

export default Page;
