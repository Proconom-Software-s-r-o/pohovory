using System.Collections.Generic;
using AutoMapper;
using Moq;
using Pohovor.Api.v1.DataManagers.StavbaManager;
using Pohovor.Api.v1.DataManagers.ZaznamManager;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Models;
using Pohovor.Commons.Claims;

namespace Pohovor.Api.UnitTests
{
    /// <summary>
    /// Spolecna priprava pro testy handleru - zamockovane managery a realny AutoMapper.
    /// </summary>
    public abstract class ZaznamHandlerTestBase
    {
        protected const string TestUser = "Testovaci Uzivatel";

        protected readonly Mock<IZaznamManager> ZaznamManagerMock = new();
        protected readonly Mock<IStavbaManager> StavbaManagerMock = new();
        protected readonly Mock<IClaimResolver> ClaimResolverMock = new();
        protected readonly IMapper Mapper;

        protected ZaznamHandlerTestBase()
        {
            MapperConfiguration configuration = new(config =>
            {
                config.RecognizePrefixes("X");
                config.AddProfile<ZaznamDTOProfile>();
            });

            Mapper = configuration.CreateMapper();

            ClaimResolverMock.Setup(x => x.ResolveUserName()).Returns(TestUser);

            StavbaManagerMock
                .Setup(x => x.GetByIdAsync(It.IsAny<int>(), It.IsAny<System.Threading.CancellationToken>()))
                .ReturnsAsync((int id, System.Threading.CancellationToken _) =>
                    id == ExistujiciStavbaId ? new Stavba { XId = id, Nazev = "Testovaci stavba", Aktivni = true } : null);

            ZaznamManagerMock
                .Setup(x => x.InsertAsync(It.IsAny<Zaznam>(), It.IsAny<System.Threading.CancellationToken>()))
                .ReturnsAsync((Zaznam zaznam, System.Threading.CancellationToken _) =>
                {
                    zaznam.XId = 42;
                    UlozeneZaznamy.Add(zaznam);
                    return zaznam;
                });
        }

        protected const int ExistujiciStavbaId = 1;
        protected const int NeexistujiciStavbaId = 12345;

        protected List<Zaznam> UlozeneZaznamy { get; } = new();
    }
}
