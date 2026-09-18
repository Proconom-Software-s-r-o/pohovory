using System;
using System.Threading;
using System.Threading.Tasks;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Modules.Zaznamy.Handlers;
using Pohovor.Commons.Exceptions;
using Xunit;

namespace Pohovor.Api.UnitTests
{
    /// <summary>
    /// Testy zakladani zaznamu - doplneni autora a stavu serverem i vsechny validace.
    /// </summary>
    public class CreateZaznamHandlerTests : ZaznamHandlerTestBase
    {
        private CreateZaznamHandler VytvorHandler() => new(
            ZaznamManagerMock.Object,
            StavbaManagerMock.Object,
            ClaimResolverMock.Object,
            Mapper);

        private static ZaznamCreateDTO PlatneDTO(int kStavba = ExistujiciStavbaId) => new()
        {
            KStavba = kStavba,
            Datum = DateTime.Today,
            Pocasi = PocasiTyp.Oblacno,
            TeplotaRano = 8,
            TeplotaOdpoledne = 15,
            PocetPracovniku = 6,
            Popis = "Montáž bednění stropní desky.",
        };

        [Fact]
        public async Task Handle_PlatnyVstup_UlozZaznamAVratHoSId()
        {
            CreateZaznamHandler handler = VytvorHandler();

            CreateZaznamResponse response = await handler.Handle(
                new CreateZaznamRequest { Zaznam = PlatneDTO() },
                CancellationToken.None);

            Assert.NotNull(response.Zaznam);
            Assert.Equal(42, response.Zaznam.Id);
            Assert.Equal("Montáž bednění stropní desky.", response.Zaznam.Popis);
            Assert.Single(UlozeneZaznamy);
        }

        [Fact]
        public async Task Handle_PlatnyVstup_DoplniAutoraStavARazitko()
        {
            CreateZaznamHandler handler = VytvorHandler();

            CreateZaznamResponse response = await handler.Handle(
                new CreateZaznamRequest { Zaznam = PlatneDTO() },
                CancellationToken.None);

            Assert.Equal(TestUser, response.Zaznam.Autor);
            Assert.Equal(StavZaznamu.Rozpracovany, response.Zaznam.Stav);
            Assert.NotEqual(default, response.Zaznam.Vytvoreno);
        }

        [Fact]
        public async Task Handle_NeexistujiciStavba_VyhodiBadData()
        {
            CreateZaznamHandler handler = VytvorHandler();

            BadDataException ex = await Assert.ThrowsAsync<BadDataException>(() => handler.Handle(
                new CreateZaznamRequest { Zaznam = PlatneDTO(NeexistujiciStavbaId) },
                CancellationToken.None));

            Assert.Equal("Stavba neexistuje.", ex.Message);
            Assert.Empty(UlozeneZaznamy);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("   ")]
        public async Task Handle_PrazdnyPopis_VyhodiBadData(string popis)
        {
            CreateZaznamHandler handler = VytvorHandler();

            ZaznamCreateDTO dto = PlatneDTO();
            dto.Popis = popis;

            await Assert.ThrowsAsync<BadDataException>(() => handler.Handle(
                new CreateZaznamRequest { Zaznam = dto },
                CancellationToken.None));

            Assert.Empty(UlozeneZaznamy);
        }

        [Fact]
        public async Task Handle_DatumVBudoucnosti_VyhodiBadData()
        {
            CreateZaznamHandler handler = VytvorHandler();

            ZaznamCreateDTO dto = PlatneDTO();
            dto.Datum = DateTime.Today.AddDays(1);

            await Assert.ThrowsAsync<BadDataException>(() => handler.Handle(
                new CreateZaznamRequest { Zaznam = dto },
                CancellationToken.None));

            Assert.Empty(UlozeneZaznamy);
        }
    }
}
