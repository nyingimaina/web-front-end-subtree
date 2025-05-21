using System.Linq.Expressions;
using Jattac.Apps.CompanyMan.ExceptionHandlingMiddleware;
using Jattac.Apps.CompanyMan.HttpHeaders;
using Rocket.Libraries.FormValidationHelper;

namespace Jattac.Apps.CompanyMan
{
    public static class Extensions
    {
        /// <summary>
        /// Throws a <see cref="ClientVisibleInformationException"/> if the given <see cref="ValidationResponse{TEntity}"/>
        /// contains any validation errors, using the first error message found.
        /// </summary>
        /// <typeparam name="TEntity">The type of the entity being validated.</typeparam>
        /// <param name="validationResponse">The validation response containing potential errors.</param>
        /// <exception cref="ClientVisibleInformationException">Thrown when the validation response has errors.</exception>
        public static void FailReportClientVisibleMessagesIfAny<TEntity>(this ValidationResponse<TEntity> validationResponse)
        {
            if (validationResponse.HasErrors)
            {
                throw new ClientVisibleInformationException(
                    message: validationResponse.ValidationErrors[0].Errors[0]
                );
            }
        }

        /// <summary>
        /// Gets the name of a parameter that can be used in a database query,
        /// given an expression that selects a property from the model.
        /// </summary>
        /// <remarks>
        /// The name of the parameter is the same as the name of the property.
        /// </remarks>
        /// <typeparam name="TModel">The type of the model.</typeparam>
        /// <typeparam name="TValue">The type of the property.</typeparam>
        /// <param name="model">The model.</param>
        /// <param name="propertyExpression">An expression that selects a property from the model.</param>
        /// <returns>The name of the parameter.</returns>
        public static string DbParamName<TModel, TValue>(
            this TModel model,
            Expression<Func<TModel, TValue>> propertyExpression)
            where TModel : Model
        {
            _ = model;
            return new ParameterNameCreator<TModel>().GetParameterName(propertyExpression);
        }

        public static DateTime ToClientTimezone(this DateTime dateTime, IStandardHeaderReader standardHeaderReader)
        {
            if (dateTime.Kind == DateTimeKind.Utc)
            {
                return dateTime.AddMinutes(standardHeaderReader.ClientTimezoneOffsetMinutes);
            }
            else if (dateTime.Kind == DateTimeKind.Local)
            {
                return dateTime.ToUniversalTime().AddMinutes(standardHeaderReader.ClientTimezoneOffsetMinutes);
            }
            else
            {
                return dateTime;
            }
        }

        public static DateTime ToSafeUniversal(this DateTime dateTime)
        {
            if (dateTime.Kind == DateTimeKind.Utc)
            {
                return dateTime;
            }
            else
            {
                return dateTime.ToUniversalTime();
            }
        }

        public static DateTime GetUtcEquivalent(this DateTime dateTime, string timezoneCode)
        {
            var timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneCode);
            return TimeZoneInfo.ConvertTimeToUtc(dateTime, timezone);
        }

        
    }
}