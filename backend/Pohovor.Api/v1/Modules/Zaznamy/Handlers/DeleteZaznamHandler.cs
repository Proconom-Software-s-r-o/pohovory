using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Models;
using Pohovor.Commons;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Api.v1.Modules.Zaznamy.Handlers
{
    /// <summary>Soft delete - zaznam se fyzicky nemaze, jen se mu nastavi <c>Smazano</c>.</summary>
    public class DeleteZaznamHandler : IRequestHandler<DeleteZaznamRequest, EmptyActionResponse>
    {
        private readonly IZaznamManager _zaznamManager;

        public DeleteZaznamHandler(IZaznamManager zaznamManager)
        {
            _zaznamManager = zaznamManager;
        }

        public async Task<EmptyActionResponse> Handle(DeleteZaznamRequest request, CancellationToken cancellationToken)
        {
            Zaznam zaznam = await _zaznamManager.GetByIdAsync(request.ZaznamId, cancellationToken)
                ?? throw new BadDataException("Zaznam neexistuje.");

            if (zaznam.Stav == StavZaznamu.Schvaleny)
            {
                throw new BadDataException("Schvaleny zaznam nelze smazat.");
            }

            zaznam.Smazano = DateTime.Now;

            await _zaznamManager.UpdateAsync(zaznam, cancellationToken);

            return new EmptyActionResponse();
        }
    }

    public class DeleteZaznamRequest : IRequest<EmptyActionResponse>
    {
        public int ZaznamId { get; set; }
    }
}
