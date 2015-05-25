$(document).ready(function(){
	var cardSize = 0.75;
    var gameName = "Cards Against Humanity";
    ///////// PARSE CARD TYPES ////////////
    var answerCards = masterCards.filter(isAnswerCard);
    var questionCards = masterCards.filter(isQuestionCard);
    /////// SIMPLE CONSOLE LOGGING - Card Count Check //////////
    console.log("Answers: ",answerCards.length);
    console.log("Questions: ",questionCards.length);
    console.log("Total Cards: ",masterCards.length);
    /////////// INIT /////////////
    getCards(masterCards,10);
    ///////////// MAIN FUNCTION TO BUILD CARDS //////////
    function getCards(cardData,qty){
        for (i=0;i<qty;i++){
            var randomCard = Math.floor(Math.random() * cardData.length) + 1;
            var myCard  = cardData[randomCard];
            var cardColor = myCard.cardType == "A" ? 'white' : 'black';
            if(i == 0 && qty > 1){
                $("#player").append("<div class='card "+cardColor+"' style='display:block;'><div class='avatar' style='display: block; background-image: url()'><div class='value'>"+myCard.text+"</div><div id='state' class=''></div><div class='cardNum'>Card #:"+myCard.id+"</div></div>");
            }else{
                $("#player").append("<div class='card "+cardColor+"'><div class='avatar' style='display: block; background-image: url()'><div class='value'>"+myCard.text+"</div><div id='state' class=''></div><div class='cardNum'>Card #:"+myCard.id+"</div></div>");
            }
            
        }
    }
    ////// BREAK OUT THE ANSWER CARDS ////
    function isAnswerCard(obj) {
        if ('id' in obj && obj.cardType === "A") {
            return true;
        } else {
            return false;
        }
    }
    ////// BREAK OUT THE QUESTION CARDS
    function isQuestionCard(obj) {
        if ('id' in obj && obj.cardType === "Q") {
            return true;
        } else {
            return false;
        }
    }
    ////// USER ACTIONS //////
    $(document).on("swiperight",".card",function(){
        $(this).addClass('rotate-left').delay(700).fadeOut(1);
        if ( $(this).is(':first-child') ) {
            $('.card:last-child').removeClass ('rotate-left rotate-right').fadeIn(300);
        } else {
            $(this).prev().removeClass('rotate-left rotate-right').fadeIn(400);
        }
    });  
    $(document).on("swipeleft",".card",function(){
        $(this).addClass('rotate-right').delay(700).fadeOut(1);
        if ( $(this).is(':last-child') ) {
            $('.card:nth-child(1)').removeClass ('rotate-left rotate-right').fadeIn(300);
        } else {
            $(this).next().removeClass('rotate-left rotate-right').fadeIn(400);
        } 
    });
    $(document).on('swipeup','.card',function(){
        console.log("swipeup..");
        $("#status-message").text("Submitting Card to Czar");
        $(this).addClass('flick-submit').delay(700).fadeOut(1,function(){
            $(this).remove();
            $("#status-message").text("");
            getCards(answerCards,1);
            if ( $(this).is(':last-child') ) {
                $('.card:first-child').removeClass ('rotate-left rotate-right').fadeIn(300);
            }else if ($(this).is(':first-child')){ 
                $('.card:last-child').removeClass ('rotate-left rotate-right').fadeIn(300);
            }else {
                $('.card:last-child').removeClass ('rotate-left rotate-right').fadeIn(300);
            }
        });
    });
    $(document).on('swipedown','.card',function(){
        console.log("swipedown..");
    });    
    $(document).on("press",".card",function(){
        $(this).find("#state").hasClass("selected") ? $(this).find("#state").removeClass("selected"): $(this).find("#state").addClass("selected");
        // $(this).prepend("<div class='selected'></div>");
    });
    $(document).on("click",".newcard.button",function(){
        getCards(answerCards,1);
    });
    $(document).on("tap",".newcard.button",function(){
        getCards(answerCards,1);
    });
    $(document).on("click",".newhand.button",function(){
        $("#player").html("");
        getCards(answerCards,10);
    });
    $(document).on("tap",".newhand.button",function(){
        $("#player").html("");
        getCards(answerCards,10);
    });
});

var supportTouch = $.support.touch,
            scrollEvent = "touchmove scroll",
            touchStartEvent = supportTouch ? "touchstart" : "mousedown",
            touchStopEvent = supportTouch ? "touchend" : "mouseup",
            touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
    $.event.special.swipeupdown = {
        setup: function() {
            var thisObject = this;
            var $this = $(thisObject);
            $this.bind(touchStartEvent, function(event) {
                var data = event.originalEvent.touches ?
                        event.originalEvent.touches[ 0 ] :
                        event,
                        start = {
                            time: (new Date).getTime(),
                            coords: [ data.pageX, data.pageY ],
                            origin: $(event.target)
                        },
                        stop;

                function moveHandler(event) {
                    if (!start) {
                        return;
                    }
                    var data = event.originalEvent.touches ?
                            event.originalEvent.touches[ 0 ] :
                            event;
                    stop = {
                        time: (new Date).getTime(),
                        coords: [ data.pageX, data.pageY ]
                    };

                    // prevent scrolling
                    if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                        event.preventDefault();
                    }
                }
                $this
                        .bind(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function(event) {
                    $this.unbind(touchMoveEvent, moveHandler);
                    if (start && stop) {
                        if (stop.time - start.time < 1000 &&
                                Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                            start.origin
                                    .trigger("swipeupdown")
                                    .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                        }
                    }
                    start = stop = undefined;
                });
            });
        }
    };
    $.each({
        swipedown: "swipeupdown",
        swipeup: "swipeupdown"
    }, function(event, sourceEvent){
        $.event.special[event] = {
            setup: function(){
                $(this).bind(sourceEvent, $.noop);
            }
        };
    });