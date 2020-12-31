using Domain;
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
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime Date { get; set; }
            public string Category { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
    }

    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            this._context = context;
        }
        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = new Activity
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                Category = request.Category,
                Date = request.Date,
                City = request.City,
                Venue = request.Venue
            };

            _context.Activities.Add(activity);
            var success = await _context.SaveChangesAsync(cancellationToken) > 0;
            //if saveChangesAsync == 0, then the save failed and something went wrong. Therefore, no activities were saved to the database.
            if (success)
                return Unit.Value;

            throw new Exception("Problem saving acitivity to the database!!");
        }
    }
}