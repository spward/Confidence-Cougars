// Changes the active navigation item
$(document).ready(function () {
    // get current URL path and assign 'active' class
    var pathname = window.location.pathname;
    $('.main-nav__list > li > a[href="' + pathname + '"]').parent().addClass('active');
});


$(document).ready(function () {

    // Check if the calendar exists
    if (document.getElementById("calendar")) {

        // page is now ready, initialize the calendar...
        $('#calendar').fullCalendar({
            events: [
                {
                    title: 'BIG Tournament',
                    start: '2018-05-11',
                    end: '2018-05-14',
                },
                {
                    title: 'First day of Testing',
                    start: '2018-05-08',
                },
                {
                    title: 'Second day of Testing',
                    start: '2018-05-09',
                },
                {
                    title: 'multiple per day',
                    start: '2018-05-09',
                }
            ],

            themeSystem: "bootstrap4",
            header: {
                left: 'prev,next, today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            selectable: true,
            selectHelper: true,
            editable: true,
            eventLimit: true,

            eventClick: function (calEvent, jsEvent, view) {
                alert('Event: ' + calEvent.title);
                alert('coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                alert('View: ' + view.name);
            },
            select: function (start, end) {
                $.getScript('/events/new', function () {

                });
                fullCalendar('unselect');
            }
        });
    }
});