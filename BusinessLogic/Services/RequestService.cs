using DataAccess.EntityFramework;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class RequestService : BaseService
    {
        private readonly ProiectPWEBContext Context;

        public RequestService(ServiceDependencies dependencies)
    : base(dependencies)
        {
            Context = new ProiectPWEBContext();
        }

        public async Task AddRequestToDb(SendRequestModel model)
        {
            var requestState = await Context.RequestStates.FirstOrDefaultAsync(x => x.State == "Pending");
            var interval = await Context.Intervals.FirstOrDefaultAsync(x => x.StartDate == model.StartDate && x.EndDate == model.EndDate);
            await ExecuteInTransaction(async uow =>
            {
                if (interval == null)
                {
                    interval = new Interval()
                    {
                        DateId = Guid.NewGuid(),
                        EndDate = model.StartDate,
                        StartDate = model.EndDate
                    };

                    uow.Intervals.Insert(interval);
                }

                var request = new Request()
                {
                    RequestId = Guid.NewGuid(),
                    OfferId = model.OfferId,
                    BorrowerId = CurrentUser.UserId,
                    StateId = requestState.StateId,
                    IntervalId = interval.DateId
                };

                uow.Requests.Insert(request);
                uow.SaveChanges();
            });
        }

        public async Task<List<ViewRequestModel>> GetReceivedRequests(Guid id)
        {
            return await Context.Requests
                .Include(x => x.Borrower)
                .Include(x => x.Interval)
                .Include(x => x.State)
                .Where(x => x.OfferId == id && x.State.State != "Refused")
                .Select(s => new ViewRequestModel
                {
                    OfferId = s.OfferId,
                    StartDate = s.Interval.StartDate,
                    EndDate = s.Interval.EndDate,
                    BorrowerName = s.Borrower.UserName,
                    State = s.State.State,
                    RequestId = s.RequestId
                })
                .ToListAsync();
        }

        public async Task<List<ViewRequestModel>> GetSentRequests(Guid id)
        {
            return await Context.Requests
                .Include(x => x.Borrower)
                .Include(x => x.Interval)
                .Include(x => x.State)
                .Where(x => x.OfferId == id && x.Borrower.UserName.Equals(CurrentUser.UserName))
                .Select(s => new ViewRequestModel
                {
                    OfferId = s.OfferId,
                    StartDate = s.Interval.StartDate,
                    EndDate = s.Interval.EndDate,
                    BorrowerName = s.Borrower.UserName,
                    State = s.State.State,
                    RequestId = s.RequestId
                })
                .ToListAsync();
        }

        public async Task<List<ViewRequestModel>> GetCurrUserRequests()
        {
            return await Context.Requests
               .Include(x => x.Borrower)
               .Include(x => x.Interval)
               .Include(x => x.State)
               .Where(x => x.BorrowerId == CurrentUser.UserId)
               .Select(s => new ViewRequestModel
               {
                   OfferId = s.OfferId,
                   StartDate = s.Interval.StartDate,
                   EndDate = s.Interval.EndDate,
                   BorrowerName = s.Borrower.UserName,
                   State = s.State.State,
                   RequestId = s.RequestId
               })
               .ToListAsync();
        }

        public async Task<List<Request>> GetRequests(Guid offerId)
        {
            return await Context.Requests.Include(x => x.State)
                .Where(r => r.OfferId == offerId)
                .ToListAsync();
        }

        public async Task<Guid> UpdateRequest(Guid requestId, string state)
        {
            var request = await Context.Requests.FirstOrDefaultAsync(x => x.RequestId == requestId);
            var offerId = request.OfferId;
            var requestState = await Context.RequestStates.FirstOrDefaultAsync(x => x.State == state);
            if (request != null && requestState != null)
            {
                request.StateId = requestState.StateId;
                await ExecuteInTransaction(async uow =>
                {
                    uow.Requests.Update(request);
                    uow.SaveChanges();
                });
            }

            return offerId;
        }

        public bool IsAnyRequestAccepted(List<Request> requests)
        {
            return requests.Any(r => r.State.State == "Accepted");
        }

        public async Task DeleteSentRequests(Guid offerId)
        {
            var requests = await Context.Requests.Include(x => x.State)
                .Where(r => r.OfferId == offerId && r.State.State != "Accepted" && r.BorrowerId == CurrentUser.UserId)
                .ToListAsync();
            if (requests.Count > 0)
            {
                await ExecuteInTransaction(async uow =>
                {
                    requests.ForEach(r => uow.Requests.Delete(r));
                    uow.SaveChanges();
                });
            }
        }

        public async Task<Guid> DeleteRequest(Guid requestId)
        {
            var request = await Context.Requests.FirstOrDefaultAsync(x => x.RequestId == requestId);
            var offerId = request.OfferId;
            if (request != null)
            {
                await ExecuteInTransaction(async uow =>
                {
                    uow.Requests.Delete(request);
                    uow.SaveChanges();
                });
            }

            return offerId;
        }

        public async Task<List<Interval>> GetUnavailableIntervals(Guid offerId)
        {
            return await Context.Requests.Include(x => x.State)
                .Include(r => r.Interval)
                .Where(r => r.OfferId == offerId && r.State.State == "Accepted")
                .Select(r => r.Interval)
                .ToListAsync();
        }
        public async Task<bool> CheckOverlappingIntervals(Interval interval,SendRequestModel model) => await Context.Requests.Include(x => x.State)
               .Include(r => r.Interval)
               .Where(r => r.OfferId == model.OfferId && r.State.State == "Accepted")
               .Select(r => r.Interval)
               .AnyAsync(x => (interval.StartDate <= x.StartDate && x.EndDate <= interval.EndDate) 
               && ( (model.StartDate <= x.StartDate && model.EndDate <= x.EndDate && x.StartDate <= model.EndDate) 
               || (model.StartDate <= x.StartDate && x.EndDate <= model.EndDate) 
               || (x.StartDate <= model.StartDate && model.EndDate <= x.EndDate) 
               || (x.StartDate <= model.StartDate && x.EndDate <= model.EndDate && model.StartDate <= x.EndDate) ) );
    }
}