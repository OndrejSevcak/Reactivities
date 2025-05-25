using System;
using Application.Activities.DTOs;
using Domain;
using MediatR;
using Persistence;
using Application.Mappings;
using FluentValidation;
using Application.Core;

namespace Application.Activities.Commands;

// Separation of Concerns:
// The CQRS pattern separates the write operation (creating an activity) from the read operations (which would typically involve querying data). This separation makes the code more maintainable and scalable.

// MediatR:
// The use of MediatR (IRequest and IRequestHandler) is a common implementation detail for CQRS in .NET. It helps decouple the sender (e.g., a controller) from the handler logic.

public class CreateActivity
{
    //// The Command class represents a command in the CQRS pattern. Commands are used to encapsulate data and intent for performing a specific action, such as creating an activity in this case.
    public class Command : IRequest<Result<string>>
    {
        public required CreateActivityDto ActivityDto { get; set; }
    }

    // The Handler class is responsible for handling the Command. It implements the IRequestHandler<Command, string> interface from MediatR, which is a library commonly used to implement CQRS in .NET applications.
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<string>>
    {
        public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = request.ActivityDto.AsActivity();
            context.Activities.Add(activity); //adds the activity to the context -> so there is no need to use Async version

            //only here we communicate with the database
            var saved = await context.SaveChangesAsync(cancellationToken) > 0;
            if (!saved)
            {
                return Result<string>.Failure("Creating activity failed", 400);
            } 

            return Result<string>.Success(activity.Id); //returns the id of the activity that was created, because it is created server side
        }
    }
}
