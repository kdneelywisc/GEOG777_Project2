function initialize(){
    var $splashCloseButton = $('#splash-close-btn');
    var $splash = $('#splash');
    var $headerDropdownMenu = $('#header-dropdown-menu');
    var $headerDropdownButton = $('#header-button');
    var $aboutMenuItem = $('#about-menu-item');
    var $dataMenuItem = $('#data-menu-item');
    var $dataSplash = $('.data-page-splash');
    var $dataCloseButton = $('#data-close-btn');
    


    $splashCloseButton.click(function () {
        $splash.fadeOut('slow');
    });

    $dataCloseButton.click(function () {
        $dataSplash.fadeOut('slow');
    });

    $aboutMenuItem.click(function() {
        $splash.fadeIn('slow');
    });

    $dataMenuItem.click(function() {
        
        $dataSplash.fadeIn('slow');
    });

    $headerDropdownButton.click(function () {
        $headerDropdownMenu.slideToggle();
    });




};

$(document).ready(initialize);
