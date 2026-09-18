using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pohovor.Api.v1.Modules.Zaznamy.Handlers;
using Pohovor.Commons;

namespace Pohovor.Api.v1.Modules.Zaznamy
{
    /// <summary>
    /// Denni zaznamy stavebniho deniku.
    ///
    /// Controller je zamerne "tenky" - jen routing, atributy a predani requestu do ResolveResponse.
    /// Zadna byznys logika sem nepatri.
    /// </summary>
    [AllowAnonymous] // v ostre aplikaci by tu bylo [Authorize(Roles = Role.V1User)], tady kvuli jednoduchosti pohovoru ne
    [Route("api/zaznamy")]
    [ApiController]
    public class ZaznamyController : GeneralController
    {
        public ZaznamyController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        /// <summary>Seznam zaznamu stavby s volitelnym fulltextem a filtrem na stav.</summary>
        [HttpGet]
        public async Task<ActionResult<GetZaznamyResponse>> GetZaznamy([FromQuery] GetZaznamyRequest request)
            => await ResolveResponse(request);

        /// <summary>Detail jednoho zaznamu.</summary>
        [HttpGet]
        [Route("{ZaznamId}")]
        public async Task<ActionResult<GetZaznamDetailResponse>> GetZaznamDetail([FromRoute] GetZaznamDetailRequest request)
            => await ResolveResponse(request);

        /// <summary>Zalozeni noveho zaznamu.</summary>
        [HttpPost]
        public async Task<ActionResult<CreateZaznamResponse>> CreateZaznam([FromBody] CreateZaznamRequest request)
            => await ResolveResponse(request);

        /// <summary>Editace zaznamu.</summary>
        [HttpPut]
        [Route("{ZaznamId}")]
        public async Task<ActionResult<UpdateZaznamResponse>> UpdateZaznam(UpdateZaznamRequest request)
            => await ResolveResponse(request);

        /// <summary>Smazani zaznamu (soft delete).</summary>
        [HttpDelete]
        [Route("{ZaznamId}")]
        public async Task<ActionResult<EmptyActionResponse>> DeleteZaznam([FromRoute] DeleteZaznamRequest request)
            => await ResolveResponse(request);
    }
}
