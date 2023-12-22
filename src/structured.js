'use strict';

const { getRandomFieldData } = require('./utils');

const generateDocument = ({ numberOfFields, numberOfSubFields }) => {
  const doc = {};

  for (let i = 0; i < numberOfFields / numberOfSubFields; i += 1) {
    const fieldName = `field${i}`;

    for (let j = 0; j < numberOfSubFields; j += 1) {
      const subFieldName = `subfield${j}`;

      if (doc[fieldName]) doc[fieldName][subFieldName] = getRandomFieldData();
      else doc[fieldName] = { [subFieldName]: getRandomFieldData() };
    }
  }

  return doc;
};

const generateDocuments = ({
  numberOfDocuments,
  numberOfFields,
  numberOfSubFields,
}) => {
  return Array.from({ length: numberOfDocuments }).map(() =>
    generateDocument({ numberOfFields, numberOfSubFields })
  );
};

module.exports = { generateDocuments };
