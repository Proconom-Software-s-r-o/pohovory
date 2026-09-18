using System;
using Pohovor.Api.v1.Enums;

namespace Pohovor.Api.v1.Models
{
    /// <summary>
    /// Denni zaznam stavebniho deniku tak, jak je ulozeny v <c>Data/zaznamy.json</c>.
    /// Pojmenovani sloupcu kopiruje konvenci ostre databaze: primarni klic <c>XId</c>,
    /// cizi klic <c>K{Entita}</c>, soft delete pres nullable <c>Smazano</c>.
    /// </summary>
    public class Zaznam
    {
        public int XId { get; set; }

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

        /// <summary>Soft delete - zaznam se fyzicky nemaze, jen se nastavi datum smazani.</summary>
        public DateTime? Smazano { get; set; }
    }
}
