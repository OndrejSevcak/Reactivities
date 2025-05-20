using System;
using Application.Activities.DTOs;
using Domain;

namespace Application.Mappings;

public static class ActivityMappings
{
    public static Activity UpdateActivity(this Activity activity, Activity updatedActivity)
    {
        if (updatedActivity == null) throw new ArgumentNullException(nameof(updatedActivity));

        activity.Title = updatedActivity.Title;
        activity.Date = updatedActivity.Date;
        activity.Description = updatedActivity.Description;
        activity.Category = updatedActivity.Category;
        activity.IsCanceled = updatedActivity.IsCanceled;
        activity.City = updatedActivity.City;
        activity.Venue = updatedActivity.Venue;
        activity.Latitude = updatedActivity.Latitude;
        activity.Longitude = updatedActivity.Longitude;

        return activity;
    }
    
    public static Activity AsActivity(this CreateActivityDto activityDto)
    {
        if (activityDto == null) throw new ArgumentNullException(nameof(activityDto));

        return new Activity
        {
            Title = activityDto.Title,
            Date = activityDto.Date,
            Description = activityDto.Description,
            Category = activityDto.Category,
            City = activityDto.City,
            Venue = activityDto.Venue,
            Latitude = activityDto.Latitude,
            Longitude = activityDto.Longitude
        };
    }
}
