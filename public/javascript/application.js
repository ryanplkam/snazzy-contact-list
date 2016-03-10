$(document).ready(function() {
  // Show all contacts on page load
  activateLoadingScreen()  
  showAllContacts(bindEditHandler, deactivateLoadingScreen);

  // HANDLER: View all contacts
  $('.view-all-btn').on('click', function(event) {
    activateLoadingScreen()  
    showAllContacts(bindEditHandler, deactivateLoadingScreen);
  })

  // HANDLER: Search contacts
  $('.search-btn').on('click', function(event) {
    activateLoadingScreen()  
    $.ajax({
      url: "/contacts/search.json",
      type: "get",
      data: {
        searchParam: $('#search-param').val()
      },
      success: function(data) {
        $('.card').remove()
        data.forEach(function(contact) {
          renderCard(contact)
        })
        deactivateLoadingScreen()
      }
    })
  })

  // HANDLER: Create new contact
  $('.create-btn').on('click', function(event) {
    activateLoadingScreen()
    $.post('/contacts/create', {
      newFirstName: $('.new-first-name').val(),
      newLastName: $('.new-last-name').val(),
      newDOB: $('.new-DOB').val(),
      newEmail: $('.new-email').val(),
      newOccupation: $('.new-occupation').val()
    }).done(function(data) {
      showAllContacts(bindEditHandler, deactivateLoadingScreen)
      $('.create').val("")
    })
  });

  // DOM: render a card
  function renderCard(contact) {
    $('.contacts-body').append(
      `<div class='card' data-id='${contact.id}'>
        <h3 class='card-header'>
          ${contact.first_name} ${contact.last_name}
          <span class='pull-right octicon octicon-trashcan' data-id='${contact.id}'></span>
          <span class='pull-right octicon octicon-pencil' data-id='${contact.id}'></span>
        </h3>
        <ul class='list-group list-group-flush'>
          <li class='list-group-item'><h4>Date of Birth: </h4><p class='contact-DOB-${contact.id}'>${contact.date_of_birth}</p></li>
          <li class='list-group-item'><h4>Occupation: </h4><p class='contact-occupation-${contact.id}'>${contact.occupation}</p></li>
          <li class='list-group-item'><h4>Email: </h4><p class='contact-email-${contact.id}'>${contact.email}</p></li>
        </ul>
      </div>`
    )
  }

  // DOM: bind destroy handler to card
  // function bindDestroyHandler() {
  //   $('.octicon-trashcan').on('click', function(event) {
  //     activateLoadingScreen()      
  //     $.ajax({
  //       url: '/contacts/destroy',
  //       type: 'delete',
  //       data: {
  //         contactID: $(this).data('id')
  //       },
  //       success: function() {
  //         showAllContacts(bindDestroyHandler, bindEditHandler, deactivateLoadingScreen)
  //       }
  //     })
  //   })
  // }

  // DOM: bind edit handler to card
  function bindEditHandler() {
    $('.octicon-pencil').on('click', function(event) {
      var contactID = $(this).data('id')
      var contactDOB = $(`.contact-DOB-${contactID}`).text();
      var contactOccupation = $(`.contact-occupation-${contactID}`).text();
      var contactEmail = $(`.contact-email-${contactID}`).text();
      $(`.contact-DOB-${contactID}`).replaceWith(`<input type="text" class='form-control contact-new-DOB' value="${contactDOB}">`)
      $(`.contact-occupation-${contactID}`).replaceWith(`<input type="text" class='form-control' value="${contactOccupation}">`)
      $(`.contact-email-${contactID}`).replaceWith(`<input type="text" class='form-control' value="${contactEmail}">`)
      var picker = new Pikaday({ 
        field: $('.contact-new-DOB')[0],
        yearRange: 50
      })
      $(this).replaceWith(`<span class='pull-right octicon octicon-check' data-id='${contactID}'></span>`)
      ;

    });
  }

  // Event bubbling for 1) destroy, 2) edit, 3)
  $('.contacts-body').on('click', '.octicon-trashcan', function() {
    activateLoadingScreen()      
    $.ajax({
      url: '/contacts/destroy',
      type: 'delete',
      data: {
        contactID: $(this).data('id')
      },
      success: function() {
        showAllContacts(bindEditHandler, deactivateLoadingScreen)
      }
    })
  });

  // Loading screen
  function deactivateLoadingScreen() {
    $('.loading-div').removeClass('loading-active')
    $('.loading-container').hide()
  }
  // Loading screen
  function activateLoadingScreen() {
    $('.loading-div').addClass('loading-active')
    $('.loading-container').show()
  }

  // DOM: paint contacts
  function showAllContacts(callback1, callback2) {
    $.get('/contacts/index.json', function(data) {
      $('.card').remove()
      data.forEach(function(contact) {
        renderCard(contact)  
      })
      callback1()
      callback2()
    })
  }

})