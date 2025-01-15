namespace DataAccess.Models;

public class LoginWith2FactorModel
{
    public string? Key { get; set; }
    public string? InputCode { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
}