using DataAccess.Models;
using Type = DataAccess.Models.Type;


namespace DataAccess
{
    public class UnitOfWork
    {
        private readonly ProiectPWEBContext Context;

        public UnitOfWork(ProiectPWEBContext context)
        {
            Context = context;
        }

        private IRepository<User> users;
        public IRepository<User> Users => users ??= new BaseRepository<User>(Context);

        private IRepository<Interval> intervals;
        public IRepository<Interval> Intervals => intervals ??= new BaseRepository<Interval>(Context);

        private IRepository<Offer> offers;
        public IRepository<Offer> Offers => offers ??= new BaseRepository<Offer>(Context);

        private IRepository<City> cities;
        public IRepository<City> Cities => cities ??= new BaseRepository<City>(Context);

        private IRepository<Color> colors;
        public IRepository<Color> Colors => colors ??= new BaseRepository<Color>(Context);

        private IRepository<Producer> producers;
        public IRepository<Producer> Producers => producers ??= new BaseRepository<Producer>(Context);

        private IRepository<Request> requests;
        public IRepository<Request> Requests => requests ??= new BaseRepository<Request>(Context);

        private IRepository<RequestState> requestsStates;
        public IRepository<RequestState> RequestsStates => requestsStates ??= new BaseRepository<RequestState>(Context);

        private IRepository<Size> sizes;
        public IRepository<Size> Sizes => sizes ??= new BaseRepository<Size>(Context);

        private IRepository<Type> types;
        public IRepository<Type> Types => types ??= new BaseRepository<Type>(Context);

        private IRepository<Position> positions;
        public IRepository<Position> Positions => positions ??= new BaseRepository<Position>(Context);
        private IRepository<Interval> offerInterval;
        public IRepository<Interval> OfferInterval => offerInterval ??= new BaseRepository<Interval>(Context);


        public void SaveChanges()
        {
            Context.SaveChanges();
        }
    }
}
