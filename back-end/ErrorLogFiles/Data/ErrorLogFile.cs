namespace Jattac.Apps.CompanyMan.ErrorLogFiles.Data
{
    public class ErrorLogFile
    {
        public string FileName { get; set; } = "";
        public DateTime FileDate { get; set; }
        public long FileSizeBytes { get; set; }
    }

    public class ErrorLogContent
    {
        public string FileName { get; set; } = "";
        public string Content { get; set; } = "";
    }

    public class ExceptionEvent
    {
        public Event Event { get; set; } = new();
    }

    public class Event
    {
        public string Description { get; set; } = "";
        public DateTime ExceptionDateUtc { get; set; }
        public string ExceptionType { get; set; } = "";
        public string ExtraInformation { get; set; } = "";
        public List<StackFrame> Frames { get; set; } = new();
    }

    public class StackFrame
    {
        public string FileName { get; set; } = "";
        public string MethodName { get; set; } = "";
        public int LineNumber { get; set; }
    }
}
