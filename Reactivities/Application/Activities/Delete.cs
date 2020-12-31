using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                //Create activities here
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new Exception("Cannot find the activity in question");

                _context.Activities.Remove(activity);
                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                //if saveChangesAsync == 0, then the save failed and something went wrong. Therefore, no activities were saved to the database.
                if (success)
                    return Unit.Value;

                throw new Exception("Something went wrong with deleting this event.");
            }
        }
    }
}