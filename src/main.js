'use strict';

const mdb = require('./mdb');
const flat = require('./plain');
const structured = require('./structured');

const queryIterations = 100;
const numberOfDocuments = 10_000;
const testes = [
  { numberOfFields: 10, numberOfSubFields: 5 },
  { numberOfFields: 25, numberOfSubFields: 5 },
  { numberOfFields: 50, numberOfSubFields: 5 },
  { numberOfFields: 100, numberOfSubFields: 5 },
];

const populateCollections = async ({ numberOfFields, numberOfSubFields }) => {
  await mdb.dropCollections();

  const docsFlat = flat.generateDocuments({
    numberOfDocuments,
    numberOfFields,
    numberOfSubFields,
  });

  const docsStructured = structured.generateDocuments({
    numberOfDocuments,
    numberOfFields,
    numberOfSubFields,
  });

  await Promise.all([
    mdb.collections.flat.insertMany(docsFlat),
    mdb.collections.structured.insertMany(docsStructured),
  ]);
};

const queryDocs = async (collection) => {
  for (let i = 0; i < queryIterations; i += 1)
    await collection.findOne({ nonExistingField: 'nonExistingValue' });
};

const main = async () => {
  for (const { numberOfFields, numberOfSubFields } of testes) {
    console.log(
      `\n\nNumber of field: ${numberOfFields}, Number of Subfields: ${numberOfSubFields}`
    );
    await populateCollections({ numberOfFields, numberOfSubFields });

    const structuredInit = new Date();
    await queryDocs(mdb.collections.structured);
    const structuredEnd = new Date();

    const flatInit = new Date();
    await queryDocs(mdb.collections.flat);
    const flatEnd = new Date();

    console.log('Time to transverse');
    console.log(` ... flat documents: ${flatEnd - flatInit}`);
    console.log(` ... structured documents: ${structuredEnd - structuredInit}`);
    console.log(
      `Diference: ${flatEnd - flatInit - (structuredEnd - structuredInit)}`
    );
  }

  await mdb.close();
};

module.exports = main;
