// 2-hbnb.js
function getUserInfo(id, theClass) {
  // Return the promise chain created by fetch
  return fetch('http://0.0.0.0:5001/api/v1/users/' + id)
      .then(response => {
          return response.json();
      })
      .then(data => {
        $(theClass).text(` ${data.first_name} ${data.last_name}`);
      })
      .catch(error => {
          console.error('Fetch error:', error);
      });
}

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

  fetch('http://0.0.0.0:5001/api/v1/status/')
    .then(response => {
      if (response.ok) { $('div#api_status').addClass('available'); } else { $('div#api_status').removeClass('available'); }
    });
});

$(document).ready(function () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      for (const place of response) {
        if (place.description === null) { place.description = 'No description provided.'; }
        
        const article =
        `<article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">${place.price_by_night}$</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest</div>
            <div class="number_rooms">${place.number_rooms} Bedroom</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
          </div>
          <div class="user">
          <b>Owner:</b><span class="${place.user_id}"></span>
          <br>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>`;
        
        $('section.places').append(article);
        getUserInfo(place.user_id, `.${place.user_id}`);
      }
      
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error('Error:', error);
    }
  });
});
