using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Exceptions;
using Pohovor.Commons.Storage;

namespace Pohovor.Api.v1.DataManagers.ZaznamManager
{
    public class ZaznamManager : IZaznamManager
    {
        public const string FileName = "zaznamy.json";

        private readonly IJsonFileStore _store;

        public ZaznamManager(IJsonFileStore store)
        {
            _store = store;
        }

        public async Task<List<Zaznam>> GetByStavbaAsync(int kStavba, CancellationToken cancellationToken)
        {
            List<Zaznam> vsechny = await _store.ReadAsync<Zaznam>(FileName, cancellationToken);

            return vsechny
                .Where(x => x.KStavba == kStavba && x.Smazano == null)
                .OrderByDescending(x => x.Datum)
                .ThenByDescending(x => x.XId)
                .ToList();
        }

        public async Task<Zaznam> GetByIdAsync(int zaznamId, CancellationToken cancellationToken)
        {
            List<Zaznam> vsechny = await _store.ReadAsync<Zaznam>(FileName, cancellationToken);

            return vsechny.FirstOrDefault(x => x.XId == zaznamId && x.Smazano == null);
        }

        public async Task<Zaznam> InsertAsync(Zaznam zaznam, CancellationToken cancellationToken)
        {
            List<Zaznam> vsechny = await _store.ReadAsync<Zaznam>(FileName, cancellationToken);

            zaznam.XId = vsechny.Count == 0 ? 1 : vsechny.Max(x => x.XId) + 1;
            vsechny.Add(zaznam);

            await _store.WriteAsync(FileName, vsechny, cancellationToken);

            return zaznam;
        }

        public async Task UpdateAsync(Zaznam zaznam, CancellationToken cancellationToken)
        {
            List<Zaznam> vsechny = await _store.ReadAsync<Zaznam>(FileName, cancellationToken);

            int index = vsechny.FindIndex(x => x.XId == zaznam.XId);
            if (index < 0)
            {
                throw new BadDataException("Zaznam neexistuje.");
            }

            vsechny[index] = zaznam;

            await _store.WriteAsync(FileName, vsechny, cancellationToken);
        }
    }
}
