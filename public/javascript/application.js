$(document).ready(function() {

  // Show all contacts on page load
  activateLoadingScreen()  
  contactsShow(deactivateLoadingScreen);

  // HANDLERS
  // Index
  $('.view-all-btn').on('click', function() {
    activateLoadingScreen()  
    contactsShow(deactivateLoadingScreen);
  })
  // Search (NOT RESTFUL)
  $('.search-btn').on('click', function() {
    activateLoadingScreen()
    contactsShow(deactivateLoadingScreen)
  })
  // Create
  $('.create-btn').on('click', function() {
    activateLoadingScreen()
    contactsCreate(deactivateLoadingScreen)
  });
  // Edit
  $('.contacts-body').on('click', '.octicon-pencil', function() {
    var contactID = $(this).data('id')
    $(this).replaceWith(`<span class='pull-right octicon octicon-check' data-id='${contactID}'></span>`)
    contactsEdit(contactID)
  })
  // Update
  $('.contacts-body').on('click', '.octicon-check', function() {
    activateLoadingScreen()
    var contactID = $(this).data('id')
    contactsUpdate(contactID, deactivateLoadingScreen) 
  })
  // Destroy
  $('.contacts-body').on('click', '.octicon-trashcan', function() {
    activateLoadingScreen()
    var contactID = $(this).data('id')      
    contactsDestroy(contactID, deactivateLoadingScreen)
  });

  // FUNCTIONS
  // Create
  function contactsCreate(callback) {
    $.post('/contacts', {
      newFirstName: $('.new-first-name').val(),
      newLastName: $('.new-last-name').val(),
      newDOB: $('.new-DOB').val(),
      newEmail: $('.new-email').val(),
      newOccupation: $('.new-occupation').val()
    }).done(function(data) {
      contactsShow(callback)
      $('.create').val('')
    })
  }
  // Show
  function contactsShow(callback) {
    $.get('/contacts/index.json', function(data) {
      $('.card').remove()
      data.forEach(function(contact) {
        renderCard(contact)  
      })
      callback()
    })
  }
  // Search (NOT RESTFUL)
  function contactsShow(callback) {
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
        callback()
      }
    })
  }
  // Update
  function contactsUpdate(contactID, callback) {

    var contactNewDOB = $(`.contact-new-DOB-${contactID}`).val();
    var contactNewOccupation = $(`.contact-new-occupation-${contactID}`).val();
    var contactNewEmail = $(`.contact-new-email-${contactID}`).val();

    $.ajax({
      url: `/contacts/${contactID}`,
      type: 'put',
      data: {
        newDOB: contactNewDOB,
        newOccupation: contactNewOccupation,
        newEmail: contactNewEmail
      },
      success: function() {
        contactsShow(callback)
      }
    })
  }
  // Destroy
  function contactsDestroy(contactID, callback) {
    $.ajax({
      url: '/contacts/destroy',
      type: 'delete',
      data: {
        contactID: contactID
      },
      success: function() {
        contactsShow(callback)
      }
    })
  }
  // Edit
  function contactsEdit(contactID) {
    // Get that contact's DOB, occupation, and email
    var contactDOB = $(`.contact-DOB-${contactID}`).text();
    var contactOccupation = $(`.contact-occupation-${contactID}`).text();
    var contactEmail = $(`.contact-email-${contactID}`).text();

    // Replace text fields with inputs
    $(`.contact-DOB-${contactID}`).replaceWith(`<input type="text" class='form-control contact-new-DOB-${contactID}' value="${contactDOB}" style='margin-top:5px;'>`)
    $(`.contact-email-${contactID}`).replaceWith(`<input type="text" class='form-control contact-new-email-${contactID}' value="${contactEmail}" style='margin-top:5px;'>`)
    $(`.contact-occupation-${contactID}`).replaceWith(`<input type="text" class='form-control contact-new-occupation-${contactID}' value="${contactOccupation}" style='margin-top:5px;'>`)

    // Generate date picker on date field
    var picker = new Pikaday({ 
      field: $(`.contact-new-DOB-${contactID}`)[0],
      yearRange: 50
    })
  }

  // OTHER
  // Take an AR object and render it onto the DOM
  function renderCard(contactObject) {
    $('.contacts-body').append(
      `<div class='card' data-id='${contactObject.id}'>
        <h3 class='card-header'>
          ${contactObject.first_name} ${contactObject.last_name}
          <span class='pull-right octicon octicon-trashcan' data-id='${contactObject.id}'></span>
          <span class='pull-right octicon octicon-pencil' data-id='${contactObject.id}'></span>
        </h3>
        <ul class='list-group list-group-flush'>
          <li class='list-group-item'><h4>Date of Birth: </h4><p class='contact-DOB-${contactObject.id}'>${contactObject.date_of_birth}</p></li>
          <li class='list-group-item'><h4>Occupation: </h4><p class='contact-occupation-${contactObject.id}'>${contactObject.occupation}</p></li>
          <li class='list-group-item'><h4>Email: </h4><p class='contact-email-${contactObject.id}'>${contactObject.email}</p></li>
        </ul>
      </div>`
    )
  }

  // Loading screen helpers
  function deactivateLoadingScreen() {
    $('.loading-div').removeClass('loading-active')
    $('.loading-container').hide()
  }
  function activateLoadingScreen() {
    $('.loading-div').addClass('loading-active')
    $('.loading-container').show()
  }

})