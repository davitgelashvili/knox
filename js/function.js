// if ($(document).innerWidth() > 992) {
//     $('body > section, header, footer, statistics').addClass("black");
// }
// $('body > section, header, footer, statistics').addClass("black");
$(document).ready(function(){
    setTimeout(() => { $('body').removeClass("loading") }, 300);

    setTimeout(() => {$('.slider__title--first').addClass('active')}, 500);
    setTimeout(() => {$('.slider__title--second').addClass('active')}, 900);

    // $(window).scroll(function() {
    //     if ($(this).scrollTop() > $('.slider__cover').height()) {
    //         $('body > *').removeClass("black");
    //         $('body > section, header, footer, .statistics').addClass("white");
    //     } else {
    //         $('body > section, header, footer, .statistics').removeClass("white");
    //         $('body > *').addClass("black");
    //     }
    // });
    
    // head scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 10) {
            $('.header').addClass("active");
        } else {
            $('.header').removeClass("active");
        }
    });

    // page scroll
    $(".navbar__link").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({scrollTop: $(hash).offset().top}, 800, function(){
                window.location.hash = hash;
            });
        }
    });
})

function projectSlider(){    
    $('.projects__slider').owlCarousel({
        onChange: callbackProject,
        margin:0,
        responsiveClass: true,
        dots: false,
        // dotsContainer: '.projects__slider--dots',
        navContainer: '.projects__slider--navs',
        navText: [
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z"/></svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z"/></svg>`
        ],
        responsive:{
            0:{
                items:1,
            }
        }
    })
    
    // $('.projects__slider--dots .owl-dot').on( 'click', function() {
    //     $('.projects__slider').trigger('to.owl.carousel', [$(this).index(), 300]);
    //     $( '.projects__slider--dots .owl-dot' ).removeClass( 'active' );
    //     $(this).addClass( 'active' );
    // })

    function callbackProject(event) {
        let count = event.property.value;
        $(".projects__slider--cover").css("display", "none")
        if (count > 0) {
            $(".projects__slider--cover[data-id='" + count + "']").css("display", "block")
        } else {
            $(".projects__slider--cover[data-id='" + 0 + "']").css("display", "block")
        }
    }
}