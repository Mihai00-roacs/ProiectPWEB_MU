using DataAccess;
using DataAccess.EntityFramework;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class OfferService : BaseService
    {
        private readonly ProiectPWEBContext Context;

        public OfferService(ServiceDependencies dependencies)
    : base(dependencies)
        {
            Context = new ProiectPWEBContext();
        }

        public async Task AddColorsForAddOffer(AddOfferModel model)
        {
            model.Colors = new List<SelectListItem>();
            await Context.Colors.ForEachAsync(c => model.Colors.Add(new SelectListItem() { Text = c.ColorName, Value = c.ColorId.ToString() }));
        }

        public async Task AddTypesForAddOffer(AddOfferModel model)
        {
            model.Types = new List<SelectListItem>();
            await Context.Types.ForEachAsync(c => model.Types.Add(new SelectListItem() { Text = c.TypeName, Value = c.TypeId.ToString() }));
        }

        public async Task AddSizesForAddOffer(AddOfferModel model)
        {
            model.Sizes = new List<SelectListItem>();
            await Context.Sizes.ForEachAsync(c => model.Sizes.Add(new SelectListItem() { Text = c.SizeName, Value = c.SizeId.ToString() }));
        }

        public async Task AddProducersForAddOffer(AddOfferModel model)
        {
            model.Producers = new List<SelectListItem>();
            await Context.Producers.ForEachAsync(c => model.Producers.Add(new SelectListItem() { Text = c.ProducerName, Value = c.ProducerId.ToString() }));
        }
        public Offer GetOfferFromModel(AddOfferModel model)
        {
            return Mapper.Map<Offer>(model);
        }
        public async Task<Guid> AddNewOffer(AddOfferModel model)
        {
            var offer = Mapper.Map<Offer>(model);
            ExecuteInTransaction(uow =>
            {
                var position = uow.Positions.Insert(offer.Position);
                offer.PositionId = position.PositionId;
                offer.OwnerId = CurrentUser.UserId;
                offer.OfferId = uow.Offers.Insert(offer).OfferId;
                uow.SaveChanges();
            });
            return offer.OfferId;
        }
       
        public async Task<Interval?> GetAvailableInterval(SendRequestModel model)
        {
            var xz = await Context.Offers.Include(x => x.Dates).Where(x => x.OfferId == model.OfferId).Select(x => x.Dates).FirstOrDefaultAsync();
            if(xz == null)
            {
                return null;
            }
            return xz.Where(x => x.StartDate <= model.StartDate && model.EndDate <= x.EndDate).FirstOrDefault();
        }
        public async Task AddIntervalToDatabase(Guid offerId, DateTime startDate, DateTime endDate)
        {
            var offer=await Context.Offers.Include(x => x.Dates).Where(x => x.OfferId==offerId).FirstOrDefaultAsync();
            ExecuteInTransaction(uow =>
            {
                var interval = new Interval()
                {
                    DateId = Guid.NewGuid(),
                    EndDate = endDate,
                    StartDate = startDate,
                };
                var offerInterval = new OfferAvailableInterval()
                {
                    DateId = interval.DateId,
                    OfferId = offerId
                };
                uow.Intervals.Insert(interval);
                offer.Dates.Add(interval);
                uow.Offers.Update(offer);
   /*             uow.OfferInterval.Insert(offerInterval);*/
                uow.SaveChanges();
            });

        }

        public async Task<List<OfferDetailsModel>> GenerateOffersPerPage(int page, int size)
        {
            return await Context.Offers
                .Include(x => x.Color)
                .Include(x => x.Owner)
                .Include(x => x.Producer)
                .Include(x => x.Size)
                .Include(x => x.Type)
                .Include(x => x.Position)
                .Where(x => x.OwnerId != CurrentUser.UserId)
                .Skip(page * 20)
                .Take(20)
                .Select(s => new OfferDetailsModel
                {
                    OfferId = s.OfferId,
                    ColorName = s.Color.ColorName,
                    Description = s.Description,
                    Milleage = s.Milleage,
                    OwnerName = s.Owner.UserName,
                    ProducerName = s.Producer.ProducerName,
                    SizeName = s.Size.SizeName,
                    TypeName = s.Type.TypeName,
                    XCoordinate=s.Position.Xcoordinate,
                    YCoordinate=s.Position.Ycoordinate,
                    Year = s.Year
                })
                .ToListAsync();
        }

        public async Task<List<OfferDetailsModel>> GetMyOffers(int page, int size)
        {
            return await Context.Offers
                .Where(x => x.OwnerId == CurrentUser.UserId)
                .Include(x => x.Owner)
                .Include(x => x.Color)
                .Include(x => x.Producer)
                .Include(x => x.Size)
                .Include(x => x.Type)
                .Select(s => new OfferDetailsModel
                {
                    OfferId = s.OfferId,
                    ColorName = s.Color.ColorName,
                    Description = s.Description,
                    Milleage = s.Milleage,
                    OwnerName = s.Owner.UserName,
                    ProducerName = s.Producer.ProducerName,
                    SizeName = s.Size.SizeName,
                    TypeName = s.Type.TypeName,
                    Year = s.Year
                })
                .ToListAsync();
        }

        public async Task<Offer?> GetOffer(Guid id)
        {
            return await Context.Offers.Include(x => x.Color)
                .Include(x => x.Owner)
                .Include(x => x.Producer)
                .Include(x => x.Size)
                .Include(x => x.Type)
                .FirstOrDefaultAsync(x => x.OfferId == id);
        }

        public async Task<OfferDetailsModel> GetOfferDetailsModel(Guid id)
        {
            var offer = await GetOffer(id);
            var offerDetailsModel = new OfferDetailsModel();
            Mapper.Map<Offer, OfferDetailsModel>(offer, offerDetailsModel);
            return offerDetailsModel;
        }

        public async Task<AddOfferModel> GetAddOfferModel(Guid id)
        {
            var offer = await GetOffer(id);
            var addOfferModel = new AddOfferModel();
            Mapper.Map<Offer, AddOfferModel>(offer, addOfferModel);
            return addOfferModel;
        }

        public async Task EditOffer(AddOfferModel model)
        {
            var offer = await Context.Offers.FirstOrDefaultAsync(x => x.OfferId == model.OfferId);
            ExecuteInTransaction(uow =>
            {
                if (offer != null)
                {
                    Mapper.Map<AddOfferModel, Offer>(model, offer);
                    uow.Offers.Update(offer);
                }
                uow.SaveChanges();
            });
        }

        public async Task<List<OfferDetailsModel>> GetSentOffers(List<ViewRequestModel> list)
        {
            var sentOffers = new HashSet<OfferDetailsModel>();
            foreach (ViewRequestModel model in list)
            {
                var offer = await GetOffer(model.OfferId);
                if (offer != null)
                {
                    OfferDetailsModel offerModel = new OfferDetailsModel();
                    Mapper.Map<Offer, OfferDetailsModel>(offer, offerModel);
                    sentOffers.Add(offerModel);
                }
            }

            return sentOffers.ToList();
        }

     /*   public async Task DeleteOffer(Guid offerId, List<Request> requests)
        {
            var offer = await GetOffer(offerId);
            var availableIntervals = await Context.Offers.Where(a => a.OfferId == offerId)
                .ToListAsync();

            if (offer != null)
            {
                await ExecuteInTransaction(async uow =>
                {
                    if (requests.Count > 0)
                    {
                        requests.ForEach(r => uow.Requests.Delete(r));
                    }

                    if (availableIntervals.Count > 0)
                    {
                        availableIntervals.ForEach(a => uow.OfferInterval.Delete(a));
                    }

                    uow.Offers.Delete(offer);
                    uow.SaveChanges();
                });
            }
        }*/

        public async Task<List<Interval>> GetAvailableIntervals(Guid offerId)
        {
            return (await Context.Offers.Where(a => a.OfferId == offerId)
                .Include(a => a.Dates)
                .Select(a => a.Dates)
                .ToListAsync()).SelectMany(x => x).ToList();
        }

        public async Task<List<SelectListItem>> AddColorsForAddOffer(string text) => await Context.Colors.Where(x => x.ColorName != null && x.ColorName.StartsWith(text)).Take(10).Select(x => new SelectListItem()
        {
            Text = x.ColorName,
            Value = x.ColorId.ToString()
        }).ToListAsync();

        public async Task<List<SelectListItem>> AddProducersForAddOffer(string text) => await Context.Producers.Where(x => x.ProducerName != null && x.ProducerName.StartsWith(text)).Take(10).Select(x => new SelectListItem()
        {
            Text = x.ProducerName,
            Value = x.ProducerId.ToString()
        }).ToListAsync();

        public async Task<List<Position>> GetAllPoints()
        {
            return await Context.Positions.ToListAsync();
        }

        public async Task<OfferDetailsModel> GetOfferById(Guid offerId)
        {
            var offer = await Context.Offers
                .Include(x => x.Color)
                .Include(x => x.Owner)
                .Include(x => x.Producer)
                .Include(x => x.Size)
                .Include(x => x.Type)
                .Include(x => x.Position)
                .FirstOrDefaultAsync(x => x.OfferId == offerId);

            if (offer == null)
            {
                throw new KeyNotFoundException($"Offer with ID {offerId} not found.");
            }

            var offerDetailsModel = new OfferDetailsModel();
            Mapper.Map(offer, offerDetailsModel);
            return offerDetailsModel;
        }

        public int GetOffersSize()
        {
            return Context.Offers.Count(x => x.OwnerId != CurrentUser.UserId);
        }

        public int GetSelfOffersSize()
        {
            return Context.Offers.Count(x => x.OwnerId == CurrentUser.UserId);
        }

        public async Task<int> GetBorrowedCarsOffersSizeAsync(List<ViewRequestModel> requests)
        {
            var borrowedCarOfferIds = requests.Select(r => r.OfferId).ToList();
            return await Context.Offers.CountAsync(x => borrowedCarOfferIds.Contains(x.OfferId));
        }

        public async Task<List<SelectListItem>> AddTypesForAddOffer(string search)
        {
            return await Context.Types
                .Where(x => x.TypeName != null && x.TypeName.StartsWith(search))
                .Take(10)
                .Select(x => new SelectListItem
                {
                    Text = x.TypeName,
                    Value = x.TypeId.ToString()
                })
                .ToListAsync();
        }

        public async Task<List<SelectListItem>> AddSizesForAddOffer()
        {
            return await Context.Sizes
                .Select(x => new SelectListItem
                {
                    Text = x.SizeName,
                    Value = x.SizeId.ToString()
                })
                .ToListAsync();
        }
    }
}
