namespace Jattac.Apps.CompanyMan.Utils
{


    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Reflection;

    public static class PropertyMapper
    {
        // Define a struct to store property pairs
        private readonly struct PropertyPair
        {
            public PropertyInfo SourceProperty { get; }
            public PropertyInfo DestinationProperty { get; }

            public PropertyPair(PropertyInfo sourceProperty, PropertyInfo destinationProperty)
            {
                SourceProperty = sourceProperty;
                DestinationProperty = destinationProperty;
            }
        }

        private static readonly ConcurrentDictionary<string, List<PropertyPair>> PropertyMapCache = new();

        public static TDestination MapProperties<TSource, TDestination>(TSource source, TDestination destination)
        {
            if (source == null) throw new ArgumentNullException(nameof(source), "Source object cannot be null.");
            if (destination == null) throw new ArgumentNullException(nameof(destination), "Destination object cannot be null.");

            var sourceType = typeof(TSource);
            var destType = typeof(TDestination);
            var cacheKey = $"{sourceType.FullName}->{destType.FullName}";

            if (!PropertyMapCache.TryGetValue(cacheKey, out var propertyMappings))
            {
                propertyMappings = GetMatchingProperties(sourceType, destType);
                PropertyMapCache[cacheKey] = propertyMappings;
            }

            foreach (var propPair in propertyMappings)
            {
                var sourceValue = propPair.SourceProperty.GetValue(source);
                propPair.DestinationProperty.SetValue(destination, sourceValue);
            }
            return destination;
        }

        private static List<PropertyPair> GetMatchingProperties(Type sourceType, Type destType)
        {
            var sourceProperties = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var destProperties = destType.GetProperties(BindingFlags.Public | BindingFlags.Instance);

            var propertyMappings = new List<PropertyPair>();

            foreach (var sourceProp in sourceProperties)
            {
                var destProp = Array.Find(destProperties, p =>
                    p.Name == sourceProp.Name &&
                    p.CanWrite &&
                    p.PropertyType.IsAssignableFrom(sourceProp.PropertyType));

                if (destProp != null)
                {
                    propertyMappings.Add(new PropertyPair(sourceProp, destProp));
                }
            }

            return propertyMappings;
        }
    }

}