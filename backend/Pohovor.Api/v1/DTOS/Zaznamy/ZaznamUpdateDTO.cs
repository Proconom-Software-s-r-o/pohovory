using System;
using System.ComponentModel.DataAnnotations;
using Pohovor.Api.v1.Enums;

namespace Pohovor.Api.v1.DTOS.Zaznamy
{
    /// <summary>Vstup pro editaci zaznamu.</summary>
    public class ZaznamUpdateDTO
    {
        [Required]
        public DateTime Datum { get; set; }

        public PocasiTyp Pocasi { get; set; }

        [Range(-50, 60)]
        public decimal? TeplotaRano { get; set; }

        [Range(-50, 60)]
        public decimal? TeplotaOdpoledne { get; set; }

        [Range(0, 500)]
        public int PocetPracovniku { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Popis { get; set; }

        public StavZaznamu Stav { get; set; }
    }
}
