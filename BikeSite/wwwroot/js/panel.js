/*function smoothlyDelete(target) {
    
    target.animate({
      opacity: "-=1"
    }, 1000, function() {
      target.removeClass("tab__active");
    })
};
*/

$('.tab').each(function() {
    let $this = $(this);
    console.log("This:", this);
    let $tab = $this.find("li.tab__active");
    console.log("Tab: ", $tab)
    let $link = $tab.find('a');
    console.log("Link 1: ", $link)
    let $panel = $($link.attr('href'));
    console.log("Panel: ", $panel);

    $this.on('click', ".tab__header", function(e) {
        e.preventDefault();
        let $link = $(this);
        console.log("Link", $link)
        let id = this.hash;
        console.log("Id", id);
        $panel_div = $($panel);
        if(id && !$link.is('.tab__active')) {
            //$panel.removeClass("tab__active");
            //smoothlyDelete($tab);
            //$tab.css('opacity', 0);
            $tab.removeClass("tab__active");
            $panel_div.removeClass("tab__active");
            $panel = $(id).addClass("tab__active");
            $tab = $link.parent().addClass("tab__active");
        }
    });
});


