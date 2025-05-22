using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

//Implementing the IMiddleware interface -> InvokeAsync method
//HttpContext gives us access to the http request and http response
//RequestDelegate is a delegate that represents a next middleware in the pipeline we will pass the request to

public class ExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);    //trying to pass the request down the pipeline
        }
        catch (ValidationException ex)  //catching exception from our validation behaviour middleware
        {
            await HandleValidationException(context, ex);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    private static async Task HandleValidationException(HttpContext context, ValidationException ex)
    {
        var validationErrors = new Dictionary<string, string[]>();

        if (ex.Errors is not null)
        {
            foreach (var error in ex.Errors)
            {
                if (validationErrors.TryGetValue(error.PropertyName, out var existingErrors))
                {
                    validationErrors[error.PropertyName] = existingErrors.Append(error.ErrorMessage).ToArray();
                }
                else
                {
                    validationErrors[error.PropertyName] = new[] { error.ErrorMessage };
                }

            }
        }

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        var validationProblemDetails = new ValidationProblemDetails(validationErrors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation Errors",
            Type = "ValidationFailure",
            Detail = "One or more validation errors occurred.",
        };

        await context.Response.WriteAsJsonAsync(validationProblemDetails);
    }
}


