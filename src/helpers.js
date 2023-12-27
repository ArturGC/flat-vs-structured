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

const generateStructuredDocument = (schema) => {
  const numberOfFields = schema[0];
  const doc = {};

  for (let i = 0; i < numberOfFields; i += 1)
    if (schema.length === 1) {
      doc[`field${i}`] = getRandomFieldData();
    } else {
      doc[`field${i}`] = generateStructuredDocument(schema.slice(1));
    }

  return doc;
};

const convertFromStructuredToFlat = (structuredDoc) => {
  const flatDoc = {};

  for (const [key, value] of Object.entries(structuredDoc)) {
    if (typeof value === 'object' && !(value instanceof Date)) {
      const innerObject = convertFromStructuredToFlat(value);

      for (const [innerKey, innerValue] of Object.entries(innerObject)) {
        flatDoc[`${key}_${innerKey}`] = innerValue;
      }
    } else {
      flatDoc[key] = value;
    }
  }

  return flatDoc;
};

module.exports = { convertFromStructuredToFlat, generateStructuredDocument };
