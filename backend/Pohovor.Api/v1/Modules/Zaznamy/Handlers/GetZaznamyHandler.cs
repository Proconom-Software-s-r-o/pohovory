using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Pohovor.Api.v1.DataManagers.StavbaManager;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Api.v1.Modules.Zaznamy.Handlers
{
    /// <summary>
    /// Seznam zaznamu jedne stavby s volitelnym fulltextem a filtrem na stav.
    /// Tenhle handler je kompletni - pouzij ho jako vzor pro ostatni.
    /// </summary>
    public class GetZaznamyHandler : IRequestHandler<GetZaznamyRequest, GetZaznamyResponse>
    {
        private readonly IZaznamManager _zaznamManager;
        private readonly IStavbaManager _stavbaManager;
        private readonly IMapper _mapper;

        public GetZaznamyHandler(IZaznamManager zaznamManager, IStavbaManager stavbaManager, IMapper mapper)
        {
            _zaznamManager = zaznamManager;
            _stavbaManager = stavbaManager;
            _mapper = mapper;
        }

        public async Task<GetZaznamyResponse> Handle(GetZaznamyRequest request, CancellationToken cancellationToken)
        {
            // Existence resource se overuje vzdy, i kdyz je "jen" pro cteni
            Stavba stavba = await _stavbaManager.GetByIdAsync(request.KStavba, cancellationToken)
                ?? throw new BadDataException("Stavba neexistuje.");

            List<Zaznam> zaznamy = await _zaznamManager.GetByStavbaAsync(stavba.XId, cancellationToken);

            if (request.Stav.HasValue)
            {
                zaznamy = zaznamy.Where(x => x.Stav == request.Stav.Value).ToList();
            }

            if (!string.IsNullOrWhiteSpace(request.Hledat))
            {
                string hledat = request.Hledat.Trim();
                zaznamy = zaznamy
                    .Where(x => Obsahuje(x.Popis, hledat) || Obsahuje(x.Autor, hledat))
                    .ToList();
            }

            return new GetZaznamyResponse
            {
                Zaznamy = _mapper.Map<List<ZaznamDTO>>(zaznamy),
            };
        }

        private static bool Obsahuje(string zdroj, string hledany) =>
            !string.IsNullOrEmpty(zdroj) && zdroj.Contains(hledany, StringComparison.OrdinalIgnoreCase);
    }

    public class GetZaznamyRequest : IRequest<GetZaznamyResponse>
    {
        public int KStavba { get; set; }

        public string Hledat { get; set; }

        public StavZaznamu? Stav { get; set; }
    }

    public class GetZaznamyResponse
    {
        public List<ZaznamDTO> Zaznamy { get; set; }
    }
}
