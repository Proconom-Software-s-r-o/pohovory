using System;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pohovor.Commons.Claims;
using Pohovor.Commons.Exceptions;
using Pohovor.Commons.Logger;

namespace Pohovor.Commons
{
    /// <summary>
    /// Bazovy controller. Vsechny controllery z nej dedi a jedina vec, kterou smi delat,
    /// je predat request do <see cref="ResolveResponse{T}"/>. Mapovani vyjimek na HTTP kody
    /// a logovani resi tahle trida - v handleru se proto nikdy nepise try/catch kvuli HTTP kodum.
    /// </summary>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public class GeneralController : ControllerBase
    {
        protected readonly IMediator _mediator;
        protected readonly IMapper _mapper;
        protected readonly IRequestLogger _requestLogger;
        protected readonly IClaimResolver _claimResolver;
        protected readonly IConfiguration _configuration;
        protected readonly IServiceProvider _serviceProvider;

        public GeneralController(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;

            _mediator = serviceProvider.GetRequiredService<IMediator>();
            _mapper = serviceProvider.GetRequiredService<IMapper>();
            _requestLogger = serviceProvider.GetRequiredService<IRequestLogger>();
            _claimResolver = serviceProvider.GetRequiredService<IClaimResolver>();
            _configuration = serviceProvider.GetRequiredService<IConfiguration>();
        }

        protected virtual async Task<ActionResult> ResolveResponse<T>(IRequest<T> request)
        {
            ActionResult result;
            string errorMessage = null;

            try
            {
                T response = await _mediator.Send(request, HttpContext.RequestAborted);

                result = response is EmptyActionResponse
                    ? new NoContentResult()
                    : new OkObjectResult(response);
            }
            catch (NoDataFoundException)
            {
                result = new NotFoundResult();
            }
            catch (BadDataException ex)
            {
                errorMessage = ex.Message;
                result = new BadRequestObjectResult(new BadRequestResponse(ex.Message));
            }
            catch (ForbiddenException ex)
            {
                errorMessage = ex.Message;
                result = new ObjectResult(new ForbiddenError { Message = ex.Message }) { StatusCode = StatusCodes.Status403Forbidden };
            }
            catch (NotAuthenticatedException ex)
            {
                errorMessage = ex.Message;
                result = new UnauthorizedObjectResult(new ForbiddenError { Message = ex.Message });
            }
            catch (ConcurrencyException ex)
            {
                errorMessage = ex.Message;
                result = new ConflictObjectResult(new BadRequestResponse(ex.Message));
            }
            catch (NoContentOkException)
            {
                result = new NoContentResult();
            }

            _requestLogger.LogRequest(HttpContext.Request.Path, _claimResolver.ResolveUserName(), errorMessage);

            return result;
        }
    }
}
