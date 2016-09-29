(function ($) {
    $(function () {

    

        $(document).on('click', '.modal-ajax', function() {
            $.get(this.href, function(html) {
                $(html).appendTo('body').modal({
                    fadeDuration: 300,
                    showClose: false
                });
            });
            return false;
        });



        $(window).bind('scroll', function(e){
            if ($(this).scrollTop() > 83) {
                $('.header').addClass('shadow')
            } else {
                $('.header').removeClass('shadow')
            }
            e.preventDefault();
        });


        $('#cpf').mask('000.000.000-00', {reverse: true});

    });

})(jQuery);