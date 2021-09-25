/*$(window).on('load',function(){

});*/
/*$(document).ready(function(){
	$("").slideToggle(function() {
		$(this).addClass("");
	},function(){
		$(this).removeClass("");
	});
});*/

$(".menu li").click(function(){
    $(".menu li.active").removeClass("active");
    $(this).addClass("active");
})

$('.slider_one').owlCarousel({
    loop:false,
	center:true,
    margin:20,
    navText: ['<i class="fas fa-long-arrow-alt-left"></i>','<i class="fas fa-long-arrow-alt-right"></i>'],
    dots: false,
    nav: true,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            stagePadding: 100,
        },
        768:{
            items:3,
            stagePadding: 50,
        },
    }
})