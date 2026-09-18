using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pohovor.Api.v1.Modules.Ciselnik.Handlers;
using Pohovor.Commons;

namespace Pohovor.Api.v1.Modules.Ciselnik
{
    [AllowAnonymous]
    [Route("api/ciselnik")]
    [ApiController]
    public class CiselnikController : GeneralController
    {
        public CiselnikController(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        /// <summary>Vsechny ciselniky potrebne pro formular zaznamu.</summary>
        [HttpGet]
        public async Task<ActionResult<GetCiselnikyResponse>> GetCiselniky()
            => await ResolveResponse(new GetCiselnikyRequest());
    }
}
