$(document).ready(function(){
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

    function fetcFun(){
        fetch('../projects.json')
        .then(response => response.json())
        .then(json => json.map( (item, id)=> {
            $('.projects__slider--list').append(`
                <img class="projects__slider--cover" src="../img/projects/${item.img}" alt="" data-id="${id}" style="display: none;">
            `)
            $('.projects__slider').append(`
                <div class="projects__slider--item">
                    <div class="projects__slider--texts">
                        <h1 class="projects__slider--title caps-roman">
                            <a href="${item.url}" target="_blank">${item.title}</a>
                        </h1>
                        <div class="projects__slider--desc h-roman">
                            <p>${item.desc}</p>
                        </div>
                    </div>
                </div>
            `)
        })).finally(()=> projectSlider());
    }
    fetcFun()

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

})