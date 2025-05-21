import Account from "@/Account/UI/Account";
import RolePermissions from "@/RolePermissions/UI/RolePermissions";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";

export default function RolePermissionsPage() {
  const companyId = useRouteParamReader({
    paramName: "companyId",
  });

  if (!companyId) {
    return <div>...</div>;
  } else {
    return (
      <Account>
        <RolePermissions companyId={companyId} />
      </Account>
    );
  }
}
