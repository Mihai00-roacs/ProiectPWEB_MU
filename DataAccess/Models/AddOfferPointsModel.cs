
namespace DataAccess.Models
{
    public class AddOfferPointsModel : IEntity
    {
        public Guid OfferId { get; set; }
        public List<Position>? CarsPositions { get; set; }
        public Position currentCarPosition { get; set; }
    }
}
