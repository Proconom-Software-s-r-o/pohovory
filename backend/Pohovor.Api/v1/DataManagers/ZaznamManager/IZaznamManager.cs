using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Pohovor.Api.v1.Models;

namespace Pohovor.Api.v1.DataManagers.ZaznamManager
{
    /// <summary>
    /// Pristup k zaznamum stavebniho deniku. Handler nikdy nesaha na uloziste primo,
    /// stejne jako v ostre aplikaci nesaha primo na DbContext.
    /// </summary>
    public interface IZaznamManager
    {
        /// <summary>Vrati nesmazane zaznamy stavby serazene od nejnovejsiho.</summary>
        Task<List<Zaznam>> GetByStavbaAsync(int kStavba, CancellationToken cancellationToken);

        /// <summary>Vrati nesmazany zaznam, nebo <c>null</c>.</summary>
        Task<Zaznam> GetByIdAsync(int zaznamId, CancellationToken cancellationToken);

        /// <summary>Vlozi novy zaznam a doplni mu <c>XId</c>. Vraci ulozeny zaznam.</summary>
        Task<Zaznam> InsertAsync(Zaznam zaznam, CancellationToken cancellationToken);

        /// <summary>Prepise existujici zaznam.</summary>
        Task UpdateAsync(Zaznam zaznam, CancellationToken cancellationToken);
    }
}
