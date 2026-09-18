using System;

namespace Pohovor.Commons
{
    /// <summary>
    /// Bazova trida pro vsechny odpovedi handleru.
    /// </summary>
    public abstract class Response
    {
    }

    /// <summary>
    /// Odpoved bez obsahu - <see cref="GeneralController"/> ji preklada na HTTP 204.
    /// </summary>
    public class EmptyActionResponse : Response
    {
    }

    /// <summary>
    /// Telo odpovedi pro HTTP 400. Frontend cte property <c>Message</c>.
    /// </summary>
    public class BadRequestResponse
    {
        public BadRequestResponse(string message)
        {
            Message = message;
        }

        public string Message { get; set; }
    }

    /// <summary>
    /// Telo odpovedi pro HTTP 401 / 403.
    /// </summary>
    public class ForbiddenError
    {
        public string Message { get; set; }
    }
}
