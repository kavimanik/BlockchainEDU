//config file so that truffle knows where to connect to and where to get the contracts from
module.exports = {
  contracts_directory: './contracts',
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" 
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}