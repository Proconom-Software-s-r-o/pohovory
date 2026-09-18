using System;
using System.Threading;
using System.Threading.Tasks;
using Moq;
using Pohovor.Api.v1.DTOS.Zaznamy;
using Pohovor.Api.v1.Enums;
using Pohovor.Api.v1.Models;
using Pohovor.Api.v1.Modules.Zaznamy.Handlers;
using Pohovor.Commons.Exceptions;
using Xunit;

namespace Pohovor.Api.UnitTests
{
    /// <summary>
    /// Testy editace zaznamu - prepis editovatelnych property a zamek na schvaleny zaznam.
    /// </summary>
    public class UpdateZaznamHandlerTests : ZaznamHandlerTestBase
    {
        private const int ExistujiciZaznamId = 7;

        private UpdateZaznamHandler VytvorHandler(Zaznam ulozeny)
        {
            ZaznamManagerMock
                .Setup(x => x.GetByIdAsync(ExistujiciZaznamId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(ulozeny);

            return new UpdateZaznamHandler(ZaznamManagerMock.Object, Mapper);
        }

        private static Zaznam UlozenyZaznam(StavZaznamu stav = StavZaznamu.Rozpracovany) => new()
        {
            XId = ExistujiciZaznamId,
            KStavba = ExistujiciStavbaId,
            Datum = new DateTime(2026, 9, 10),
            Pocasi = PocasiTyp.Jasno,
            PocetPracovniku = 3,
            Popis = "Puvodni popis",
            Autor = "Původní autor",
            Stav = stav,
            Vytvoreno = new DateTime(2026, 9, 10, 16, 0, 0),
        };

        private static ZaznamUpdateDTO PlatneDTO() => new()
        {
            Datum = new DateTime(2026, 9, 11),
            Pocasi = PocasiTyp.Dest,
            TeplotaRano = 4,
            TeplotaOdpoledne = 9,
            PocetPracovniku = 9,
            Popis = "Upravený popis",
            Stav = StavZaznamu.Odeslany,
        };

        [Fact]
        public async Task Handle_PlatnyVstup_PrepiseEditovatelnePropertyANechaAutora()
        {
            UpdateZaznamHandler handler = VytvorHandler(UlozenyZaznam());

            UpdateZaznamResponse response = await handler.Handle(
                new UpdateZaznamRequest { ZaznamId = ExistujiciZaznamId, Zaznam = PlatneDTO() },
                CancellationToken.None);

            Assert.Equal("Upravený popis", response.Zaznam.Popis);
            Assert.Equal(PocasiTyp.Dest, response.Zaznam.Pocasi);
            Assert.Equal(9, response.Zaznam.PocetPracovniku);
            Assert.Equal(StavZaznamu.Odeslany, response.Zaznam.Stav);
            Assert.Equal("Původní autor", response.Zaznam.Autor);
            Assert.NotNull(response.Zaznam.Zmeneno);
        }

        [Fact]
        public async Task Handle_PlatnyVstup_UlozPresManager()
        {
            UpdateZaznamHandler handler = VytvorHandler(UlozenyZaznam());

            await handler.Handle(
                new UpdateZaznamRequest { ZaznamId = ExistujiciZaznamId, Zaznam = PlatneDTO() },
                CancellationToken.None);

            ZaznamManagerMock.Verify(
                x => x.UpdateAsync(It.Is<Zaznam>(z => z.XId == ExistujiciZaznamId), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Handle_SchvalenyZaznam_VyhodiBadData()
        {
            UpdateZaznamHandler handler = VytvorHandler(UlozenyZaznam(StavZaznamu.Schvaleny));

            BadDataException ex = await Assert.ThrowsAsync<BadDataException>(() => handler.Handle(
                new UpdateZaznamRequest { ZaznamId = ExistujiciZaznamId, Zaznam = PlatneDTO() },
                CancellationToken.None));

            Assert.Equal("Schvaleny zaznam nelze upravit.", ex.Message);
            ZaznamManagerMock.Verify(
                x => x.UpdateAsync(It.IsAny<Zaznam>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        [Fact]
        public async Task Handle_NeexistujiciZaznam_VyhodiBadData()
        {
            UpdateZaznamHandler handler = VytvorHandler(null);

            BadDataException ex = await Assert.ThrowsAsync<BadDataException>(() => handler.Handle(
                new UpdateZaznamRequest { ZaznamId = ExistujiciZaznamId, Zaznam = PlatneDTO() },
                CancellationToken.None));

            Assert.Equal("Zaznam neexistuje.", ex.Message);
        }
    }
}
