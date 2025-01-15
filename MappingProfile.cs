using AutoMapper;
using BusinessLogic;
using DataAccess.Models;

namespace ProiectPWEB_MU
{
    public class MappingProfile : Profile
    {
        public MappingProfile() {
            CreateMap<User, CurrentUserDTO>();
            CreateMap<CurrentUserDTO, User>();
            CreateMap<RegisterModel, User>();
            CreateMap<AddOfferModel, Offer>()
                .ForMember(a => a.Position, a => a.MapFrom(s => new Position()
                {
                    Xcoordinate = s.Xcoordinate,
                    Ycoordinate = s.Ycoordinate,
                    PositionId = Guid.NewGuid()
                }))
                .ForMember(a => a.OfferId, a => a.MapFrom(s => Guid.NewGuid()) );
           // CreateMap<AddOfferModelWithPoints, Offer>();
            CreateMap<Offer, AddOfferModel>();
            CreateMap<Offer, OfferDetailsModel>()
                .ForMember(a => a.ProducerName, a => a.MapFrom(s => s.Producer.ProducerName))
                .ForMember(a => a.ColorName, a => a.MapFrom(s => s.Color.ColorName))
                .ForMember(a => a.TypeName, a => a.MapFrom(s => s.Type.TypeName))
                .ForMember(a => a.SizeName, a => a.MapFrom(s => s.Size.SizeName))
                .ForMember(a => a.OwnerName, a => a.MapFrom(s => s.Owner.UserName));
            CreateMap<OfferDetailsModel, Offer>();
            CreateMap<Interval, AddOfferIntervalsModel>();
            CreateMap<AddOfferIntervalsModel, Interval>();
            CreateMap<User, UserProfileModel>()
               .ForMember(a => a.Email, a => a.MapFrom(s => s.Email))
               .ForMember(a => a.FirstName, a => a.MapFrom(s => s.FirstName))
               .ForMember(a => a.LastName, a => a.MapFrom(s => s.LastName))
               .ForMember(a => a.UserId, a => a.MapFrom(s => s.UserId))
               .ForMember(a => a.UserName, a => a.MapFrom(s => s.UserName))
               .ForMember(a => a.City, a => a.MapFrom(s => s.City.Nume))
               .ForMember(a => a.PhoneNumber, a => a.MapFrom(s => s.PhoneNumber))
               .ForMember(a => a.Password, a => a.MapFrom(s => s.Password))
               .ForMember(a => a.Photo, a => a.MapFrom(s => "data:image/gif;base64," + Convert.ToBase64String(s.Photo)));
            CreateMap<UserProfileModel, User>()
                .ForMember(a => a.Email, a => a.MapFrom(s => s.Email))
                .ForMember(a => a.FirstName, a => a.MapFrom(s => s.FirstName))
                .ForMember(a => a.LastName, a => a.MapFrom(s => s.LastName))
                .ForMember(a => a.PhoneNumber, a => a.MapFrom(s => s.PhoneNumber))
                .ForMember(a => a.UserId, a => a.Ignore())
                .ForMember(a => a.City, a => a.Ignore())
                .ForMember(a => a.CityId, a => a.MapFrom(s => s.CityId))
                .ForMember(a => a.Photo, a => a.Ignore())
                .ForMember(a => a.Password, a => a.Ignore())
                .ForMember(a => a.UserName, a => a.MapFrom(s => s.UserName));
        }
    }
}
