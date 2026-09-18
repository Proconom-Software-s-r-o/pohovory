using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Pohovor.Api.v1.Models;

namespace Pohovor.Api.v1.DataManagers.StavbaManager
{
    public interface IStavbaManager
    {
        Task<List<Stavba>> GetAllAsync(CancellationToken cancellationToken);

        Task<Stavba> GetByIdAsync(int stavbaId, CancellationToken cancellationToken);
    }
}
