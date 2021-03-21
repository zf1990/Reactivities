using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Persistance;
using System;
using System.ComponentModel;
using System.Security.Authentication;
using System.Threading;
using System.Threading.Tasks;
using static Application.Activities.Create;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            this._context = context;
        }
        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            _context.Activities.Add(request.Activity);
            await _context.SaveChangesAsync(cancellationToken);
            //if saveChangesAsync == 0, then the save failed and something went wrong. Therefore, no activities were saved to the database.
            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!success)
                return Result<Unit>.Failure("Failed to create activity");

            return Result<Unit>.Success(Unit.Value);

            //throw new Exception("Oh fuck, something went wrong with cerating the activity.");
        }
    }
}