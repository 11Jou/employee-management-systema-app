import { useRouter } from "next/router";
import DashboardLayout from "./DashboardLayout";



export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthRouter = router.pathname.includes("/dashboard");
  console.log(isAuthRouter);
  if (isAuthRouter) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  return <>{children}</>;
}