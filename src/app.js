App = {
    loading: false,
    web3Provider: null,
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    //the above link provides the following loadWeb3 function in order to load Web3 into our application
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  },

  //load Account will load the account for the current user accessing the blockchain
  loadAccount: async () => {
    App.account = ethereum.selectedAddress;
  },

  //create Assignment creates an assignment object that was outlined in the EducationPage smart contract
  createAssignment: async () => {
    App.setLoading(true) //sets the loading state to true
    const content = $('#newAssignment').val() //adds the assignment to the frontend
    await App.educationPage.createAssignment(content, {from: App.account}) //adds the assignment to the blockchain
    window.location.reload()
  },

  //load all of the assignments from the blockchain onto the frontend
  renderAssignments: async () => {
    const assignmentCount = await App.educationPage.assignmentCount() // get the total number of assignments from the blockchain
    const $assignmentTemplate = $('.assignmentTemplate')

    // loop thru the number of assignments and load the relevent assignment data
    for (var i = 1; i <= assignmentCount; i++) {
      const assignment = await App.educationPage.assignments(i)
      const assignmentId = assignment[0].toNumber()
      const assignmentContent = assignment[1]
      const assignmentCompleted = assignment[2]

      // create HTML with all of the assignment information
      const $newAssignmentTemplate = $assignmentTemplate.clone()
      $newAssignmentTemplate.find('.content').html(assignmentContent)
      $newAssignmentTemplate.find('input')
                            .prop('name', assignmentId)
                            .prop('checked', assignmentCompleted)
                            .on('click', App.toggleCompleted)

      //if the assignment is completed add it to the list of completed assignments 
      //otherwise add it to the list of uncompleted assignments
      if (assignmentCompleted) {
        $('#completedTAssignmentList').append($newAssignmentTemplate)
      } else {
        $('#assignmentList').append($newAssignmentTemplate)
      }

      // show the assignments
      $newAssignmentTemplate.show()
    }
  },

  //loads the contract which stores the information about the assignments
  loadContract: async () => {
    const educationPage = await $.getJSON('EducationPage.json') //get the smart contract
    App.contracts.EducationPage = TruffleContract(educationPage)
    App.contracts.EducationPage.setProvider(App.web3Provider)

    App.educationPage = await App.contracts.EducationPage.deployed() //deploy the smart contract
    console.log(educationPage)
  },

  //render the assignmends on the page
  render: async () => {
    //if the app is already loading then return to prevent double loading
    if (App.loading) {
        return
      }
  
      // since we are now loading the assignments set the loading state to true
      App.setLoading(true)
  
      $('#account').html(App.account)

      await App.renderAssignments()
    
      // when we're doing loading the assignments set the loading state to false
      App.setLoading(false)
  },

  //sets the loading state of the applcation
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    //if the app is loading the show the loader and hide the assignments
    if (boolean) {
      loader.show()
      content.hide()
    //if its already loaded hide the loader and show the assignments
    } else {
      loader.hide()
      content.show()
    }
  },

  //function to mark an assignment as complete
  toggleCompleted: async (e) => {
    App.setLoading(true)
    const assignmentId = e.target.name
    await App.educationPage.toggleCompleted(assignmentId, {from: App.account}) //access the smart contract and change the state of the assignment
    window.location.reload()
  }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})