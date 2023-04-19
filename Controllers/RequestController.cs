using BusinessLogic.Services;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ProiectPWEB_MU.Controllers
{
    [Route("requests")]
    [ApiController]
    [Authorize]
    [EnableCors("ReactPolicy")]
    public class RequestController : BaseController
    {
        private readonly RequestService Service;
        private readonly OfferService offerService;
        public RequestController(ControllerDependencies dependencies, RequestService service, OfferService offerSer)
        : base(dependencies)
        {
            Service = service;
            offerService = offerSer;
        }
        [HttpGet]
        [Route("availableIntervals")]
        public async Task<List<Interval>> GetAvailableIntervals(Guid id)
        {
            return await offerService.GetAvailableIntervals(id);
        }
        [HttpGet]
        [Route("unavailableIntervals")]
        public async Task<List<Interval>> GetUnavailableIntervals(Guid id)
        {
           return await Service.GetUnavailableIntervals(id);
        }
 

        [HttpPost]
        [Route("sendRequest")]
        public async Task<ActionResult> SendRequest(SendRequestModel model)
        {
            if (model.StartDate >= model.EndDate)
            {
                ModelState.AddModelError("StartDate", "Your end time must be after your start time!");
                ModelState.AddModelError("EndDate", "Your end time must be after your start time!");
                model.AvailableIntervals = await offerService.GetAvailableIntervals(model.OfferId);
                model.UnavailableIntervals = await Service.GetUnavailableIntervals(model.OfferId);
                return View(model);
            }

            if (model.StartDate < DateTime.Now || model.EndDate < DateTime.Now)
            {
                ModelState.AddModelError("StartDate", "The request should be for an interval in the future!");
                ModelState.AddModelError("EndDate", "The request should be for an interval in the future!");
                model.AvailableIntervals = await offerService.GetAvailableIntervals(model.OfferId);
                model.UnavailableIntervals = await Service.GetUnavailableIntervals(model.OfferId);
                return View(model);
            }

            Interval? availableInterval = await offerService.GetAvailableInterval(model);

            if (availableInterval == null)
            {
                ModelState.AddModelError("StartDate", "Your interval isn't included in any available interval!");
                ModelState.AddModelError("EndDate", "Your interval isn't included in any available interval!");
                model.AvailableIntervals = await offerService.GetAvailableIntervals(model.OfferId);
                model.UnavailableIntervals = await Service.GetUnavailableIntervals(model.OfferId);
                return View(model);
            }
            var isIntervalValid = await Service.CheckOverlappingIntervals(availableInterval, model);
            if (isIntervalValid)
            {
                ModelState.AddModelError("StartDate", "Your request overlaps with another accepted request!");
                ModelState.AddModelError("EndDate", "Your request overlaps with another accepted request!");
                model.AvailableIntervals = await offerService.GetAvailableIntervals(model.OfferId);
                model.UnavailableIntervals = await Service.GetUnavailableIntervals(model.OfferId);
                return View(model);
            }
            await Service.AddRequestToDb(model);
            return RedirectToAction("GoToOfferDetailsPage", "Offer", new { id = model.OfferId });
        }

        [HttpGet]
        [Route("receivedRequests")]
        public async Task<List<ViewRequestModel>> ViewReceivedRequests(Guid id)
        {
            return await Service.GetReceivedRequests(id);
        }

        [HttpGet]
        [Route("sentRequests")]
        public async Task<List<ViewRequestModel>> ViewSentRequests(Guid id)
        {
            return await Service.GetSentRequests(id);
        }

        [HttpDelete]
        [Route("unsendRequests")]
        public async Task<bool> RevokeRequests(Guid id)
        {
            await Service.DeleteSentRequests(id);
            return true;
        }

        [HttpPost]
        [Route("acceptRequest")]
        public async Task AcceptRequest(Guid id) => await Service.UpdateRequest(id, "Accepted");
        [HttpPost]
        [Route("refuseRequest")]
        public async Task RefuseRequest(Guid id) => await Service.UpdateRequest(id, "Refused");
        [HttpPost]
        [Route("deleteRequest")]
        public async Task DeleteRequest(Guid id) => await Service.DeleteRequest(id);
    }
}
