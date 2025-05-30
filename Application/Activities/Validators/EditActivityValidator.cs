using System;
using Application.Activities.Commands;
using Application.Activities.DTOs;
using FluentValidation;

namespace Application.Activities.Validators;

public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActivityDto>
{
    public EditActivityValidator() : base(x => x.ActivityDto)   //ActivityDto is the only property in the EditActivity command
    {
        //specific validation rules for EditActivity command
        RuleFor(x => x.ActivityDto.Id)
            .NotEmpty().WithMessage("Activity ID is required.");
    }

}
