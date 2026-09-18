using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Exceptions;

namespace Pohovor.Api.v1.Modules.Zaznamy.Handlers
{
    public class GetZaznamDetailHandler : IRequestHandler<GetZaznamDetailRequest, GetZaznamDetailResponse>
    {
        private readonly IZaznamManager _zaznamManager;
        private readonly IMapper _mapper;

        public GetZaznamDetailHandler(IZaznamManager zaznamManager, IMapper mapper)
        {
            _zaznamManager = zaznamManager;
            _mapper = mapper;
        }

        public async Task<GetZaznamDetailResponse> Handle(GetZaznamDetailRequest request, CancellationToken cancellationToken)
        {
            Zaznam zaznam = await _zaznamManager.GetByIdAsync(request.ZaznamId, cancellationToken)
                ?? throw new BadDataException("Zaznam neexistuje.");

            return new GetZaznamDetailResponse
            {
                Zaznam = _mapper.Map<ZaznamDTO>(zaznam),
            };
        }
    }

    public class GetZaznamDetailRequest : IRequest<GetZaznamDetailResponse>
    {
        public int ZaznamId { get; set; }
    }

    public class GetZaznamDetailResponse
    {
        public ZaznamDTO Zaznam { get; set; }
    }
}
