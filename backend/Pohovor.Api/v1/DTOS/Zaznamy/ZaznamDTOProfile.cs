using AutoMapper;
using Pohovor.Api.v1.Models;

namespace Pohovor.Api.v1.DTOS.Zaznamy
{
    public class ZaznamDTOProfile : Profile
    {
        public ZaznamDTOProfile()
        {
            // XId -> Id resi RecognizePrefixes("X") nastaveny ve Startup.cs
            CreateMap<Zaznam, ZaznamDTO>();
            CreateMap<ZaznamCreateDTO, Zaznam>();
            CreateMap<ZaznamUpdateDTO, Zaznam>();
        }
    }
}
