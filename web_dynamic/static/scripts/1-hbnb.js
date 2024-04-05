// 1-hbnb.js
$('document').ready(function () {
  $('input').change(function () {
    let amenities = {};
    $('input').each(function() {
      if(this.checked) {
        amenities[$(this).attr('data-name')] = $(this).attr('data-id');
      }
    });
    $('.amenities > h4').text(Object.keys(amenities).join(', '));
  });
});
