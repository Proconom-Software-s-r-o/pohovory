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
    ///
    /// Pozor na pravidlo z byznysu: schvaleny zaznam uz nelze menit.
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
            // TODO (ukol 2): implementovat
            //  1) nacist zaznam podle request.ZaznamId -> jinak BadDataException("Zaznam neexistuje.")
            //  2) pokud uz je Stav == StavZaznamu.Schvaleny -> BadDataException("Schvaleny zaznam nelze upravit.")
            //  3) prepsat editovatelne property z request.Zaznam (Datum, Pocasi, teploty, PocetPracovniku, Popis, Stav)
            //     - Autor a Vytvoreno se nemeni
            //  4) nastavit Zmeneno = DateTime.Now, ulozit a vratit namapovane ZaznamDTO
            throw new NotImplementedException();
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
