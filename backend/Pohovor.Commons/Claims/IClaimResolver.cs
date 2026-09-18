using Microsoft.AspNetCore.Http;

namespace Pohovor.Commons.Claims
{
    /// <summary>
    /// Cteni aktualne prihlaseneho uzivatele. V ostre aplikaci cte claimy z JWT,
    /// tady pro jednoduchost hlavicku <c>X-User</c> s fallbackem na konfiguraci.
    /// </summary>
    public interface IClaimResolver
    {
        string ResolveUserName();
    }

    public class ClaimResolver : IClaimResolver
    {
        public const string UserHeader = "X-User";
        private const string DefaultUser = "Neznamy uzivatel";

        private readonly IHttpContextAccessor _httpContextAccessor;

        public ClaimResolver(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string ResolveUserName()
        {
            HttpContext context = _httpContextAccessor.HttpContext;
            if (context == null)
            {
                return DefaultUser;
            }

            string user = context.Request.Headers[UserHeader];
            return string.IsNullOrWhiteSpace(user) ? DefaultUser : user;
        }
    }
}
