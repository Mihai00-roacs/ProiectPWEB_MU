namespace DataAccess
{
    public interface IEmailSender
    {
        void SendEmail(string email, string subject, string htmlMessage);
        void SendEmailPassword(string email, string subject, string htmlMessage);
    }
}
