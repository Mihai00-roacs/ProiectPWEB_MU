using BusinessLogic.Services;
using BusinessLogic;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ProiectPWEB_MU.Controllers
{
    [Route("offers")]
    [ApiController]
    [Authorize]
    [EnableCors("ReactPolicy")]
    public class OfferController : BaseController
    {
        private readonly OfferService Service;
        private readonly RequestService requestService;
        public OfferController(ControllerDependencies dependencies, OfferService service, RequestService requestSer)
        : base(dependencies)
        {
            Service = service;
            requestService = requestSer;
        }

        [HttpPost]
        [Route("AddOffer")]
        public IActionResult AddOffer(AddOfferModel model)
        {
            TempData.Put("carModel", model);
            //  model.OfferId=await Service.AddNewOffer(model);

            return RedirectToAction("AddOfferPoints");
        }

        [HttpPost]
        [Route("addpoints")]
        public Guid AddOfferPoints(AddOfferModelWithPoints addOfferModelWithPoints)
        {
            var OfferId = Service.AddNewOffer(addOfferModelWithPoints);
            return OfferId;
        }
        public JsonResult ValidateDateEqualOrGreater(DateTime date) => date >= DateTime.Now ? Json(true) : Json(false);

        [HttpGet]
        [Route("getOfferById")]
        public async Task<OfferDetailsModel> GetOfferByIdAsync(Guid offerId)
        {
            return await Service.GetOfferById(offerId);
        }
       /* public async Task<RedirectToActionResult> DeleteOffer(Guid id)
       {
           var requests = await requestService.GetRequests(id);
           bool isAnyRequestAccepted = requestService.IsAnyRequestAccepted(requests);
           if (isAnyRequestAccepted)
           {

               TempData["message"] = "Can't delete offer because there are still accepeted requests tied to it!";
               return RedirectToAction("GoToOfferDetailsPage", new { id });
           }

           await Service.DeleteOffer(id, requests);
           return RedirectToAction("Index", "Home");
       }*/
        [HttpPost]
        [Route("addOfferIntervals")]
        public async Task AddOfferIntervals(AddOfferIntervalDTO addOfferIntervalDTO)
        {
            if (addOfferIntervalDTO.StartDate < DateTime.Now)
            {
                ModelState.AddModelError("StartDate", "StartDate is in Past. Please select actual date");
                return;
            }
            if (addOfferIntervalDTO.EndDate < DateTime.Now)
            {
                ModelState.AddModelError("EndDate", "EndDate is in Past. Please select actual date");
                return;
            }
            if (addOfferIntervalDTO.StartDate > addOfferIntervalDTO.EndDate)
            {
                ModelState.AddModelError("StartDate", "StartDate is greater than EndDate");
                ModelState.AddModelError("EndDate", "EndDate is lesser than StartDate");
                return;
            }
            await Service.AddIntervalToDatabase(addOfferIntervalDTO.OfferId, addOfferIntervalDTO.StartDate, addOfferIntervalDTO.EndDate);
        }

        [HttpGet]
        [Route("GetOffersLength")]
        public int GetOffersSize()
        {
            var offers =  Service.GetOffersSize();
            return offers;
        }
        [HttpGet]
        [Route("GetOffers")]
        public async Task<List<OfferDetailsModel>> GetOffersPerPage(int page, int size)
        {
            var offers = await Service.GenerateOffersPerPage(page, size);
            return offers;
        }
        [HttpGet]
        [Route("GetSelfOffers")]
        public async Task<List<OfferDetailsModel>> GetSelfOffersPerPage(int page, int size)
        {
            return await Service.GetMyOffers(page,size);
        }
        [HttpGet]
        [Route("GetSelfOffersLength")]
        public int GetSelfOffersSize()
        {
            var offers = Service.GetSelfOffersSize();
            return offers;
        }

        [HttpPost]
        public async Task<IActionResult> EditOffer(AddOfferModel model)
        {

            await Service.EditOffer(model);

            return RedirectToAction("GoToOfferDetailsPage", new { controller = "Offer", id = model.OfferId });
        }
        [HttpGet]
        [Route("GetBorrowedCars")]
        public async Task<List<OfferDetailsModel>> GetBorrowedCarsOffers()
        {
            var requests = await requestService.GetCurrUserRequests();
            return await Service.GetSentOffers(requests);
        }
        [HttpGet]
        [Route("GetBorrowedCarsLength")]
        public async Task<int> GetBorrowedCarsOffersSizeAsync()
        {
            var requests = await requestService.GetCurrUserRequests();
            var offers = await Service.GetBorrowedCarsOffersSizeAsync(requests);
            return offers;
        }

        [HttpGet]
        [Route("colors")]
        public async Task<List<SelectListItem>> GetColors(string search)
        {
            if (search != null)
            {
                return await Service.AddColorsForAddOffer(search);
            }
            return new List<SelectListItem>();
        }
     
        [HttpGet]
        [Route("producers")]
        public async Task<List<SelectListItem>> GetProducers(string search)
        {
            if (search != null)
            {
                return await Service.AddProducersForAddOffer(search);
            }
            return new List<SelectListItem>();
        }
        [HttpGet]
        [Route("types")]
        public async Task<List<SelectListItem>> GetTypes(string search)
        {
            if (search != null)
            {
                return await Service.AddTypesForAddOffer(search);
            }
            return new List<SelectListItem>();
        }

        [HttpGet]
        [Route("sizes")]
        public async Task<List<SelectListItem>> GetSizes()
        {
            return await Service.AddSizesForAddOffer();
        }
    }
}
