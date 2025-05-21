import Account from "@/Account/UI/Account";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import UnitsList from "../../../../../../Industries/PropertyManagement/UnitsList/UI/UnitsList";

export default function UnitsListPage() {
  const companyId = useRouteParamReader({
    paramName: "companyId",
  });

  if (!companyId) {
    return <div>...</div>;
  } else {
    return (
      <Account>
        <UnitsList companyId={companyId} />
      </Account>
    );
  }
}
