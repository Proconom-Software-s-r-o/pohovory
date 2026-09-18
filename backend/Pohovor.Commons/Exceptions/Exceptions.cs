using System;

namespace Pohovor.Commons.Exceptions
{
    /// <summary>Spatna vstupni data - mapuje se na HTTP 400 vcetne zpravy pro uzivatele.</summary>
    public class BadDataException : Exception
    {
        public BadDataException(string msg) : base(msg) { }
    }

    /// <summary>Uzivatel nema opravneni na endpoint - mapuje se na HTTP 403.</summary>
    public class ForbiddenException : Exception
    {
        public ForbiddenException(string msg) : base(msg) { }
    }

    /// <summary>Neexistujici URL - mapuje se na HTTP 404. V handleru se nehazi, viz PR_REVIEW_RULES.</summary>
    public class NoDataFoundException : Exception
    {
    }

    /// <summary>Uspesne dokonceno bez obsahu - mapuje se na HTTP 204.</summary>
    public class NoContentOkException : Exception
    {
    }

    /// <summary>Konflikt soubezne editace - mapuje se na HTTP 409.</summary>
    public class ConcurrencyException : Exception
    {
        public ConcurrencyException(string msg) : base(msg) { }
    }

    /// <summary>Neprihlaseny uzivatel - mapuje se na HTTP 401.</summary>
    public class NotAuthenticatedException : Exception
    {
        public NotAuthenticatedException(string msg = null) : base(msg) { }
    }
}
