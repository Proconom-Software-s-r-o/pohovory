using AutoMapper;
using Pohovor.Api.v1.Models;

namespace Pohovor.Api.v1.DTOS.Stavby
{
    public class StavbaDTO
    {
        public int Id { get; set; }

        public string Nazev { get; set; }

        public string Investor { get; set; }
    }

    public class StavbaDTOProfile : Profile
    {
        public StavbaDTOProfile()
        {
            CreateMap<Stavba, StavbaDTO>();
        }
    }
}
