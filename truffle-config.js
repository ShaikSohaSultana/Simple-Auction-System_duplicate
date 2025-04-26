module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Ganache default port
      network_id: "5777",    // Ganache default network ID
      gas: 6721975,          // Gas limit
      gasPrice: 20000000000  // Gas price
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",     // Solidity version
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  contracts_build_directory: "./build/contracts",
  paths: {
    sources: "./contracts",
    tests: "./test",
    migrations: "./migrations"
  }
};
