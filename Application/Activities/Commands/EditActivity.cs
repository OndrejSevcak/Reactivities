using System;
using Application.Core;
using Application.Mappings;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest<Result<Unit>>
    {
        public required Activity Activity { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .FindAsync([request.Activity.Id], cancellationToken);
            //?? throw new Exception("Activity not found");

            if (activity == null)
            {
                return Result<Unit>.Failure("Activity not found", 404);
            }

            activity.UpdateActivity(request.Activity); //update the activity with the new values, its a custom mapping helper method
            var inserted = await context.SaveChangesAsync(cancellationToken) > 0;

            if (inserted)
            {
                return Result<Unit>.Success(Unit.Value);
            }
            else
            {
                return Result<Unit>.Failure("Deleting activity failed", 400);
            } 
        }
    }
}
