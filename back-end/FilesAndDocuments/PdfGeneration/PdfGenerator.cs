namespace Jattac.Apps.CompanyMan.FilesAndDocuments.PdfGeneration
{
    public interface IPdfGenerator
    {
        void Generate(
            string filename,
            string compiledString
        );
    }
    class PdfGenerator : IPdfGenerator
    {
        private readonly IDinkPdfGenerator dinkPdfGenerator;

        public PdfGenerator(
            IDinkPdfGenerator dinkPdfGenerator
        )
        {
            this.dinkPdfGenerator = dinkPdfGenerator;
        }

        public void Generate(
            string filename,
            string compiledString
        )
        {
            if (File.Exists(filename))
            {
                File.Delete(filename);
            }
            dinkPdfGenerator.GenerateToFile(compiledString, filename);
        }
    }
}