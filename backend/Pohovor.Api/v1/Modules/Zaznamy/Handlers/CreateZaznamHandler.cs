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
    /// Zalozeni noveho zaznamu stavebniho deniku. Autora doplnuje server z prihlaseneho
    /// uzivatele, novy zaznam vznika vzdy jako rozpracovany.
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
            ZaznamCreateDTO dto = request.Zaznam
                ?? throw new BadDataException("Chybi data zaznamu.");

            Stavba stavba = await _stavbaManager.GetByIdAsync(dto.KStavba, cancellationToken)
                ?? throw new BadDataException("Stavba neexistuje.");

            if (string.IsNullOrWhiteSpace(dto.Popis))
            {
                throw new BadDataException("Popis zaznamu je povinny.");
            }

            if (dto.Datum.Date > DateTime.Today)
            {
                throw new BadDataException("Datum zaznamu nesmi byt v budoucnosti.");
            }

            Zaznam zaznam = _mapper.Map<Zaznam>(dto);
            zaznam.KStavba = stavba.XId;
            zaznam.Popis = dto.Popis.Trim();
            zaznam.Autor = _claimResolver.ResolveUserName();
            zaznam.Stav = StavZaznamu.Rozpracovany;
            zaznam.Vytvoreno = DateTime.Now;
            zaznam.Zmeneno = null;
            zaznam.Smazano = null;

            Zaznam ulozeny = await _zaznamManager.InsertAsync(zaznam, cancellationToken);

            return new CreateZaznamResponse
            {
                Zaznam = _mapper.Map<ZaznamDTO>(ulozeny),
            };
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
