using Jattac.Apps.CompanyMan.Routing;

namespace Jattac.Apps.CompanyMan.Settings
{
    public class SettingsRouter : CompanyManRouter
    {
        public override string RouteName => "Settings";

        public override HashSet<RouteDescription> RouteDescriptions => new HashSet<RouteDescription>
        {
            new RouteDescription(
                endpoint:"get-settings",
                httpMethod:HttpMethod.Get,
                handler: (ISettingsMarshler settingsMarshler) => settingsMarshler.GetSettings()
            ),
            new RouteDescription(
                endpoint:"set-settings",
                httpMethod:HttpMethod.Post,
                handler: (ISettingsMarshler settingsMarshler, List<Setting> settings) => settingsMarshler.SetSettings(settings: settings)
            ),
            new RouteDescription(
                endpoint:"get-settings-by-owner-and-keys",
                httpMethod:HttpMethod.Get,
                handler: (ISettingsMarshler settingsMarshler, string owner, string keys) =>
                {
                    var keysList = keys.Split(',').ToList();
                    return settingsMarshler.GetSettingsByOwnerAndKeys(owner, keysList);
                }
            )
        };
    }
}