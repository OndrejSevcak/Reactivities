using System;
using FluentValidation;
using MediatR;

namespace Application.Core;

//Request validation middleware
//-> injecting IValidator from FluentValidation
//-> implementing IPipelineBehaviour (handle method) from MediatR
//-> has to be added to the MediatR configuration in the Program.cs(API solution) file as AddOpenBehavior

public class ValidationBehaviour<TRequest, TResponse>(IValidator<TRequest>? validator = null)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (validator == null) return await next();

        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        return await next();
    }
}
