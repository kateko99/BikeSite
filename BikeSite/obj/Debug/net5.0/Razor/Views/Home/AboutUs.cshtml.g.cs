#pragma checksum "C:\Users\Lenovo\Desktop\Praca inżynierska\BikeSite\BikeSite\Views\Home\AboutUs.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "838619256b328a39b29c4712d5fbc6507f0e5ce4"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_AboutUs), @"mvc.1.0.view", @"/Views/Home/AboutUs.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\Lenovo\Desktop\Praca inżynierska\BikeSite\BikeSite\Views\_ViewImports.cshtml"
using BikeSite;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\Lenovo\Desktop\Praca inżynierska\BikeSite\BikeSite\Views\_ViewImports.cshtml"
using BikeSite.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"838619256b328a39b29c4712d5fbc6507f0e5ce4", @"/Views/Home/AboutUs.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"bceb462c54998181f45c0d02274bd64723d7d792", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_AboutUs : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral(@"<div class=""content"">
    <div class=""content__log"">
        <h2 class=""info__header info__header--first"">O aplikacji</h2>
        <p class=""info__text"">
            Aplikacja przeznaczona jest dla rowerzystów, planujących wycieczki rowerowe na terenie Wyżyny
            Krakowsko-Częstochowskiej. Na podstawie narysowanej trasy, wyliczana jest nawierzchnia. Dane z dróg
            pochodzą z otwartego źródła dannych OpenStreetMap. Oprócz dróg, mapa dostarcza informacji na temat
            ciekawych miejsc i zabytków, znajdujących się w pobliżu - wszystkie dane pochodzą również z
            OpenStreetMap.
        </p>
        <h3 class=""info__header"">Wyszukiwanie trasy</h3>
        <p class=""info__text"">
            W podstawowym panelu aplikacji dostępna jest wyszukiwarka dróg, w której wyróżnione zostały
            trzy kategorie:
        </p>
        <ul class=""info__ul"">
            <li class=""info__list"">
                <span class=""info__route"">Trasa asfaltowa</span> - trasa, w które");
            WriteLiteral(@"j droga zawiera min. 90% nawierzchni asfaltowej.
                <div class=""info__gallery"">
                    <img class=""info__photo"" src=""/img/roads/trunk.jpg"" alt=""Droga asfaltowa"">
                    <img class=""info__photo"" src=""/img/roads/secondary.jpg"" alt=""Droga asfaltowa"">
                    <img class=""info__photo"" src=""/img/roads/tertiary.jpg"" alt=""Droga asfaltowa"">
                    <img class=""info__photo"" src=""/img/roads/residential.jpg"" alt=""Droga asfaltowa"">
                    <p class=""info__annotation"">Przykładowe drogi.</br> Źródło: <a href=""https://wiki.openstreetmap.org/wiki/Key:highway"" target=""_blank"">OpenStreetMap</a></p>
                </div>
            </li>
            <li class=""info__list"">
                <span class=""info__route"">Trasa leśna</span> - trasa, w której droga zawiera min. 90% nawierzchni leśnej.
                <div class=""info__gallery"">
                    <img class=""info__photo"" src=""/img/roads/track.jpg"" alt=""Droga leśna"">
               ");
            WriteLiteral(@"     <img class=""info__photo"" src=""/img/roads/track2.jpg"" alt=""Droga leśna"">
                    <img class=""info__photo"" src=""/img/roads/track3.jpg"" alt=""Droga leśna"">
                    <img class=""info__photo"" src=""/img/roads/path.jpg"" alt=""Droga leśna"">
                    <p class=""info__annotation"">Przykładowe drogi.</br>Źródło: <a href=""https://wiki.openstreetmap.org/wiki/Key:highway"" target=""_blank"">OpenStreetMap</a></p>
                </div>
            </li>
            <li class=""info__list""><span class=""info__route"">Trasa mieszana</span> - pozostałe trasy</li>
        </ul>

        <h3 class=""info__header"">Dodawanie trasy</h3>
        <p class=""info__text"">Po wybraniu odpowiedniej zakładki, ukazuje się menu rysowania. Trasę zaznaczamy, dociągając do odpowiednich wierzchołków. Przybornik po lewej stronie mapy pozwala na edytowanie i modyfikację utworzonej trasy. Następnie należy wypełnić informacje: nazwę, opis trasy, poziom trudności, ewentualne dodanie do ulubionych i zatwierdzić swó");
            WriteLiteral(@"j wybór. Po pomyślnym przebiegu procedury, trasa zostanie dodana, a po prawej stronie pojawi się zakładka z jej szczegółami. </p>
        <img class=""info__photo info__photo--add"" src=""/img/add_route.png"">
        <h3 class=""info__header"">Szczegóły trasy</h3>
        <p class=""info__text"">Po dodaniu trasy lub kliknięciu na wyszukaną trasę, wyświetlane są szczegóły. Na pasku wyświetlona jest nawierzchnia trasy. Kategoria ""Niezdefiniowana"" obejmuje te odcinki, które nie zostały dociągnięte do dróg na mapie i znajdują się poza oficjalnymi drogami.</p>
        <img class=""info__photo info__photo--add"" src=""/img/description.png"" alt=""Zakładka ze szczegółami trasy"">
    </div>
</div>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
