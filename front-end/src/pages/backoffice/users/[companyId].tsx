import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Account from "@/Account/UI/Account";
import UserList from "@/UserList/UI/UserList";

export default function UserListPage() {
  const router = useRouter();
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const { companyId } = router.query;
      setCompanyId(companyId as string);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Account>
      {companyId ? (
        <UserList companyId={companyId} />
      ) : (
        <div>Company not found</div>
      )}
    </Account>
  );
}
