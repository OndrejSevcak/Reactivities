using System;
using Application.Activities.DTOs;
using Application.Core;
using Application.Mappings;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    //ccommand class represents the request to edit an activity
    public class Command : IRequest<Result<Unit>>
    {
        public required EditActivityDto ActivityDto { get; set; }
    }

    //The Handler class is responsible for processing the command.
    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activityFromDb = await context.Activities
                .FindAsync([request.ActivityDto.Id], cancellationToken);

            if (activityFromDb == null)
            {
                return Result<Unit>.Failure("Activity not found", 404);
            }

            activityFromDb.UpdateActivity(request.ActivityDto); //update the activity with the new values, its a custom mapping helper method

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
