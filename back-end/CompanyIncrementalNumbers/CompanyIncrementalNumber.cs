namespace Jattac.Apps.CompanyMan.CompanyIncrementalNumbers
{
    public class CompanyIncrementalNumber : UserModel
    {
        public string NumberType { get; set; } = string.Empty;

        public long LatestValue { get; set; } = 0;
    }
}