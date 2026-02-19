(function ($) {

    "use strict";



    // Spinner

    var spinner = function () {

        setTimeout(function () {

            if ($('#spinner').length > 0) {

                $('#spinner').removeClass('show');

            }

        }, 1);

    };

    spinner();

    

    

    // Initiate the wowjs

    new WOW().init();





    // Sticky Navbar

    $(window).scroll(function () {

        if ($(this).scrollTop() > 90) {

            $('.nav-bar').addClass('sticky-top shadow-sm');

            $('.nav-bar-shape').addClass('sticky-top shadow-sm');

        } else {

            $('.nav-bar').removeClass('sticky-top shadow-sm');

            $('.nav-bar-shape').removeClass('sticky-top shadow-sm');

        }

    });

    

    // Dropdown on mouse hover

    const $dropdown = $(".dropdown");

    const $dropdownToggle = $(".dropdown-toggle");

    const $dropdownMenu = $(".dropdown-menu");

    const showClass = "show";

    

    $(window).on("load resize", function() {

        if (this.matchMedia("(min-width: 992px)").matches) {

            $dropdown.hover(

            function() {

                const $this = $(this);

                $this.addClass(showClass);

                $this.find($dropdownToggle).attr("aria-expanded", "true");

                $this.find($dropdownMenu).addClass(showClass);

            },

            function() {

                const $this = $(this);

                $this.removeClass(showClass);

                $this.find($dropdownToggle).attr("aria-expanded", "false");

                $this.find($dropdownMenu).removeClass(showClass);

            }

            );

        } else {

            $dropdown.off("mouseenter mouseleave");

        }

    });





    // Facts counter

    $('[data-toggle="counter-up"]').counterUp({

        delay: 10,

        time: 2000

    });





    // Modal Video

    $(document).ready(function () {

        var $videoSrc;

        $('.btn-play').click(function () {

            $videoSrc = $(this).data("src");

        });

        console.log($videoSrc);



        $('#videoModal').on('shown.bs.modal', function (e) {

            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");

        })



        $('#videoModal').on('hide.bs.modal', function (e) {

            $("#video").attr('src', $videoSrc);

        })

    });





    // Progress bar

    $('.skill').waypoint(function () {

        $('.progress .progress-bar').each(function () {

            $(this).css("width", $(this).attr("aria-valuenow") + '%');

        });

    }, {offset: '80%'});

    

    

    // Back to top button

    $(window).scroll(function () {

        if ($(this).scrollTop() > 100) {

            $('.back-to-top').fadeIn('slow');

        } else {

            $('.back-to-top').fadeOut('slow');

        }

    });

    $('.back-to-top').click(function () {

        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');

        return false;

    });





    // Testimonial Slider

    $('.testimonial-slider').slick({

        infinite: true,

        autoplay: true,

        arrows: false,

        dots: false,

        slidesToShow: 1,

        slidesToScroll: 1,

        asNavFor: '.testimonial-slider-nav'

    });

    $('.testimonial-slider-nav').slick({

        arrows: false,

        dots: false,

        focusOnSelect: true,

        centerMode: true,

        centerPadding: '22px',

        slidesToShow: 3,

        asNavFor: '.testimonial-slider'

    });

    $('.testimonial .slider-nav').css({"position": "relative", "height": "160px"});





    // Testimonials carousel

    $(".testimonial-carousel").owlCarousel({

        autoplay: true,

        smartSpeed: 1500,

        margin: 35,

        dots: true,

        loop: true,

        nav : true,

        navText : [

            '<i class="fa fa-angle-left"></i>',

            '<i class="fa fa-angle-right"></i>'

        ],

        responsive: {

            0:{

                items:1

            },

            992:{

                items:2

            }

        }

    });





    // Portfolio isotope and filter

    var portfolioIsotope = $('.portfolio-container').isotope({

        itemSelector: '.portfolio-item',

        layoutMode: 'fitRows'

    });

    $('#portfolio-flters li').on('click', function () {

        $("#portfolio-flters li").removeClass('active');

        $(this).addClass('active');



        portfolioIsotope.isotope({filter: $(this).data('filter')});

    });





    // Related post carousel

    $(".related-carousel").owlCarousel({

        autoplay: true,

        margin: 30,

        dots: false,

        loop: true,

        nav : true,

        navText : [

            '<i class="fa fa-angle-left" aria-hidden="true"></i>',

            '<i class="fa fa-angle-right" aria-hidden="true"></i>'

        ],

        responsive: {

            0:{

                items:1

            },

            768:{

                items:2

            }

        }

    });

    

})(jQuery);



