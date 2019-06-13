// Changes the active navigation item
$(document).ready(function() {
  // get current URL path and assign 'active' class
  var pathname = window.location.pathname;
  $('.main-nav__list > li > a[href="' + pathname + '"]')
    .parent()
    .addClass("active");
});

$(document).ready(function() {
  // Check if the calendar exists
  if (document.getElementById("calendar")) {
    // page is now ready, initialize the calendar...
    $("#calendar").fullCalendar({
      events: [
        {
          title: "All Players @ CFHS 6:30pm",
          start: "2019-05-01"
        },

        {
          title: "All Players @ CFHS 6:30PM",
          start: "2019-05-03"
        },

        {
          title: "Big Shots Wilmington",
          start: "2019-05-04",
          end: "2019-05-06"
        },
        {
          title: "6th-8th Grade B&G @ FMS 6:00PM ",
          start: "2019-05-07"
        },

        {
          title: "9th-12th Grade B&G @ CFHS 6:30PM",
          start: "2019-05-08"
        },

        {
          title: "6th-8th Grade B&G @ FMS 6:00PM ",
          start: "2019-05-09"
        },
        {
          title: "MDS Charleston 8th B&G",
          start: "2019-05-10",
          end: "2019-05-12"
        },

        {
          title: "Girls ONLY ALL Teams @ CFHS 6:30PM ",
          start: "2019-05-15"
        },
        {
          title: "Boys  ONLY ALL Teams @ FMS 6:00PM ",
          start: "2019-05-16"
        },

        {
          title: "WALMART FUNDRAISER ",
          start: "2019-05-17"
        },
        {
          title: "WALMART FUNDRAISER ",
          start: "2019-05-18"
        },
        {
          title: "High School Teams B&G @ CFHS 4:30PM",
          start: "2019-05-19"
        },
        {
          title: "6th-8th Grade B&G @ FMS 6:00PM ",
          start: "2019-05-20"
        },
        {
          title: "Girls ONLY High School Teams @ FMS 6:00PM",
          start: "2019-05-23"
        },

        {
          title: "LEAVING FOR FLORIDA!!!   ",
          start: "2019-05-24"
        },
        {
          title: "J Mcgraw Jacksonville",
          start: "2019-05-25",
          end: "2019-05-28"
        },
        {
          title: "All Teams B&G @ CFHS 6:30PM ",
          start: "2019-05-29"
        },
        {
          title: "All Teams B&G @ FMS 6:30PM ",
          start: "2019-05-30"
        },

        {
          title: "NTBA Pre Nat 6th-8th B&G",
          start: "2019-05-31",
          end: "2019-06-03"
        }
      ],

      themeSystem: "bootstrap4",
      header: {
        left: "prev,next, today",
        center: "title",
        right: "month,agendaWeek,agendaDay"
      },
      selectable: true,
      selectHelper: true,
      editable: true,
      eventLimit: true,

      eventClick: function(calEvent, jsEvent, view) {
        alert("Event: " + calEvent.title);
        alert("coordinates: " + jsEvent.pageX + "," + jsEvent.pageY);
        alert("View: " + view.name);
      },
      select: function(start, end) {
        $.getScript("/events/new", function() {});
        fullCalendar("unselect");
      }
    });
  }
});

function gallery_isotope() {
  if ($(".gallery").length) {
    // Activate isotope in container
    $(".gallery__inner").imagesLoaded(function() {
      $(".gallery__inner").isotope({
        layoutMode: "fitRows",
        animationOptions: {
          duration: 750,
          easing: "linear"
        }
      });
    });

    // Add isotope click function
    $(".filter li").on("click", function() {
      $(".filter li").removeClass("active");
      $(this).addClass("active");

      var selector = $(this).attr("data-filter");
      $(".gallery__inner").isotope({
        filter: selector,
        animationOptions: {
          duration: 450,
          easing: "linear",
          queue: false
        }
      });
      return false;
    });
  }
}
gallery_isotope();

$("[data-fancybox]").fancybox({});
