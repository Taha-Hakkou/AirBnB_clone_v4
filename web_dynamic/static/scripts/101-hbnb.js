// 101-hbnb.js
function getUserInfo(user_id) {
  // Return the promise chain created by fetch
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/users/' + user_id,
    success: function (data) {
	console.log( ` ${data.first_name} ${data.last_name}`);
	      
        //$(theClass).text(` ${data.first_name} ${data.last_name}`);
    },
    error: () => {
          console.error('Fetch error:', error);
    }
  });
}

/* ----task7---- */
function showReviews(place_id) {
  const span = $(`span[place-id='${place_id}']`);
  const ul = span.parent().find('ul');
  if (span.text() == 'show') {
    span.text('hide');
    $.ajax({
      url: `http://0.0.0.0:5001/api/v1/places/${place_id}/reviews`,
      success: function (response) {
	for (const review of response) {
	  const review_item =
	  `<li>
	  	<h3>From ${getUserInfo(review.user_id)}</h3>
	  	<p>${review.text}</p>
	  </li>`;
          ul.append(review_item);
	}
      }
    });
  } else {
	  console.log(1);
    span.text('show');
    ul.empty();
  }
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
              <b>Owner:</b> <span>${getUserInfo(place.user_id)}</span><br>
            </div>
            <div class="description">
              ${place.description}
            </div>

	    <div class="reviews">
	    	<h2>Reviews</h2>
		<span place-id="${place.id}">show</span>
		<ul></ul>
	    </div>
          </article>`;
        
          $('section.places').append(article);
          //getUserInfo(place.user_id, `.${place.user_id}`);
        }

	/* ----task7---- */
	$('.reviews > span').click(function () {
	  showReviews($(this).attr('place-id'));
	});
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
