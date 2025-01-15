using AutoMapper;
using DataAccess;

namespace BusinessLogic
{
    public class ServiceDependencies
    {
        public IMapper Mapper { get; set; }
        public UnitOfWork UnitOfWork { get; set; }
        public CurrentUserDTO CurrentUser { get; set; }

        public ServiceDependencies(IMapper mapper, UnitOfWork unitOfWork, CurrentUserDTO currentUser)
        {
            Mapper = mapper;
            UnitOfWork = unitOfWork;
            CurrentUser = currentUser;
        }
    }
}