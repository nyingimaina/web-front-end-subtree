using RazorEngineCore;

namespace Jattac.Apps.CompanyMan.DocumentGeneration
{
    public interface ITemplateCompiler
    {
        Task<string> GenerateFromFileAsync(string filePath, object data);

        Task<string> GenerateFromStringAsync(string templateString, object data);

        
    }

    public class TemplateCompiler : ITemplateCompiler
    {
        public async Task<string> GenerateFromFileAsync(
            string filePath,
            object data)
        {
            return await GenerateFromStringAsync(File.ReadAllText(filePath), data);
        }

        public async Task<string> GenerateFromStringAsync(
            string templateString,
            object data)
        {
            var razorEngine = new RazorEngine();

            templateString = GetWithKeywordsEscaped(templateString);
            var compiledTemplate = await razorEngine.CompileAsync(
                templateString);

            return await compiledTemplate.RunAsync(data);
        }

        private string GetWithKeywordsEscaped(string templateString){
            var keywords = new HashSet<string>{
                "@media",
                "@font-face",
            };

            foreach (var keyword in keywords)
            {
                templateString = templateString.Replace(keyword, $"@{keyword}", StringComparison.OrdinalIgnoreCase);
            }
            return templateString;
        }
    }
}