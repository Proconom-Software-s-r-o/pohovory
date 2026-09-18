using Microsoft.Extensions.Logging;

namespace Pohovor.Commons.Logger
{
    /// <summary>
    /// Centralni logovani requestu - vola se automaticky z <see cref="GeneralController.ResolveResponse{T}"/>.
    /// </summary>
    public interface IRequestLogger
    {
        void LogRequest(string endpoint, string user, string errorMessage);
    }

    public class RequestLogger : IRequestLogger
    {
        private readonly ILogger<RequestLogger> _logger;

        public RequestLogger(ILogger<RequestLogger> logger)
        {
            _logger = logger;
        }

        public void LogRequest(string endpoint, string user, string errorMessage)
        {
            if (string.IsNullOrEmpty(errorMessage))
            {
                _logger.LogInformation("{Endpoint} OK (uzivatel: {User})", endpoint, user);
                return;
            }

            _logger.LogWarning("{Endpoint} CHYBA: {Error} (uzivatel: {User})", endpoint, errorMessage, user);
        }
    }
}
