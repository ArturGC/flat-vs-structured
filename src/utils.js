'use strict';

const { faker } = require('@faker-js/faker');

const randomGenerators = [
  faker.person.firstName,
  faker.person.middleName,
  faker.person.lastName,
  faker.location.street,
  faker.location.buildingNumber,
  faker.location.city,
  faker.location.zipCode,
  faker.location.state,
  faker.location.country,
  faker.company.name,
  faker.company.catchPhrase,
];

const getRandomFieldData = () => {
  return randomGenerators[
    Math.floor(randomGenerators.length * Math.random())
  ]();
};

module.exports = { getRandomFieldData };
