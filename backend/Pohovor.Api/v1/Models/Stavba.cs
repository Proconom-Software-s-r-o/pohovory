namespace Pohovor.Api.v1.Models
{
    /// <summary>Stavba (projekt) ulozena v <c>Data/stavby.json</c>. Ciselnik, jen pro cteni.</summary>
    public class Stavba
    {
        public int XId { get; set; }

        public string Nazev { get; set; }

        public string Investor { get; set; }

        public bool Aktivni { get; set; }
    }
}
