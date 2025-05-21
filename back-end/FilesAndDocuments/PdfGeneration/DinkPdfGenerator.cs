using DinkToPdf;
using DinkToPdf.Contracts;

namespace Jattac.Apps.CompanyMan.FilesAndDocuments.PdfGeneration
{
    public interface IDinkPdfGenerator
    {
        HtmlToPdfDocument Generate(string text);

        void GenerateToFile(
            string text,
            string filePath);
    }
    public class DinkPdfGenerator : IDinkPdfGenerator
    {
        private readonly IConverter converter;

        public DinkPdfGenerator(
            IConverter converter
        )
        {
            this.converter = converter;
        }

        public HtmlToPdfDocument Generate(string text)
        {
            text = UpdatePathToAssets(text);
            var document = new HtmlToPdfDocument()
            {
                GlobalSettings = {
                ColorMode = ColorMode.Color,
                Orientation = Orientation.Portrait,
                PaperSize = PaperKind.A4,
                Margins = new MarginSettings() { Top = 2, Bottom = 2, Left = 0, Right =0 },

            },
                Objects = {
                new ObjectSettings() {
                    PagesCount = true,
                    WebSettings = { DefaultEncoding = "utf-8" }, 
                    HtmlContent = text,
                    LoadSettings = new LoadSettings() {
                        ZoomFactor = 2.0,
                    },

                }
            }
            };

            return document;
        }

        public void GenerateToFile(
            string text,
            string filePath)
        {
            var document = Generate(text);
            byte[] pdfBytes = converter.Convert(document);
            System.IO.File.WriteAllBytes(filePath, pdfBytes);

        }

        private string UpdatePathToAssets(string htmlText)
        {
            // Get the directory where the executable is located
            string executableDirectory = Path.GetDirectoryName(System.Reflection.Assembly.GetEntryAssembly()!.Location)!;

            // Define the original and replacement paths
            string originalPath = "./assets/";
            string replacementPath = Path.Combine(executableDirectory, "assets/").Replace("\\", "/");

            // Replace paths in the HTML text
            string updatedHtml = htmlText.Replace(originalPath, replacementPath);

            return updatedHtml;
        }
    }
}