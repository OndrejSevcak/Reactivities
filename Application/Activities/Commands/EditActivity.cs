using System;
using Application.Mappings;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Commands;

public class EditActivity
{
    public class Command : IRequest
    {
        public required Activity Activity { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities
                .FindAsync([request.Activity.Id], cancellationToken) 
                    ?? throw new Exception("Activity not found");

            activity.UpdateActivity(request.Activity); //update the activity with the new values, its a custom mapping helper method

            await context.SaveChangesAsync(cancellationToken); 
        }
    }
}
