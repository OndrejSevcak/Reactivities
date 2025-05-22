using System;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities.Queries;

public class GetActivityDetails
{
    //Here we define an Id query parameter to be passed to the handler
    public class Query : IRequest<Result<Activity>> //here we specify the return type, in our case its a Result<Activity>
    {
        public required string Id { get; set; }
    }

    public class Handler(AppDbContext context) : IRequestHandler<Query, Result<Activity>>
    {
        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await context.Activities.FindAsync([request.Id], cancellationToken);

            //instead of throwing and excpetion we return a Result object with the error message and code
            if(activity == null) return Result<Activity>.Failure("Activity not found", 404);

            //returning the activity object
            return Result<Activity>.Success(activity); 
        }
    }
}
