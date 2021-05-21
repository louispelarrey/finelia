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
                    endOfTheWeek:'5',
                    visible:true,
                    scrollToFirstEvent:true,
                },
                //Week view Grid Options
                grid: {
                    dateFormat: 'D dddd',
                    timeFormat: 'H:00',
                    eventBubble: true,
                    scrollToFirstEvent:true,
                    scrollToAnimationSpeed:300,
                    scrollToGap:20,
                }
            },
            eventObj: {
                editable: true,
            },
            view:'week',
            now: null,
            locale: 'fr',
            //Event display time format
            timeFormat: 'H[h]mm',
            minTime: 7,
            maxTime: 21,
            dateFormat: 'MMMM Do YYYY',
            slotDuration: '30', //In Mins : supports 15, 30 and 60
            eventOverlap: false,
            //Loading Dummy EVENTS for demo Purposes, you can feed the events attribute from
            //Web Service
            onViewRenderComplete: function (range) {
                if ($("body").hasClass('pending')) {
                    return;
                }
                $.ajax({
                    type: "GET",
                    url: "presence/list",
                    dataType : 'json',
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
                selectedEvent = event;
                setEventDetailsToForm(selectedEvent);

                update(selectedEvent);
            },
            onEventResizeComplete: function (event) {
                selectedEvent = event;
                setEventDetailsToForm(selectedEvent);

                update(selectedEvent);
            },
            onTimeSlotDblClick: function (timeSlot) {
                //Adding a new Event on Slot Double Click
                $('#calendar-event').removeClass('open');
                let newEvent = {
                    title: 'Nouvel Evenement',
                    class: 'bg-danger-lighter',
                    start: timeSlot.date,
                    end: moment(timeSlot.date).add(1, 'hour').format(),
                    allDay: false,
                };
                selectedEvent = newEvent;
                add(selectedEvent);
            },
        });

        function setEventDetailsToForm(event) {
            $('#eventIndex').val();
            $('#txtEventName').val();

            //Show Event date
            $('#event-date').html(moment(event.start).format('dddd D MMMM YYYY'));
            $('#lblfromTime').html(moment(event.start).format('H[h]mm'));
            $('#lbltoTime').html(moment(event.end).format('H[h]mm'));

            //Load Event Data To Text Field
            $('#eventIndex').val(event.index);
            $('#txtEventName').val(event.title);
            checkDeletable(event);
        }

        $('#eventDelete').on('click', function () {
            event = selectedEvent;

            $.ajax({
                type: "DELETE",
                url: "presence/delete/" + event.other.id,
                success: function (data) {
                    $('#myCalendar').pagescalendar('removeEvent', $('#eventIndex').val());
                    $('#calendar-event').removeClass('open');
                },
                error: function (ajaxContext) {
                    $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de la suppression de l'événement");
                    $("body").removeClass('pending');
                }
            });
        });

        function update(event){
            $.ajax({
                type: "POST",
                url: "presence/update/" + event.other.id,
                data: "dateStart=" + event.start + "&dateEnd=" + event.end,
                success: function (data) {
                    $('#myCalendar').pagescalendar('updateEvent', selectedEvent);
                    $('#calendar-event').removeClass('open');
                },
                error: function (ajaxContext) {
                    $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de la MAJ de l'événement");
                    $("body").removeClass('pending');
                }
            });
        }

        function add(event){
            $("#myCalendar").pagescalendar("setState", "loading");
            $.ajax({
                type: "POST",
                url: "presence/create",
                data: "dateStart=" + event.start + "&dateEnd=" + event.end,
                success: function (data){
                    $("#myCalendar").pagescalendar("addEvents", data);
                    $("#myCalendar").pagescalendar("setState", "loaded");
                },
                error: function (ajaxContext) {
                    $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de la création de l'événement");
                },
            });
        }

        function checkDeletable(event){
            if(event.readOnly){
                $('#eventDelete').hide();
            }else{
                $('#eventDelete').show();
            }
        }
    });

})(window.jQuery);