using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Activities.DTOs;

//just the properties we need to create an activity
//this is a DTO (Data Transfer Object) that is used to transfer data between layers
public class CreateActivityDto
{
    //[Required] -> controller validation happens before the fluent validation in application layer, thus we remove the data annotation here
    public string Title { get; set; } = String.Empty;
    //[Required]
    public DateTime Date { get; set; }
    //[Required]
    public string Description { get; set; } = String.Empty;
    //[Required]
    public string Category { get; set; } = String.Empty;
    //[Required]
    public string City { get; set; } = String.Empty;
    //[Required]
    public string Venue { get; set; } = String.Empty;
    //[Required]
    public double Latitude { get; set; }
    //[Required]
    public double Longitude { get; set; }
}
