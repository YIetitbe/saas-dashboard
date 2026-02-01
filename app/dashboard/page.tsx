import UserTable from "@/features/users/components/UsersTable";
import { Providers } from "../providers";

const Page = () => {
  return (
    <Providers>
      <UserTable />
    </Providers>
  );
};

export default Page;
