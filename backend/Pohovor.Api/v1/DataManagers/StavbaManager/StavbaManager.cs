using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Storage;

namespace Pohovor.Api.v1.DataManagers.StavbaManager
{
    public class StavbaManager : IStavbaManager
    {
        public const string FileName = "stavby.json";

        private readonly IJsonFileStore _store;

        public StavbaManager(IJsonFileStore store)
        {
            _store = store;
        }

        public async Task<List<Stavba>> GetAllAsync(CancellationToken cancellationToken)
        {
            List<Stavba> stavby = await _store.ReadAsync<Stavba>(FileName, cancellationToken);

            return stavby.Where(x => x.Aktivni).OrderBy(x => x.Nazev).ToList();
        }

        public async Task<Stavba> GetByIdAsync(int stavbaId, CancellationToken cancellationToken)
        {
            List<Stavba> stavby = await _store.ReadAsync<Stavba>(FileName, cancellationToken);

            return stavby.FirstOrDefault(x => x.XId == stavbaId && x.Aktivni);
        }
    }
}
