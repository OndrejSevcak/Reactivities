using System;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class DeleteActivity
{
    public class Command : IRequest<Result<Unit>>   //Unit is a type from MediatR that represents a void return type
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command, Result<Unit>>
    {
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activityToDelete = await context.Activities
                .FindAsync([request.Id], cancellationToken);

            //?? throw new Exception("Activity to delete not found"); -> not a good practice to throw exceptions for flow control

            if (activityToDelete == null)
            {
                return Result<Unit>.Failure("Activity not found", 404);
            }

            context.Activities.Remove(activityToDelete);
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
