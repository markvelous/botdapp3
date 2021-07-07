const { assert } = require('chai')

const Bot = artifacts.require('./Bot.sol')

require ('Chai')
    .use(require('chai-as-promised'))
    .should()

contract('Bot', (accounts) => {

    let contract

    before(async () => {
        contract = await Bot.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Bot')
        })

        it('has a symbol', async () => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'MKB')
        })
    })

    describe('minting', async () => {
        it('creates a new token', async () => {
            const result = await contract.mint('Marköbot')
            const totalSupply = await contract.totalSupply()
            
            // success
            assert.equal(totalSupply, 1)
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'Id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            // failure: cannot mint same bot twice
            await contract.mint("Marköbot").should.be.rejected;
        })
    })

    describe('indexing', async () => {
        it('lists bots', async () => {
            // mint two more tokens
            await contract.mint("Olivia")
            await contract.mint("Oriana")
            const totalSupply = await contract.totalSupply()

            let bot
            let result = []

            for (var i = 1; i <= totalSupply; i++) {
                bot = await contract.bots(i - 1)
                result.push(bot)
            }

            let expected = ['Marköbot', 'Olivia', 'Oriana'] 
            assert.equal(result.join(','), expected.join(','))

        })
    })

})