// if ($(document).innerWidth() > 992) {
//     $('body > section, header, footer, statistics').addClass("black");
// }
$('body > section, header, footer, statistics').addClass("black");
$(document).ready(function(){
    setTimeout(() => { $('body').removeClass("loading") }, 300);

    setTimeout(() => {$('.slider__title--first').addClass('active')}, 500);
    setTimeout(() => {$('.slider__title--second').addClass('active')}, 900);

    $(window).scroll(function() {
        if ($(this).scrollTop() > $('.slider__cover').height()) {
            $('body > *').removeClass("black");
            $('body > section, header, footer, .statistics').addClass("white");
        } else {
            $('body > section, header, footer, .statistics').removeClass("white");
            $('body > *').addClass("black");
        }
    });
    
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
        dotsContainer: '.projects__slider--dots',
        responsive:{
            0:{
                items:1,
            }
        }
    })
    
    $('.projects__slider--dots .owl-dot').on( 'click', function() {
        $('.projects__slider').trigger('to.owl.carousel', [$(this).index(), 300]);
        $( '.projects__slider--dots .owl-dot' ).removeClass( 'active' );
        $(this).addClass( 'active' );
    })

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