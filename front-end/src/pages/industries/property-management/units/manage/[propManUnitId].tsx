import Account from "@/Account/UI/Account";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";
import PropManUnit from "../../../../../../Industries/PropertyManagement/Units/UI/PropManUnit";

export default function PropManManagementPage() {
  const propManUnitId = useRouteParamReader({
    paramName: "propManUnitId",
  });

  if (!propManUnitId) {
    return <div>...</div>;
  } else {
    return (
      <Account>
        <PropManUnit propManUnitId={propManUnitId} />
      </Account>
    );
  }
}
