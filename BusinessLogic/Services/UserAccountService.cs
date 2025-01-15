using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.EntityFramework;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class UserAccountService : BaseService
    {
        private readonly ProiectPWEBContext Context;

        public UserAccountService(ServiceDependencies dependencies)
            : base(dependencies)
        {
            Context = new ProiectPWEBContext();
        }

        public async Task<List<SelectListItem>> AddCitiesForUserRegister(string text)
        {
            return await Context.Cities.Where(x => x.Nume!=null &&  x.Nume.StartsWith(text)).Take(10).Select(x => new SelectListItem()
            {
                Text=x.Nume,
                Value=x.CityId.ToString()
            }).ToListAsync();
        }

        public async Task AddCitiesForUserRegister(UserProfileModel model)
        {
            model.Cities = new List<SelectListItem>();
            await Context.Cities.ForEachAsync(c => model.Cities.Add(new SelectListItem() { Text = c.Nume, Value = c.CityId.ToString() }));
        }
        public async Task<bool> CheckEmailAvailability(string email)
        {
            return await Context.Users.FirstOrDefaultAsync(c => c.Email == email) == null;
        }

        public async Task<bool> CheckUsernameAvailability(string userName) => await Context.Users.FirstOrDefaultAsync(c => c.UserName == userName) == null;

        public async Task RegisterNewUser(RegisterModel model)
        {
            
            ExecuteInTransaction(uow =>
            {
                using MemoryStream memory = new();
                model.Picture.OpenReadStream().CopyTo(memory);
                var user = Mapper.Map<User>(model);
                user.Photo = memory.ToArray();
                user.UserId = Guid.NewGuid();
                uow.Users.Insert(user);
                uow.SaveChanges();
            });
        }

        public object GenerateEmailConfirmationToken(RegisterModel model)
        {
            return Encrypter_Decrypter.EncodePasswordToBase64(model.Email) + Encrypter_Decrypter.EncodePasswordToBase64(model.UserName);
        }

        public async Task<bool> CheckEmail(string email) => await Context.Users.AnyAsync(x => x.Email == email);

        public async Task<bool> CheckUserCredentials(string email, string password) => await Context.Users.AnyAsync(x => x.Email == email && x.Password == password);

        public async Task<bool> CheckValidity(string email)
        {
            return await Context.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<CurrentUserDTO> LoginAsync(string email, string password)
        {
            var user = await UnitOfWork.Users.Get().FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

            if (user == null)
            {
                return new CurrentUserDTO { IsAuthenticated = false };
            }
            var userDto = Mapper.Map<CurrentUserDTO>(user);
            userDto.IsAuthenticated = true;
            return userDto;
        }

        public async Task<UserProfileModel> GetUserProfileModel(Guid id)
        {
            var user = await Context.Users.Include(x => x.City).FirstOrDefaultAsync(x => x.UserId == id);
            var usermodel = new UserProfileModel();
            Mapper.Map<User, UserProfileModel>(user, usermodel);
            return usermodel;
        }
        public async Task EditUser(UserProfileModel model)
        {
            var userUpdate = await Context.Users
              .FirstOrDefaultAsync(x => x.UserId == model.UserId);
            ExecuteInTransaction(uow =>
            {
                if (userUpdate != null)
                {
                    if (model.Picture != null)
                    {
                        using MemoryStream memory = new();
                        model.Picture.OpenReadStream().CopyTo(memory);
                        userUpdate.Photo = memory.ToArray();
                    }
                    Mapper.Map<UserProfileModel, User>(model, userUpdate);
                    uow.Users.Update(userUpdate);
                }
                uow.SaveChanges();
            });
        }

        public async Task<bool> CheckEmailAvailability(string email1, string email2) => email1 == email2 || !(await Context.Users.AnyAsync(x => x.Email == email1));

        public async Task<bool> CheckUsernameAvailability(string userName1, string userName2) => userName1 == userName2 || !(await Context.Users.AnyAsync(x => x.UserName == userName1));
    }
}
