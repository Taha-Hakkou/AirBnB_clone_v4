// 4-hbnb.js

$('document').ready(function () {
  const amenities = {};
  $('input').change(function () {
    $('input').each(function () {
      if (this.checked) {
        amenities[$(this).attr('data-name')] = $(this).attr('data-id');
      } else {
        delete amenities[$(this).attr('data-name')];
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

  fetch('http://0.0.0.0:5001/api/v1/status/')
    .then(response => {
      if (response.ok) {
	$('div#api_status').addClass('available');
      } else {
	$('div#api_status').removeClass('available');
      }
    });
  
  // post
  post_places({});

  // button
  $('button').click(function () {
    post_places({'amenities': Object.values(amenities)});
  });

  function post_places(data) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (response) {
        $('section.places').empty();
        for (const place of response) {
          if (place.description === null)
            place.description = "No description provided.";

          const article = 
          `<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${ place.max_guest} Guest</div>
              <div class="number_rooms">${ place.number_rooms} Bedroom</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
            </div>
            <div class="user">
              <b>Owner:</b> place.user.first_name place.user.last_name<br>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`;
        
          $('section.places').append(article);
        }
      },
      error: function (xhr, status, error) {
        // Handle error response
        console.error('Error:', error);
      }
    });
  }
});
