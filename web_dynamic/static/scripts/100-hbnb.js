// 100-hbnb.js
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
  const maxLength = 30;
  const amenities = {};
  $('.amenityInput').change(function () {
    $('.amenityInput').each(function () {
      if (this.checked) {
        amenities[$(this).attr('data-name')] = $(this).attr('data-id');
      } else {
        delete amenities[$(this).attr('data-name')];
      }
    });
    if (Object.keys(amenities).length === 0) {
      $('.amenities > h4').html('&nbsp;');
    } 
    else 
    {
      let amenitiesText = Object.keys(amenities).join(', ');
      if (amenitiesText.length > maxLength) {
        amenitiesText = amenitiesText.substring(0, maxLength) + '...';
      }
      $('.amenities > h4').text(amenitiesText);
    }
  });

  fetch('http://0.0.0.0:5001/api/v1/status/')
    .then(response => {
      if (response.ok) {
	$('div#api_status').addClass('available');
      } else {
	$('div#api_status').removeClass('available');
      }
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
              <div class="price_by_night">${place.price_by_night}$</div>
            </div>
            <div class="information">
              <div class="max_guest">${ place.max_guest} Guest</div>
              <div class="number_rooms">${ place.number_rooms} Bedroom</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
            </div>
            <div class="user">
              <b>Owner:</b> <span class="${place.user_id}"></span><br>
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
  }

  /* ----task 6----- */

  const states = {};
  const cities = {};

  $('.stateInput').click(function () {
    if ($(this).prop('checked')) {
      states[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if (!$(this).prop('checked')) {
      delete states[$(this).attr('data-name')];
    }
    if (Object.keys(states).length === 0 && Object.keys(cities).length === 0) {
      $('.locations h4').html('&nbsp;');
    } 
    else 
    {
      let locations1 = Object.keys(states).concat(Object.keys(cities)).join(', ');
      if (locations1.length > maxLength) {
        locations1 = locations1.substring(0, maxLength) + '...';
      }
      $('.locations > h4').text(locations1);
    }
  });

  $('.cityInput').click(function () {
    if ($(this).prop('checked')) {
      cities[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if (!$(this).prop('checked')) {
      delete cities[$(this).attr('data-name')];
    };
    if (Object.keys(states).length === 0 && Object.keys(cities).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      let locations1 = Object.keys(states).concat(Object.keys(cities)).join(', ');
      if (locations1.length > maxLength) {
        locations1 = locations1.substring(0, maxLength) + '...';
      }
      $('.locations > h4').text(locations1);
    }
  });

  // post
  post_places({});

  // button
  $('button').click(function () {
    post_places(
      {
        'amenities': Object.values(amenities), 
        'states': Object.values(states),
        'cities': Object.values(cities)
      }
    );
  });

});
