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
                    startYear: moment().subtract(2, 'year').format('YYYY'),
                    endYear: moment().add(2, 'year').format('YYYY'),
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
                    eventOverlap: false,
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
            //Loading Dummy EVENTS for demo Purposes, you can feed the events attribute from
            //Web Service
            onViewRenderComplete: function (range) {
                if ($("body").hasClass('pending')) {
                    return;
                }
                $.ajax({
                    type: "GET",
                    url: "event/list",
                    dataType: 'json',
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
                var newEvent = {
                    title: 'Nouvel Événement',
                    class: 'bg-danger-lighter',
                    start: timeSlot.date,
                    end: moment(timeSlot.date).add(1, 'hour').format(),
                    allDay: false,
                    other: {
                        //You can have your custom list of attributes here
                        content: "",
                        registered: "",
                        zoomLink: "",
                        subNames: "",
                        subToConfirm: 7,
                        openToInvited: false
                    }
                };
                selectedEvent = newEvent;
                add(selectedEvent);
            },
        });

        function setEventDetailsToForm(event) {
            $('#myCalendar').pagescalendar('setDate', event.start);

            $('#eventIndex').val();
            $('#txtEventName').val();
            $('#txtEventDesc').val();
            $('#zoomLink').val();
            $('#participants').val();
            $('#subToConfirm').val();
            $('#openToInvited').attr('Checked','Checked')

            //Show Event date
            $('#event-date').html(moment(event.start).format('dddd D MMMM YYYY'));
            $('#lblfromTime').html(moment(event.start).format('H[h]mm'));
            $('#lbltoTime').html(moment(event.end).format('H[h]mm'));

            //Load Event Data To Text Field
            $('#eventIndex').val(event.index);
            $('#txtEventName').val(event.title);
            $('#txtEventDesc').val(event.other.content);
            $('#zoomLink').val(event.other.zoomLink);
            $('#participants').val(event.other.subNames);
            $('#subToConfirm').val(event.other.subToConfirm);
            event.other.openToInvited ? $('#openToInvited').prop("checked", true) : $('#openToInvited').prop("checked", false);

            $('#eventShareCopy').on("click", function () {
                navigator.clipboard.writeText("https://labagenda.fr/event?id=" + event.other.id).then(
                    function () {
                        alert("Copié !"); // success
                    })
                    .catch(
                        function () {
                            alert("Impossible de copier l'événement"); // error
                        });
            });

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

        $('#eventSave').off("click").on('click', function () {
            //vérifie si on a bien précisé le nombre de participants avant l'update
            if ($('#subToConfirm').val() === "") {
                alert("Veuillez indiquer un nombre de participants pour la confirmation");
                return false;
            }

            selectedEvent.title = $('#txtEventName').val();
            selectedEvent.other.content = $('#txtEventDesc').val();
            selectedEvent.other.code = $('#txtEventCode').val();
            selectedEvent.other.location = $('#txtEventLocation').val();
            selectedEvent.other.zoomLink = $('#zoomLink').val();
            selectedEvent.other.subToConfirm = $('#subToConfirm').val();
            selectedEvent.other.openToInvited = $('#openToInvited').is(":Checked");

            update(selectedEvent);
        });

        $('#eventDelete').on('click', function () {
            event = selectedEvent;

            $.ajax({
                type: "DELETE",
                url: "event/delete/" + event.other.id,
                success: function (data) {
                    checkUrl();
                    $('#myCalendar').pagescalendar('removeEvent', $('#eventIndex').val());
                    $('#calendar-event').removeClass('open');
                },
                error: function (ajaxContext) {
                    $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de la suppression de l'événement");
                    $("body").removeClass('pending');
                }
            });
        });

        function update(event) {
            $.ajax({
                type: "POST",
                url: "event/update/" + event.other.id,
                data: "title=" + event.title + "&content=" + event.other.content + "&zoomLink=" + event.other.zoomLink +
                    "&dateStart=" + event.start + "&dateEnd=" + event.end + "&subToConfirm=" + event.other.subToConfirm +
                    "&openToInvited=" + event.other.openToInvited,
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

        function add(event) {
            $("#myCalendar").pagescalendar("setState", "loading");
            $.ajax({
                type: "POST",
                url: "event/create",
                data: "title=" + event.title + "&content=" + event.other.content + "&zoomLink=" + event.other.zoomLink +
                    "&dateStart=" + event.start + "&dateEnd=" + event.end + "&subToConfirm=" + event.other.subToConfirm
                    + "&openToInvited=false",
                success: function (data) {
                    checkUrl();
                    $("#myCalendar").pagescalendar("addEvents", data);
                    $("#myCalendar").pagescalendar("setState", "loaded");
                },
                error: function (ajaxContext) {
                    $("#myCalendar").pagescalendar("Erreur", ajaxContext.status + ": Problème lors de la création de l'événement");
                },
            });
        }

        function checkUrl() {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id != null) {
                window.location.replace("/event");
            }
        }
    });


})(window.jQuery);