import UrlShortening from "@/UrlShortening/UI/UrlShortening";
import useRouteParamReader from "@/UseRouteParamReader/useRouteParamReader";

export default function UnitsListPage() {
  const shortCode = useRouteParamReader({
    paramName: "shortCode",
  });

  if (!shortCode) {
    return <div>...</div>;
  } else {
    return <UrlShortening shortUrlCode={shortCode} />;
  }
}
