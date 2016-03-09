$(document).ready(function() {

  // Show all contacts on page load
  activateLoadingScreen()  
  showAllContacts(bindDestroyHandler, deactivateLoadingScreen);

  // HANDLER: View all contacts
  $('.view-all-btn').on('click', function(event) {
    activateLoadingScreen()  
    showAllContacts(bindDestroyHandler, deactivateLoadingScreen);
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
      showAllContacts(bindDestroyHandler, deactivateLoadingScreen)
      $('.create').val("")
    })

  });

  // DOM: render a card
  function renderCard(contact) {
    $('.col-lg-7').append(
      `<div class='card' data-id='${contact.id}'><h3 class='card-header'>${contact.first_name} ${contact.last_name}<span class='pull-right octicon octicon-trashcan'></span></h3><ul class='list-group list-group-flush'><li class='list-group-item'><strong>Age: </strong>${contact.date_of_birth}</li><li class='list-group-item'><strong>Occupation: </strong>${contact.occupation}</li><li class='list-group-item'><strong>Email: </strong>${contact.email}</li></ul></div>`
    )
  }

  // DOM: bind destroy handler to card
  function bindDestroyHandler() {
    $('.octicon-trashcan').on('click', function(event) {
      activateLoadingScreen()      
      $.ajax({
        url: '/contacts/destroy',
        type: 'delete',
        data: {
          contactID: $(this).parents('.card').data('id')
        },
        success: function() {
          showAllContacts(bindDestroyHandler, deactivateLoadingScreen)
        }
      })
    })
  }

  function deactivateLoadingScreen() {
    $('.loading-div').removeClass('loading-active')
    $('.loading-container').hide()
  }

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