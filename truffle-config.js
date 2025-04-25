module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.20", // Use 0.8.20 for OpenZeppelin 5.x
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