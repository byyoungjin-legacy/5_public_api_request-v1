/**
 * Get 12 people's information from 'https://randomuser.me/api/?results=12&nat=us'
 * @return {Promise} [Promise with 12 people data array]
 */

async function getPeopleInfo() {
  return await fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(res => res.json())
    .then(res => res.results);
}

/**
 * Draw people card on the screen
 * @param  {array} res [data array of people who will be drawn on the screen]
 * @return {Promise}     [return the parameter 'res' to be used in Promise chain]
 */
function drawCard(res) {
  // If there is res, append card Dom-element on screen
  if (res.length > 0) {
    res.forEach(person => {
      $('#gallery')
        .append(`
              <div class="card">
                  <div class="card-img-container">
                      <img class="card-img" src=${person.picture.large} alt="profile picture">
                  </div>
                  <div class="card-info-container">
                      <h3 id="name" class="card-name cap">${person.name.first}</h3>
                      <p class="card-text">${person.email}</p>
                      <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                  </div>
              </div>
            `)
      //Add event Listner on each card, passing person object and res
      $('#gallery .card:last').click(() => {
        drawModal(person, res)
      }); // what is differenc with .click(drawModal(person));
    })
  } else {
    //If there is no res, show this no result page
    $('#gallery').append('<div class="card">No result</div>');
  }
  return res;
}

/**
 * Draw Modal on the screen
 * @param  {Object} person      [one of personArray]
 * @param  {Promise} personArray [Promise of data array] <- is it right expression?
 */
function drawModal(person, personArray) {
  //append modal Dom-element
  $('body').append(`
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${person.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.phone}</p>
                <p class="modal-text">${person.location.street}, ${person.location.state}, OR ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${person.dob.date.replace(/(\d{4})-(\d{2})-(\d{2}).*/,`
    $3 / $2 / $1 `)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `)
  //Add eventListenr on close btn
  $('#modal-close-btn').click(() => {
    $('.modal-container').remove()
  })
  //Add eventListner on prev, next btn
  $('.modal-btn-container button').click((e) => {
    const targetId = e.target.id;
    let indexOfTargetPerson;
    switch (targetId) {
      case 'modal-prev':
        indexOfTargetPerson = personArray.indexOf(person) > 0 ? personArray.indexOf(person) - 1 : personArray.indexOf(person)
        break;

      case 'modal-next':
        indexOfTargetPerson = personArray.indexOf(person) < personArray.length - 1 ? personArray.indexOf(person) + 1 : personArray.indexOf(person);
        break
    }
    //Remove previous modal and draw again (prev or next) modal
    $('.modal-container').remove();
    drawModal(personArray[indexOfTargetPerson], personArray);
  })
}

/**
 * Make searchForm on the screen and activate it
 * @param  {Promise} res [The array of person(12)]

 */

function activateSearchForm(res) {
  //Apend searchForm Dom-element on the screen
  $('.search-container').append(`
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
    `)
  //Add eventListenr on Form submit to find matching named person and re-Draw
  $('form').submit((e) => {
    e.preventDefault();
    const searchTerm = $('input.search-input').val().toLowerCase();
    const filteredPeople = res.filter(people => {
      const name = `${people.name.first} ${people.name.last}`;
      return name.indexOf(searchTerm) > -1
    });
    //remove all the previous card and re-draw with filtered people
    $('.card').remove();
    drawCard(filteredPeople);

  })
}

//Initilaize this program
(function() {
  getPeopleInfo()
    .then(res => drawCard(res))
    .then(res => activateSearchForm(res));
})()
