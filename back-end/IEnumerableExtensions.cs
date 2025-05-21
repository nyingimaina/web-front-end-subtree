namespace Jattac.Apps.CompanyMan
{
    public static class IEnumerableExtensions
    {
        public static List<TResult> Map<TSource,TResult> (this IEnumerable<TSource> source, Func<TSource,int,TResult> fn)
        {
            if (source == null)
            {
                throw new ArgumentNullException("source");
            }
            var result = new List<TResult>();
            if(!source.Any())
            {
                return result;
            }
            int counter = 0;
            
            foreach (var item in source)
            {
                result.Add(fn(item, counter++));
            }
            return result;
        }

        public static void Map<TSource> (this IEnumerable<TSource> source, Action<TSource,int> fn)
        {
            Func<TSource, int, bool> fnWrapper = (item, index) =>
            {
                fn(item, index);
                return true;
            };
            source.Map(fnWrapper);
        }
    }
}