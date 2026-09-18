using System;
using System.ComponentModel.DataAnnotations;
using Pohovor.Api.v1.Enums;

namespace Pohovor.Api.v1.DTOS.Zaznamy
{
    /// <summary>Vstup pro zalozeni zaznamu. Validacni atributy patri na DTO, ne na model.</summary>
    public class ZaznamCreateDTO
    {
        [Required]
        public int KStavba { get; set; }

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
    }
}
