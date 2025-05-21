namespace Jattac.Apps.CompanyMan.Settings
{
    public class Setting
    {
        public Guid Id { get; set; }
        public string Owner { get; set; } = string.Empty;

        public string Key { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;

    }
}