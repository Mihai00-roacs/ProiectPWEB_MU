namespace DataAccess.Models
{
    public class ErrorViewModel :IEntity
    {
        public string? RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}