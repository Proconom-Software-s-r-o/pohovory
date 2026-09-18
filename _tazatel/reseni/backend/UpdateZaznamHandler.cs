using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Api.v1.Modules.Zaznamy.Handlers
{
    /// <summary>
    /// ÚKOL 2 - editace existujiciho zaznamu.
    /// </summary>
    public class UpdateZaznamHandler : IRequestHandler<UpdateZaznamRequest, UpdateZaznamResponse>
    {
        private readonly IZaznamManager _zaznamManager;
        private readonly IMapper _mapper;

        public UpdateZaznamHandler(IZaznamManager zaznamManager, IMapper mapper)
        {
            _zaznamManager = zaznamManager;
            _mapper = mapper;
        }

        public async Task<UpdateZaznamResponse> Handle(UpdateZaznamRequest request, CancellationToken cancellationToken)
        {
            ZaznamUpdateDTO dto = request.Zaznam
                ?? throw new BadDataException("Chybi data zaznamu.");

            Zaznam zaznam = await _zaznamManager.GetByIdAsync(request.ZaznamId, cancellationToken)
                ?? throw new BadDataException("Zaznam neexistuje.");

            if (zaznam.Stav == StavZaznamu.Schvaleny)
            {
                throw new BadDataException("Schvaleny zaznam nelze upravit.");
            }

            if (string.IsNullOrWhiteSpace(dto.Popis))
            {
                throw new BadDataException("Popis zaznamu je povinny.");
            }

            // Autor, KStavba a Vytvoreno se needituji
            zaznam.Datum = dto.Datum;
            zaznam.Pocasi = dto.Pocasi;
            zaznam.TeplotaRano = dto.TeplotaRano;
            zaznam.TeplotaOdpoledne = dto.TeplotaOdpoledne;
            zaznam.PocetPracovniku = dto.PocetPracovniku;
            zaznam.Popis = dto.Popis.Trim();
            zaznam.Stav = dto.Stav;
            zaznam.Zmeneno = DateTime.Now;

            await _zaznamManager.UpdateAsync(zaznam, cancellationToken);

            return new UpdateZaznamResponse
            {
                Zaznam = _mapper.Map<ZaznamDTO>(zaznam),
            };
        }
    }

    public class UpdateZaznamRequest : IRequest<UpdateZaznamResponse>
    {
        /// <summary>Plni se z routy <c>PUT /api/zaznamy/{ZaznamId}</c>.</summary>
        [FromRoute]
        public int ZaznamId { get; set; }

        /// <summary>Plni se z tela requestu.</summary>
        [FromBody]
        public ZaznamUpdateDTO Zaznam { get; set; }
    }

    public class UpdateZaznamResponse
    {
        public ZaznamDTO Zaznam { get; set; }
    }
}
