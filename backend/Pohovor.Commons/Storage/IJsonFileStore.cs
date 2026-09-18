using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Pohovor.Commons.Storage
{
    /// <summary>
    /// Uloziste dat. Misto databaze cte a zapisuje JSON soubory ve slozce nastavene
    /// v konfiguraci (<c>Storage:DataFolder</c>).
    /// </summary>
    public interface IJsonFileStore
    {
        /// <summary>Nacte kolekci ze souboru. Pokud soubor neexistuje, vrati prazdny seznam.</summary>
        Task<List<T>> ReadAsync<T>(string fileName, CancellationToken cancellationToken);

        /// <summary>Prepise soubor celou kolekci. Zapis je atomicky (zapis do .tmp + presun).</summary>
        Task WriteAsync<T>(string fileName, IReadOnlyCollection<T> items, CancellationToken cancellationToken);
    }
}
