using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Pohovor.Api.v1.Enums;

namespace Pohovor.Api.v1.Modules.Ciselnik.Handlers
{
    /// <summary>Ciselniky pro comboboxy na frontendu (pocasi, stavy zaznamu).</summary>
    public class GetCiselnikyHandler : IRequestHandler<GetCiselnikyRequest, GetCiselnikyResponse>
    {
        public Task<GetCiselnikyResponse> Handle(GetCiselnikyRequest request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new GetCiselnikyResponse
            {
                Pocasi = PrevedEnum<PocasiTyp>(),
                Stavy = PrevedEnum<StavZaznamu>(),
            });
        }

        private static List<CiselnikPolozkaDTO> PrevedEnum<TEnum>() where TEnum : struct, Enum =>
            Enum.GetValues<TEnum>()
                .Select(x => new CiselnikPolozkaDTO
                {
                    Id = Convert.ToInt32(x),
                    Nazev = x.ToString(),
                })
                .ToList();
    }

    public class GetCiselnikyRequest : IRequest<GetCiselnikyResponse>
    {
    }

    public class GetCiselnikyResponse
    {
        public List<CiselnikPolozkaDTO> Pocasi { get; set; }

        public List<CiselnikPolozkaDTO> Stavy { get; set; }
    }

    public class CiselnikPolozkaDTO
    {
        public int Id { get; set; }

        public string Nazev { get; set; }
    }
}
