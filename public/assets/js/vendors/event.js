/* ============================================================
 * Calendar
 * This is a Demo App that was created using Pages Calendar Plugin
 * We have demonstrated a few function that are useful in creating
 * a custom calendar. Please refer docs for more information
 * ============================================================ */

(function ($) {

    'use strict';

    $(document).ready(function () {

        var selectedEvent;
        $('#myCalendar').pagescalendar({
            ui: {
                //Year Selector
                year: {
                    visible: true,
                    format: 'YYYY',
                    startYear: moment().subtract(4, 'year').format('YYYY'),
                    endYear: moment().add(3, 'year').format('YYYY'),
                    eventBubble: true
                },
                //Month Selector
                month: {
                    visible: true,
                    format: 'MMM',
                    eventBubble: true
                },
                dateHeader: {
                    format: 'dddd D MMMM YYYY',
                    visible: true,
                },
                //Mini Week Day Selector
                week: {
                    day: {
                        format: 'D',
                    },
                    header: {
                        format: 'dd',
                    },
                    eventBubble: true,
                    startOfTheWeek: '0',
                    endOfTheWeek: '5',
                    visible: true,
                    scrollToFirstEvent: true,
                },
                //Week view Grid Options
                grid: {
                    dateFormat: 'D dddd',
                    timeFormat: 'H:00',
                    eventBubble: true,
                    scrollToFirstEvent: true,
                    scrollToAnimationSpeed: 300,
                    scrollToGap: 20,
                }
            },
            eventObj: {
                editable: true,
            },
            view: 'week',
            now: null,
            locale: 'fr',
            //Event display time format
            timeFormat: 'H[h]mm',
            minTime: 7,
            maxTime: 21,
            dateFormat: 'MMMM Do YYYY',
            slotDuration: '30', //In Mins : supports 15, 30 and 60
            eventOverlap: true,
            disableDates: [],
            //Loading Dummy EVENTS for demo Purposes, you can feed the events attribute from
            //Web Service
            onViewRenderComplete: function (range) {
                if ($("body").hasClass('pending')) {
                    return;
                }
                $.ajax({
                    type: "GET",
                    url: "/event/list",
                    success: function (data) {
                        $("#myCalendar").pagescalendar("setState", "loaded");
                        $("body").removeClass('pending');
                        $("#myCalendar").pagescalendar("removeAllEvents");
                        $("#myCalendar").pagescalendar("addEvents", data);
                    },
                    error: function (ajaxContext) {
                        $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors du chargement du calendrier");
                        $("body").removeClass('pending');
                    }
                });
            },
            onEventClick: function (event) {
                //Open Pages Custom Quick View
                if (!$('#calendar-event').hasClass('open'))
                    $('#calendar-event').addClass('open');


                selectedEvent = event;
                setEventDetailsToForm(selectedEvent);
            },
            onEventDragComplete: function (event) {
            },
            onEventResizeComplete: function (event) {
            },
            onTimeSlotDblClick: function (timeSlot) {
            },
        });

        // Some Other Public Methods That can be Use are below \
        //console.log($('body').pagescalendar('getEvents'))
        //get the value of a property
        //console.log($('body').pagescalendar('getDate','MMMM'));

        function setEventDetailsToForm(event) {
            $('#myCalendar').pagescalendar('setDate', event.start);

            $('#eventIndex').val();
            $('#txtEventName').val();
            $('#txtEventDesc').val();

            //Show Event date
            $('#event-date').html(moment(event.start).format('dddd D MMMM YYYY'));
            $('#lblfromTime').html(moment(event.start).format('H[h]mm'));
            $('#lbltoTime').html(moment(event.end).format('H[h]mm'));

            //Load Event Data To Text Field
            $('#eventIndex').val(event.index);
            $('#txtEventName').val(event.title);
            $('#txtEventDesc').val(event.other.content);

            checkZoomLink(event);
            checkSub(event);

            //lors de l'appui du boutton sur l'inscription
            $('#subscribe').off("click").on('click', function () {
                event = selectedEvent;

                $.ajax({
                    type: "GET",
                    url: "event/updateSub/" + event.other.checkSub + "/" + event.other.id,
                    success: function (id) {
                        //permet de corriger un bug bizarre, où l'événement est envoyé deux fois lorsque l'on clique rapidement
                        if (event.other.checkSub === false) {
                            event.other.checkSub = true;
                        } else {
                            event.other.checkSub = false;
                        }
                        $('#myCalendar').pagescalendar('updateEvent', event);
                        checkSub(event);
                    },
                    error: function (ajaxContext) {
                        $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de l'ajout de la participation");
                        $("body").removeClass('pending');
                    }
                });
            });

            function checkSub(event) {
                if (event.other.checkSub === true) {
                    $('#subscribe').removeClass("btn-complete");
                    $('#subscribe').addClass("btn-danger");
                    $('#subscribe').text("Se désinscrire");
                    return;
                }

                $('#subscribe').removeClass("btn-danger");
                $('#subscribe').addClass("btn-complete");
                $('#subscribe').text("S'inscrire à l'événement");
            }

            $('#eventShareCopy').off("click").on("click", function () {
                navigator.clipboard.writeText("https://labagenda.fr/event?id=" + event.other.id).then(
                    function () {
                        alert("Copié !"); // success
                    })
                    .catch(
                        function () {
                            alert("Impossible de copier l'événement"); // error
                        });
            });

            function checkZoomLink(event) {
                if (event.other.zoomLink === "") {
                    $('#zoomDiv').hide();
                } else {
                    $('#zoomDiv').show();
                    $('#zoomLink').attr("href", event.other.zoomLink).text(event.other.zoomLink);
                }
            }

            //bouton de partage google agenda
            $("#eventShareGoogle").off("click").on("click", function (){
                if(event.other.zoomLink !== ""){
                    window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.title
                        + "&details=" + event.other.content + "%0ALien Zoom: " + event.other.zoomLink + "&dates="
                        + event.start + "%" + event.end, '_blank');
                }else {
                    window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=" + event.title
                        + "&details=" + event.other.content + "&dates=" + event.start + "%" + event.end, '_blank');
                }
            });
        }
    });

})(window.jQuery);