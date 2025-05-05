using System;

namespace Domain;

public class Activity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();     //Id in name indicates that it is a primary key
    public required string Title { get; set; }
    public DateTime Date { get; set; }
    public required string Description { get; set; }    //required needs to be assigned during initialization
    public required string Category { get; set; }
    public bool IsCanceled { get; set; }

    public required string City { get; set; }
    public required string Venue { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}
