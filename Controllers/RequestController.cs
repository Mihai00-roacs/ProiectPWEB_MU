using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using DataAccess.Models;

namespace ProiectPWEB_MU.Controllers
{
    [Route("requests")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class RequestController : BaseController
    {
        private readonly HttpClient _httpClient;

        public RequestController(ControllerDependencies dependencies, IHttpClientFactory httpClientFactory)
            : base(dependencies)
        {
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.BaseAddress = new Uri("http://localhost:5000/");
        }

        [HttpGet("availableIntervals")]
        public async Task<IActionResult> GetAvailableIntervals(Guid id)
        {
            var response = await _httpClient.GetAsync($"api/Offer/AvailableIntervals/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching available intervals.");
            }

            var intervals = await response.Content.ReadFromJsonAsync<List<Interval>>();
            return Ok(intervals);
        }

        [HttpGet("unavailableIntervals")]
        public async Task<IActionResult> GetUnavailableIntervals(Guid id)
        {
            var response = await _httpClient.GetAsync($"api/Offer/UnavailableIntervals/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching unavailable intervals.");
            }

            var intervals = await response.Content.ReadFromJsonAsync<List<Interval>>();
            return Ok(intervals);
        }

        [HttpPost("sendRequest")]
        public async Task<IActionResult> SendRequest([FromBody] SendRequestModel model, [FromQuery] Guid userId)
        {
            var response = await _httpClient.PostAsJsonAsync("api/Request/Add/?userId="+userId, model);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error sending request.");
            }

            return Ok("Request sent successfully.");
        }

        [HttpGet("receivedRequests")]
        public async Task<IActionResult> ViewReceivedRequests(Guid id)
        {
            var response = await _httpClient.GetAsync($"api/Request/Received/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching received requests.");
            }

            var requests = await response.Content.ReadFromJsonAsync<List<ViewRequestModel>>();
            return Ok(requests);
        }

        [HttpGet("sentRequests")]
        public async Task<IActionResult> ViewSentRequests(Guid id)
        {
            var response = await _httpClient.GetAsync($"api/Request/Sent/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error fetching sent requests.");
            }

            var requests = await response.Content.ReadFromJsonAsync<List<ViewRequestModel>>();
            return Ok(requests);
        }

        [HttpDelete("unsendRequests")]
        public async Task<IActionResult> RevokeRequests(Guid id)
        {
            var response = await _httpClient.DeleteAsync($"api/Request/Delete/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error revoking request.");
            }

            return Ok("Request revoked successfully.");
        }

        [HttpPost("acceptRequest")]
        public async Task<IActionResult> AcceptRequest(Guid id)
        {
            var response = await _httpClient.PutAsJsonAsync<IActionResult>($"api/Request/Update/{id}?state=Accepted", null);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error accepting request.");
            }

            return Ok("Request accepted successfully.");
        }

        [HttpPost("refuseRequest")]
        public async Task<IActionResult> RefuseRequest(Guid id)
        {
            var response = await _httpClient.PutAsJsonAsync<IActionResult>($"api/Request/Update/{id}?state=Refused", null);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error refusing request.");
            }

            return Ok("Request refused successfully.");
        }

        [HttpPost("deleteRequest")]
        public async Task<IActionResult> DeleteRequest(Guid id)
        {
            var response = await _httpClient.DeleteAsync($"api/Request/Delete/{id}");
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error deleting request.");
            }

            return Ok("Request deleted successfully.");
        }
    }
}
