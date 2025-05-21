namespace Jattac.Apps.CompanyMan.FilesAndDocuments.Templates
{
    public interface ITemplateReader
    {
        Task<string> GetTemplateContentAsync(string documentType, string filename);
    }
    public class TemplateReader : ITemplateReader
    {

        public async Task<string> GetTemplateContentAsync(string documentType, string filename)
        {
            var fullFilePath = await GetFullFilePathAsync(
                documentType: documentType,
                filename: filename);

            if(!File.Exists(fullFilePath))
            {
                throw new FileNotFoundException(
                    $"Could not find template of document type '{documentType}' called '{filename}' at \n '{fullFilePath}'");
            }
            return File.ReadAllText(fullFilePath);
        }

        private string AssemblyPath
        {
            get
            {
                return Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location)!;
            }
        }
        private string BasePath
        {
            get
            {
                return Path.Combine(
                    AssemblyPath,
                    "templates");
            }
        }

        private string GetDocumentPath(
            string documentType,
            string baseDirectory)
        {
            var documentDirectory = Path.Combine(
                BasePath,
                documentType);

            if (!Directory.Exists(documentDirectory))
            {
                Directory.CreateDirectory(documentDirectory);
            }

            return documentDirectory;
        }

        private Task<string> GetFullFilePathAsync(
            string documentType,
            string filename)
        {
            var directory = GetDocumentPath(
                documentType: documentType,
                baseDirectory: documentType
            );

            var fullPath = Path.Combine(directory, filename);
            return Task.FromResult(fullPath);
        }
    }
}