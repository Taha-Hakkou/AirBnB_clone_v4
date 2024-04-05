// 2-hbnb.js

$('document').ready(function () {
  $('input').change(function () {
    const amenities = {};
    $('input').each(function () {
      if (this.checked) {
        amenities[$(this).attr('data-name')] = $(this).attr('data-id');
      }
    });
    let amenitiesText = Object.keys(amenities).join(', ');
    const maxLength = 30;

    if (amenitiesText.length == 0) {
      amenitiesText = '|';
      $('.amenities > h4').css('color', 'white');
    } else {
      $('.amenities > h4').css('color', 'black');
    }

    if (amenitiesText.length > maxLength) {
      amenitiesText = amenitiesText.substring(0, maxLength) + '...';
      $('.amenities > h4').css('color', 'black');
    }
    $('.amenities > h4').text(amenitiesText);
  });
});

fetch('http://0.0.0.0:5001/api/v1/status/')
  .then(response => {
    if (response.ok) { $('div#api_status').addClass('available'); } else { $('div#api_status').removeClass('available'); }
  });
