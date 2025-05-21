using System.Reflection;

namespace Jattac.Apps.CompanyMan.Routing
{
 
    public static class CrudRouterDiscoveryUtility
    {
        public static CompanyManRouter[] DiscoverAndInitializeCrudRouters(Assembly assembly)
        {
            // The base type we are looking for
            Type baseCrudRouterType = typeof(CrudRouter<,,,>);

            // Find all types that are subclasses of CrudRouter<,,,>
            var crudRouterTypes = assembly.GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && InheritsGenericCrudRouter(t, baseCrudRouterType))
                .ToList();

            var initializedRouters = new List<CompanyManRouter>();

            foreach (var crudRouterType in crudRouterTypes)
            {
                // Attempt to initialize using the default constructor
                try
                {
                    var instance = Activator.CreateInstance(crudRouterType);
                    var companyManRouter = instance as CompanyManRouter;
                    if (companyManRouter != null)
                    {
                        initializedRouters.Add(companyManRouter);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to initialize {crudRouterType.Name}: {ex.Message}");
                }
            }

            return initializedRouters.ToArray();
        }

        private static bool InheritsGenericCrudRouter(Type type, Type baseType)
        {
            // Check if the type directly inherits from the open generic base type
            while (type != null && type != typeof(object))
            {
                var currentType = type.IsGenericType ? type.GetGenericTypeDefinition() : type;
                if (currentType == baseType)
                {
                    return true;
                }
                if (type.BaseType != null)
                {
                    type = type.BaseType;
                }
            }
            return false;
        }
    }
}