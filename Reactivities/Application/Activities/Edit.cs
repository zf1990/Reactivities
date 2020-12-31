using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            //Create the edit
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime? Date { get; set; }
            public string Category { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {

            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new Exception("This activity is not found!!");

                activity.Title = request.Title ?? activity.Title;
                activity.Category = request.Category ?? activity.Category;
                activity.City = request.City ?? activity.City;
                activity.Description = request.Description ?? activity.Description;
                activity.Venue = request.Venue ?? activity.Venue;
                activity.Date = request.Date ?? activity.Date;

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (success)
                    return Unit.Value;

                throw new Exception("Oh fuck, something went wrong with the edit.");


            }
        }
    }
}