const ProductsRepository = require('../../src/dao/repositories/products.repository');
const Assert = require('assert')
const chai = require('chai')
const config = require('../../src/config')
const { describe } = require('node:test')

//Mongo
const mongoose = require('mongoose');
const MongoManager = require('../../src/dao/mongodb/db');
const classMongoDb = new MongoManager(config.urlMongo);
classMongoDb.connectionMongoDb()


const expect = chai.expect
const assert = Assert.strict

describe('testing Products Repository', () => {

    before(function () {
        this.productsRepository = new ProductsRepository();
    })
  
    //Test 01
    it('Return products with format array', async function () {

        // Given
        console.log(this.productsRepository)
        this.timeout(5000);
        const emptyArray = [];
        const isArrayTest = true

        // Then
        const result = await this.productsRepository.getProducts(); 

        // Assert that
        assert.strictEqual(Array.isArray(result), isArrayTest)

        //Expect
        expect(Array.isArray(result)).to.be.ok
        expect(result).to.be.deep.equal(emptyArray)
        expect(result.length).to.be.deep.equal(emptyArray.length)
    })

    //Test 02
    it('Must be add product succesfully in DB', async function () {
        //Given
        let mockProduct = {
            title: 'Rodilleras Manía de Futsal',
            description: 'Las mas avanzadas del mercado',
            code: '111222333',
            price: 32000,
            status: true,
            stock: 500,
            category: 'Protecciones',
            thumbanil: 'file',
        }

        //Then
        const result = await this.productsRepository.createProduct('rechleandroluis1@gmail.com', mockProduct)

        //Assert
        expect(result._id).to.be.ok
        // assert.ok(result._id);
    })

    afterEach(function () {
        mongoose.connection.collections.products.drop()
    });

})