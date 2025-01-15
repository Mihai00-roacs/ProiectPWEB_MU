using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using DataAccess.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using NuGet.Protocol;

namespace ProiectPWEB_MU.Controllers
{
    [Route("offers")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class OfferController : ControllerBase
    {
        private readonly HttpClient _offersHttpClient;
        private readonly HttpClient _requestsHttpClient;

        public OfferController(IHttpClientFactory httpClientFactory)
        {
            _offersHttpClient = httpClientFactory.CreateClient();
            _offersHttpClient.BaseAddress = new Uri("http://localhost:5000/api/Offer/"); // API-ul DataBaseInteraction
            _requestsHttpClient = httpClientFactory.CreateClient();
            _requestsHttpClient.BaseAddress = new Uri("http://localhost:5000/api/Request/"); // API-ul DataBaseInteraction
        }

        [HttpPost("addpoints")]
        public async Task<IActionResult> AddOffer(AddOfferModel model)
        {
            var response = await _offersHttpClient.PostAsJsonAsync("Add", model);
            if (response.IsSuccessStatusCode)
            {
                var offerId = await response.Content.ReadFromJsonAsync<Guid>();
                return Ok(offerId);
            }

            return StatusCode((int)response.StatusCode, "Error adding offer.");
        }
        [HttpGet]
        [Route("GetSelfOffers")]
        public async Task<ActionResult> GetSelfOffersPerPage(Guid userId)
        {
            var response = await _offersHttpClient.GetAsync($"MyOffers/{userId}?page=0&size=20");
            if (response.IsSuccessStatusCode)
            {
                var colors = await response.Content.ReadFromJsonAsync<List<OfferDetailsModel>>();
                return Ok(colors);
            }

            return StatusCode((int)response.StatusCode, "Error fetching colors.");
        }
        [HttpGet]
        [Route("GetSelfOffersLength")]
        public async Task<ActionResult> GetSelfOffersSize(Guid userId)
        {
            var response = await _offersHttpClient.GetAsync($"MyOffers/{userId}?page=0&size=20");
            if (response.IsSuccessStatusCode)
            {
                var colors = await response.Content.ReadFromJsonAsync<List<OfferDetailsModel>>();
                return Ok(colors.Count);
            }

            return StatusCode((int)response.StatusCode, "Error fetching colors.");
        }
        [HttpGet("getOfferById")]
        public async Task<IActionResult> GetOfferByIdAsync(Guid offerId)
        {
            var response = await _offersHttpClient.GetAsync($"{offerId}");
            if (response.IsSuccessStatusCode)
            {
                var offer = await response.Content.ReadFromJsonAsync<OfferDetailsModel>();
                return Ok(offer);
            }

            return StatusCode((int)response.StatusCode, "Error fetching offer.");
        }
        [HttpGet]
        [Route("GetBorrowedCars")]
        public async Task<ActionResult> GetBorrowedCarsOffers(Guid userId){
            
            var response = await _requestsHttpClient.GetAsync($"User/{userId}");
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, "Error fetching colors.");
            var list = await response.Content.ReadFromJsonAsync<List<ViewRequestModel>>();
            var sentOffers = new HashSet<OfferDetailsModel>();
            foreach (var model in list)
            {
                var response2 = await _offersHttpClient.GetAsync($"{model.OfferId}");
                if (!response2.IsSuccessStatusCode) continue;
                var offer = await response2.Content.ReadFromJsonAsync<OfferDetailsModel>();
                var offerModel = new OfferDetailsModel()
                {
                    OfferId = offer.OfferId,
                    Milleage   = offer.Milleage,
                    Year = offer.Year,
                    ColorName = offer.ColorName,
                    OwnerName = offer.OwnerName,
                    ProducerName = offer.ProducerName,
                    SizeName = offer.SizeName,
                    TypeName = offer.TypeName,
                    XCoordinate = offer.XCoordinate,
                    YCoordinate = offer.YCoordinate,
                    Description = offer.Description
                };
                sentOffers.Add(offerModel);
            }
            return Ok(sentOffers);

        }
        [HttpGet]
        [Route("GetBorrowedCarsLength")]
        public async Task<ActionResult> GetBorrowedCarsOffersSizeAsync(Guid userId)
        {
            var response = await _requestsHttpClient.GetAsync($"User/{userId}");
            if (!response.IsSuccessStatusCode) return StatusCode((int)response.StatusCode, "Error fetching colors.");
            var list = await response.Content.ReadFromJsonAsync<List<ViewRequestModel>>();
            var sentOffers = new HashSet<OfferDetailsModel>();
            foreach (var model in list)
            {
                var response2 = await _offersHttpClient.GetAsync($"{model.OfferId}");
                if (!response2.IsSuccessStatusCode) continue;
                var offer = await response.Content.ReadFromJsonAsync<OfferDetailsModel>();
                var offerModel = new OfferDetailsModel()
                {
                    Milleage   = offer.Milleage,
                    Year = offer.Year,
                    ColorName = offer.ColorName,
                    OwnerName = offer.OwnerName,
                    ProducerName = offer.ProducerName,
                    SizeName = offer.SizeName,
                    TypeName = offer.TypeName,
                    XCoordinate = offer.XCoordinate,
                    YCoordinate = offer.YCoordinate
                };
                sentOffers.Add(offerModel);
            }
            return Ok(sentOffers.Count);
        }
        [HttpGet]
        [Route("GetOffersLength")]
        public async Task<ActionResult> GetOffersSize(Guid userId)
        {
            var response = await _offersHttpClient.GetAsync($"OtherOffers/{userId}?page=0&size=20");
            if (response.IsSuccessStatusCode)
            {
                var colors = await response.Content.ReadFromJsonAsync<List<OfferDetailsModel>>();
                return Ok(colors.Count);
            }

            return StatusCode((int)response.StatusCode, "Error fetching colors.");
        }
        [HttpGet]
        [Route("GetOffers")]
        public async Task<ActionResult> GetOffersPerPage(Guid userId)
        {
            var response = await _offersHttpClient.GetAsync($"OtherOffers/{userId}?page=0&size=20");
            if (response.IsSuccessStatusCode)
            {
                var colors = await response.Content.ReadFromJsonAsync<List<OfferDetailsModel>>();
                return Ok(colors);
            }

            return StatusCode((int)response.StatusCode, "Error fetching colors.");
        }
        [HttpPost("addOfferIntervals")]
        public async Task<IActionResult> AddOfferIntervals(AddOfferIntervalsModel model)
        {
            if (model.StartDate < DateTime.Now || model.StartDate > model.EndDate)
            {
                return BadRequest("Invalid date range.");
            }

            var response = await _offersHttpClient.PostAsJsonAsync("AddInterval", model);
            return response.IsSuccessStatusCode
                ? Ok("Interval added successfully.")
                : StatusCode((int)response.StatusCode, "Error adding interval.");
        }

        [HttpGet("colors")]
        public async Task<IActionResult> GetColors(string search)
        {
            var response = await _offersHttpClient.GetAsync($"Colors?search={search}");
            if (response.IsSuccessStatusCode)
            {
                var colors = await response.Content.ReadFromJsonAsync<List<SelectListItem>>();
                return Ok(colors);
            }

            return StatusCode((int)response.StatusCode, "Error fetching colors.");
        }

        [HttpGet("producers")]
        public async Task<IActionResult> GetProducers(string search)
        {
            var response = await _offersHttpClient.GetAsync($"Producers?search={search}");
            if (response.IsSuccessStatusCode)
            {
                var producers = await response.Content.ReadFromJsonAsync<List<SelectListItem>>();
                return Ok(producers);
            }

            return StatusCode((int)response.StatusCode, "Error fetching producers.");
        }

        [HttpGet("types")]
        public async Task<IActionResult> GetTypes(string search)
        {
            var response = await _offersHttpClient.GetAsync($"Types?search={search}");
            if (response.IsSuccessStatusCode)
            {
                var types = await response.Content.ReadFromJsonAsync<List<SelectListItem>>();
                return Ok(types);
            }

            return StatusCode((int)response.StatusCode, "Error fetching types.");
        }

        [HttpGet("sizes")]
        public async Task<IActionResult> GetSizes()
        {
            var response = await _offersHttpClient.GetAsync("Sizes");
            if (response.IsSuccessStatusCode)
            {
                var sizes = await response.Content.ReadFromJsonAsync<List<SelectListItem>>();
                return Ok(sizes);
            }

            return StatusCode((int)response.StatusCode, "Error fetching sizes.");
        }
    }
}
