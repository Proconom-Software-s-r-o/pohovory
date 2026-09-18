using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Pohovor.Api.v1.DataManagers.StavbaManager;
using Pohovor.Api.v1.DTOS.Stavby;
using Pohovor.Api.v1.Models;

namespace Pohovor.Api.v1.Modules.Stavby.Handlers
{
    public class GetStavbyHandler : IRequestHandler<GetStavbyRequest, GetStavbyResponse>
    {
        private readonly IStavbaManager _stavbaManager;
        private readonly IMapper _mapper;

        public GetStavbyHandler(IStavbaManager stavbaManager, IMapper mapper)
        {
            _stavbaManager = stavbaManager;
            _mapper = mapper;
        }

        public async Task<GetStavbyResponse> Handle(GetStavbyRequest request, CancellationToken cancellationToken)
        {
            List<Stavba> stavby = await _stavbaManager.GetAllAsync(cancellationToken);

            return new GetStavbyResponse
            {
                Stavby = _mapper.Map<List<StavbaDTO>>(stavby),
            };
        }
    }

    public class GetStavbyRequest : IRequest<GetStavbyResponse>
    {
    }

    public class GetStavbyResponse
    {
        public List<StavbaDTO> Stavby { get; set; }
    }
}
