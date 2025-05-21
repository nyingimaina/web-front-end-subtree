namespace Jattac.Apps.CompanyMan
{


    public static class ParallelTaskExecutor
    {
        public static async Task<IReadOnlyList<TResult>> ExecuteTypedTasksAsync<TResult>(
            IEnumerable<Task<TResult>> tasks,
            int maxDegreeOfParallelism = 0,
            CancellationToken cancellationToken = default)
        {
            if (tasks == null)
            {
                throw new ArgumentNullException(nameof(tasks));
            }

            var taskList = tasks.Select(task => new Func<Task<object>>(() => Task.FromResult<object>(task.Result!))).ToList();

            var unTypedResults = await ExecuteTasksAsync(
                tasks: taskList,
                maxDegreeOfParallelism: maxDegreeOfParallelism,
                cancellationToken: cancellationToken
            );

            return unTypedResults.Select(result => (TResult)result).ToArray();
        }

        public static async Task<IReadOnlyList<object>> ExecuteTasksAsync(
            IEnumerable<Func<Task<object>>> tasks,
            int maxDegreeOfParallelism = 0,
            CancellationToken cancellationToken = default)
        {
            if (tasks == null)
                throw new ArgumentNullException(nameof(tasks));

            if (maxDegreeOfParallelism < 0)
                throw new ArgumentOutOfRangeException(nameof(maxDegreeOfParallelism), "Must be non-negative.");

            var taskList = tasks.Select((task, index) => (TaskFunc: task, Index: index)).ToList();
            var results = new object[taskList.Count];
            var exceptions = new List<Exception>();

            // A semaphore to limit parallelism
            using var semaphore = new SemaphoreSlim(maxDegreeOfParallelism > 0 ? maxDegreeOfParallelism : taskList.Count);

            // Create tasks
            var tasksToRun = taskList.Select(async t =>
            {
                await semaphore.WaitAsync(cancellationToken).ConfigureAwait(false);
                try
                {
                    // Execute the task
                    object result = await ExecuteWithRetriesAsync(t.TaskFunc, cancellationToken);
                    results[t.Index] = result; // Store result at the correct index
                }
                catch (Exception ex)
                {
                    lock (exceptions)
                    {
                        exceptions.Add(ex); // Collect exceptions
                    }
                }
                finally
                {
                    semaphore.Release();
                }
            }).ToList();

            // Await all tasks
            await Task.WhenAll(tasksToRun).ConfigureAwait(false);

            // Check for exceptions and throw if any
            if (exceptions.Count > 0)
            {
                throw new AggregateException("One or more tasks failed.", exceptions);
            }

            return results;
        }

        private static async Task<TResult> ExecuteWithRetriesAsync<TResult>(
            Func<Task<TResult>> taskFunc,
            CancellationToken cancellationToken,
            int maxRetries = 3)
        {
            int retries = 0;

            while (true)
            {
                try
                {
                    return await taskFunc().ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    if (retries >= maxRetries)
                    {
                        throw; // Rethrow after max retries
                    }
                    retries++;
                    await Task.Delay(1000 * retries, cancellationToken); // Exponential backoff
                }
            }
        }
    }
}