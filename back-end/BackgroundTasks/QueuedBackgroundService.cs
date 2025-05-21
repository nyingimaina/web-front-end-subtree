using Jattac.Apps.CompanyMan.ViewInvoiceRepetitionTracking;

namespace Jattac.Apps.CompanyMan.BackgroundTasks
{

    public class QueuedBackgroundService : BackgroundService
    {
        private const string RecurringInvoiceGeneration = "Recurring Invoice Generation";
        private readonly IBackgroundTaskQueue taskQueue;
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<QueuedBackgroundService> logger;
        private readonly List<BackgroundTaskState> State = new();

        public QueuedBackgroundService(
            IBackgroundTaskQueue taskQueue,
            IServiceProvider serviceProvider,
            ILogger<QueuedBackgroundService> logger)
        {
            this.taskQueue = taskQueue;
            this.serviceProvider = serviceProvider;
            this.logger = logger;
            QueueTasks();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var workItem = await taskQueue.DequeueAsync(stoppingToken);

                // Create a new scope for each background task
                using (var scope = serviceProvider.CreateScope())
                {
                    var scopedProvider = scope.ServiceProvider;

                    try
                    {
                        await workItem(scopedProvider, stoppingToken); // Execute the work item
                    }
                    catch (Exception ex)
                    {
                        // Log the exception
                        logger.LogError(ex, "An error occurred while processing the background task.");
                        // Optionally, rethrow or handle differently based on your needs
                    }
                }
            }
        }

        private void QueueTasks()
        {
            QueueRecurringInvoiceGeneration();
        }

        private void QueueWithInterval(Func<Task> task, TimeSpan interval, CancellationToken stoppingToken, string displayLabel)
        {
            var taskState = new BackgroundTaskState
            {
                DisplayLabel = displayLabel,
                LastRun = DateTime.MinValue,
                Interval = interval,
            };

            lock (State)
            {
                if (State.Count >= 100) // Limit the State list to 100 entries
                {
                    State.RemoveAt(0); // Remove the oldest entry
                }
                State.Add(taskState);
            }

            Task.Run(async () =>
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        taskState.LastRun = DateTime.UtcNow;
                        await task();
                    }
                    catch (Exception ex)
                    {
                        taskState.LastException = ex;
                        logger.LogError(ex, $"An error occurred in the task: {displayLabel}");
                    }

                    try
                    {
                        await Task.Delay(interval, stoppingToken);
                    }
                    catch (TaskCanceledException)
                    {
                        // Gracefully exit if the task is canceled
                        break;
                    }
                }
            }, stoppingToken); // Pass stoppingToken to Task.Run to ensure proper cancellation
        }

        private void QueueRecurringInvoiceGeneration()
        {
            QueueWithInterval(async () =>
            {
                try
                {
                    using (var scope = serviceProvider.CreateScope())
                    {
                        var recurringInvoiceGenerator = scope.ServiceProvider.GetRequiredService<IRecurringInvoiceGenerator>();
                        await recurringInvoiceGenerator.GenerateAsync();
                    }
                }
                catch (Exception e)
                {
                    Program.ErrorLogger.Log(e);
                }
            }, TimeSpan.FromSeconds(5), new CancellationTokenSource().Token, RecurringInvoiceGeneration); // Use a new CancellationTokenSource to manage cancellation
        }

        
    }
}