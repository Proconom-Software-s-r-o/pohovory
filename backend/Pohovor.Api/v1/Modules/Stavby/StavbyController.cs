using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pohovor.Api.v1.Modules.Stavby.Handlers;
using Pohovor.Commons;

namespace Pohovor.Api.v1.Modules.Stavby
{
    [AllowAnonymous]
    [Route("api/stavby")]
    [ApiController]
    public class StavbyController : GeneralController
    {
        public StavbyController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        /// <summary>Seznam aktivnich staveb.</summary>
        [HttpGet]
        public async Task<ActionResult<GetStavbyResponse>> GetStavby()
            => await ResolveResponse(new GetStavbyRequest());
    }
}
