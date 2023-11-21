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

  loadAccount: async () => {
    App.account = ethereum.selectedAddress;
  },

  loadContract: async () => {
    const educationPage = await $.getJSON('EducationPage.json')
    App.contracts.EducationPage = TruffleContract(educationPage)
    App.contracts.EducationPage.setProvider(App.web3Provider)

    App.educationPage = await App.contracts.EducationPage.deployed()
    console.log(educationPage)
  },

  renderAssignments: async () => {
    // Load the total task count from the blockchain
    const assignmentCount = await App.educationPage.assignmentCount()
    const $assignmentTemplate = $('.assignmentTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= assignmentCount; i++) {
      // Fetch the task data from the blockchain
      const assignment = await App.educationPage.assignments(i)
      const assignmentId = assignment[0].toNumber()
      const assignmentContent = assignment[1]
      const assignmentCompleted = assignment[2]

      // Create the html for the task
      const $newAssignmentTemplate = $assignmentTemplate.clone()
      $newAssignmentTemplate.find('.content').html(assignmentContent)
      $newAssignmentTemplate.find('input')
                            .prop('name', assignmentId)
                            .prop('checked', assignmentCompleted)
                            .on('click', App.toggleCompleted)

      // Put the task in the correct list
      if (assignmentCompleted) {
        $('#completedTAssignmentList').append($newAssignmentTemplate)
      } else {
        $('#assignmentList').append($newAssignmentTemplate)
      }

      // Show the task
      $newAssignmentTemplate.show()
    }
  },

  createAssignment: async () => {
    App.setLoading(true)
    const content = $('#newAssignment').val()
    await App.educationPage.createAssignment(content, {from: App.account})
    window.location.reload()
  },

  render: async () => {
    if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)

      await App.renderAssignments()
    
      // Update loading state
      App.setLoading(false)
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const assignmentId = e.target.name
    await App.educationPage.toggleCompleted(assignmentId, {from: App.account})
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})