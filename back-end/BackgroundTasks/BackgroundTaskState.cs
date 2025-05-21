namespace Jattac.Apps.CompanyMan.BackgroundTasks
{
    public class BackgroundTaskState
    {
        public string DisplayLabel { get; set; } = string.Empty;

        public DateTime LastRun { get; set; }

        public DateTime NextRun => LastRun.Add(Interval);

        public Exception? LastException { get; set; }

        public TimeSpan Interval { get; set; }
    }
}