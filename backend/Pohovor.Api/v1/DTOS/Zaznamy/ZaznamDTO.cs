using System;
using Pohovor.Api.v1.Enums;

namespace Pohovor.Api.v1.DTOS.Zaznamy
{
    /// <summary>
    /// Zaznam tak, jak ho vidi frontend. DTO nikdy nevraci ulozeny model primo -
    /// diky AutoMapperu s <c>RecognizePrefixes("X")</c> se <c>XId</c> mapuje na <c>Id</c>.
    /// </summary>
    public class ZaznamDTO
    {
        public int Id { get; set; }

        public int KStavba { get; set; }

        public DateTime Datum { get; set; }

        public PocasiTyp Pocasi { get; set; }

        public decimal? TeplotaRano { get; set; }

        public decimal? TeplotaOdpoledne { get; set; }

        public int PocetPracovniku { get; set; }

        public string Popis { get; set; }

        public string Autor { get; set; }

        public StavZaznamu Stav { get; set; }

        public DateTime Vytvoreno { get; set; }

        public DateTime? Zmeneno { get; set; }
    }
}
