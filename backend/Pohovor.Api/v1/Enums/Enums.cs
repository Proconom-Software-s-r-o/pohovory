namespace Pohovor.Api.v1.Enums
{
    /// <summary>Pocasi zapsane v dennim zaznamu stavebniho deniku.</summary>
    public enum PocasiTyp
    {
        Jasno = 0,
        Polojasno = 1,
        Oblacno = 2,
        Dest = 3,
        Snih = 4,
        Mlha = 5,
    }

    /// <summary>Stav zaznamu ve schvalovacim procesu.</summary>
    public enum StavZaznamu
    {
        Rozpracovany = 0,
        Odeslany = 1,
        Schvaleny = 2,
    }
}
