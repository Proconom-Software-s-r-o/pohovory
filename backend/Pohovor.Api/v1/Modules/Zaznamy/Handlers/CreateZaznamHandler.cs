using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Pohovor.Api.v1.DataManagers.StavbaManager;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Claims;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Api.v1.Modules.Zaznamy.Handlers
{
    /// <summary>
    /// ÚKOL 1 - zalozeni noveho zaznamu stavebniho deniku.
    ///
    /// Zadani je v ZADANI.md, testy na tenhle handler jsou v Pohovor.Api.UnitTests.
    /// Vzor kompletniho handleru: <see cref="GetZaznamyHandler"/>, <see cref="DeleteZaznamHandler"/>.
    /// </summary>
    public class CreateZaznamHandler : IRequestHandler<CreateZaznamRequest, CreateZaznamResponse>
    {
        private readonly IZaznamManager _zaznamManager;
        private readonly IStavbaManager _stavbaManager;
        private readonly IClaimResolver _claimResolver;
        private readonly IMapper _mapper;

        public CreateZaznamHandler(
            IZaznamManager zaznamManager,
            IStavbaManager stavbaManager,
            IClaimResolver claimResolver,
            IMapper mapper)
        {
            _zaznamManager = zaznamManager;
            _stavbaManager = stavbaManager;
            _claimResolver = claimResolver;
            _mapper = mapper;
        }

        public async Task<CreateZaznamResponse> Handle(CreateZaznamRequest request, CancellationToken cancellationToken)
        {
            // TODO (ukol 1): implementovat
            //  1) overit, ze stavba z request.Zaznam.KStavba existuje -> jinak BadDataException("Stavba neexistuje.")
            //  2) overit, ze Popis neni prazdny -> BadDataException("Popis zaznamu je povinny.")
            //  3) overit, ze Datum neni v budoucnosti -> BadDataException("Datum zaznamu nesmi byt v budoucnosti.")
            //  4) namapovat DTO na model (_mapper), doplnit Autor (_claimResolver), Stav = Rozpracovany,
            //     Vytvoreno = DateTime.Now
            //  5) ulozit pres _zaznamManager a vratit namapovane ZaznamDTO
            throw new NotImplementedException();
        }
    }

    public class CreateZaznamRequest : IRequest<CreateZaznamResponse>
    {
        public ZaznamCreateDTO Zaznam { get; set; }
    }

    public class CreateZaznamResponse
    {
        public ZaznamDTO Zaznam { get; set; }
    }
}
