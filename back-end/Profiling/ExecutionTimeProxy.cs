using System.Diagnostics;
using System.Reflection;

namespace Jattac.Apps.CompanyMan.Profiling
{
    public class ExecutionTimeProxy<T> : DispatchProxy, IDisposable
    {
        private T? _decorated;
        private bool _measureAllMethods;
        private bool _logSummary;
        private bool _trackSlowest;

        private const int MaxRecords = 100;
        private static readonly SortedList<long, string> ExecutionLog = new();
        private static readonly Dictionary<string, (int Count, long TotalTime, long MaxTime, long MinTime)> ExecutionSummary = new();

        public static T Create(T decorated)
        {
            if (decorated == null) throw new ArgumentNullException(nameof(decorated));

            object? proxy = Create<T, ExecutionTimeProxy<T>>();
            if (proxy == null)
            {
                throw new Exception($"Unable to proxy {decorated.GetType()}");
            }

            var proxyInstance = (ExecutionTimeProxy<T>)proxy;
            proxyInstance._decorated = decorated;

            var classAttr = decorated.GetType().GetCustomAttribute<MeasureExecutionTimeAttribute>();

            proxyInstance._measureAllMethods = classAttr != null;
            proxyInstance._logSummary = classAttr?.LogSummary ?? false;
            proxyInstance._trackSlowest = classAttr?.TrackSlowest ?? false;

            return (T)proxy;
        }

        protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
        {
            if (targetMethod == null) throw new ArgumentNullException(nameof(targetMethod));

            bool shouldMeasure = _measureAllMethods || targetMethod.GetCustomAttribute<MeasureExecutionTimeAttribute>() != null;
            if (!shouldMeasure)
            {
                return targetMethod.Invoke(_decorated, args);
            }

            var returnType = targetMethod.ReturnType;

            if (typeof(Task).IsAssignableFrom(returnType))
            {
                return HandleAsyncMethod(targetMethod, args, returnType);
            }
            else
            {
                return HandleSyncMethod(targetMethod, args);
            }
        }

        private object HandleAsyncMethod(MethodInfo targetMethod, object?[]? args, Type returnType)
        {
            var stopwatch = Stopwatch.StartNew();
            object? taskObj = targetMethod.Invoke(_decorated, args);

            if (taskObj is Task task)
            {
                return AwaitTaskProperly(task, targetMethod, stopwatch, returnType);
            }

            Log(LogType.Error, $"Method {targetMethod.Name} did not return a Task.");
            return null!;
        }

        private object AwaitTaskProperly(Task task, MethodInfo method, Stopwatch stopwatch, Type returnType)
        {
            if (returnType.IsGenericType && returnType.GetGenericTypeDefinition() == typeof(Task<>))
            {
                // Extract T from Task<T>
                Type taskResultType = returnType.GetGenericArguments()[0];

                MethodInfo handleGenericTaskMethod = typeof(ExecutionTimeProxy<T>)
                    .GetMethod(nameof(HandleGenericTask), BindingFlags.NonPublic | BindingFlags.Instance)!
                    .MakeGenericMethod(taskResultType);

                return handleGenericTaskMethod.Invoke(this, new object[] { task, method, stopwatch })!;
            }
            else
            {
                return HandleVoidTask(task, method, stopwatch);
            }
        }

        private async Task HandleVoidTask(Task task, MethodInfo method, Stopwatch stopwatch)
        {
            try
            {
                await task.ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                Log(LogType.Error, $"Exception in {method.Name}: {ex}");
                throw;
            }
            finally
            {
                LogExecutionTime(method, stopwatch.ElapsedMilliseconds);
            }
        }

        private async Task<TOut> HandleGenericTask<TOut>(Task task, MethodInfo method, Stopwatch stopwatch)
        {
            try
            {
                var genericTask = (Task<TOut>)task;
                TOut result = await genericTask.ConfigureAwait(false);
                return result;
            }
            catch (Exception ex)
            {
                Log(LogType.Error, $"Exception in {method.Name}: {ex}");
                throw;
            }
            finally
            {
                LogExecutionTime(method, stopwatch.ElapsedMilliseconds);
            }
        }

        private object? HandleSyncMethod(MethodInfo targetMethod, object?[]? args)
        {
            var stopwatch = Stopwatch.StartNew();
            object? result = targetMethod.Invoke(_decorated, args);
            LogExecutionTime(targetMethod, stopwatch.ElapsedMilliseconds);
            return result;
        }

        private void LogExecutionTime(MethodInfo method, long elapsedMs)
        {
            string methodName = method.DeclaringType != null ? $"{method.DeclaringType.Name}.{method.Name}" : method.Name;
            Log(LogType.Info, $"Method {methodName} took {elapsedMs} ms");

            if (_trackSlowest)
            {
                AddToExecutionLog(methodName, elapsedMs);
            }
            if (_logSummary)
            {
                AddToExecutionSummary(methodName, elapsedMs);
            }
        }

        private static void AddToExecutionLog(string methodName, long executionTime)
        {
            lock (ExecutionLog)
            {
                ExecutionLog.Add(executionTime, methodName);
                if (ExecutionLog.Count > MaxRecords)
                {
                    ExecutionLog.RemoveAt(0);
                }
            }
        }

        private static void AddToExecutionSummary(string methodName, long executionTime)
        {
            lock (ExecutionSummary)
            {
                if (ExecutionSummary.TryGetValue(methodName, out var stats))
                {
                    ExecutionSummary[methodName] = (stats.Count + 1, stats.TotalTime + executionTime, Math.Max(stats.MaxTime, executionTime),Math.Min(stats.MaxTime, executionTime));
                }
                else
                {
                    ExecutionSummary[methodName] = (1, executionTime, executionTime,executionTime);
                }
            }
        }

        public static void PrintSummary()
        {
            if (ExecutionSummary.Any())
            {
                Log(LogType.Section, "\nExecution Summary:");
                Log(LogType.Section, "-------------------------------------------");
                Log(LogType.Section, "| Method Name         | Count |  Avg ms  | Min ms | Max ms |");
                Log(LogType.Section, "-------------------------------------------");

                foreach (var entry in ExecutionSummary)
                {
                    var avgTime = entry.Value.TotalTime / entry.Value.Count;
                    Log(LogType.Section, $"| {entry.Key,-18} | {entry.Value.Count,5} | {avgTime,7} ms | {entry.Value.MinTime,6} ms | {entry.Value.MaxTime,6} ms |");
                }
                Log(LogType.Section, "-------------------------------------------");
            }
        }

        public static void PrintSlowestSummary()
        {
            if (ExecutionLog.Any())
            {
                Log(LogType.Section, "\nTop Execution Times (Slowest):");
                Log(LogType.Section, "-----------------------------");

                foreach (var entry in ExecutionLog.Reverse())
                {
                    Log(LogType.Section, $"| {entry.Value,-20} | {entry.Key,6} ms |");
                }
                Log(LogType.Section, "-----------------------------");
            }
        }

        public void Dispose()
        {
            if (_logSummary)
            {
                PrintSummary();
            }

            if (_trackSlowest)
            {
                PrintSlowestSummary();
            }
        }

        private static void Log(LogType logType, string message)
        {
            ConsoleColor color = logType switch
            {
                LogType.Info => ConsoleColor.DarkMagenta,
                LogType.Warning => ConsoleColor.Yellow,
                LogType.Error => ConsoleColor.Red,
                LogType.Section => ConsoleColor.Cyan,
                _ => ConsoleColor.White
            };

            var logTime = DateTime.Now.ToString("HH:mm:ss.fff");

            Console.ForegroundColor = color;
            Console.WriteLine($"{logTime}: {message}");
            Console.ResetColor();
        }


        private enum LogType
        {
            Info,
            Warning,
            Error,
            Section
        }
    }
}
