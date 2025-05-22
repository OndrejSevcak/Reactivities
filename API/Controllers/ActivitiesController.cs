using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
    {
        //return await context.Activities.ToListAsync();        
        return await Mediator.Send(new GetActivityList.Query(), ct); //sends the query to the mediator, which will handle it and return the result
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivity(string id)
    {
        // var activity = await context.Activities.FindAsync(id);  //finds entity by primary key        
        // if (activity == null) return NotFound(); //returns 404         
        // return activity;

        //HandleResult is BaseApiController method that handles the result of the query
        return HandleResult(await Mediator.Send(new GetActivityDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activityDto)
    {
        return await Mediator.Send(new CreateActivity.Command { ActivityDto = activityDto});
    }

    [HttpPut]
    public async Task<ActionResult> EditActivity(Activity activity)
    {
        await Mediator.Send(new EditActivity.Command { Activity = activity});
        return NoContent(); //returns 204 No Content
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        await Mediator.Send(new DeleteActivity.Command { Id = id});
        return Ok();    //returns 200 OK
    }
}
