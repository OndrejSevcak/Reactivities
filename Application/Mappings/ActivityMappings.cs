using System;
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
}
