using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                //Create activities here
                var activity = await _context.Activities.FindAsync(request.Id);

                // if (activity == null)
                //     return null;

                _context.Activities.Remove(activity);
                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                //if saveChangesAsync == 0, then the save failed and something went wrong. Therefore, no activities were saved to the database.

                if (!success)
                    return Result<Unit>.Failure("Failed to delete activity");

                return Result<Unit>.Success(Unit.Value);


            }
        }
    }
}