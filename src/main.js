'use strict';

const mdb = require('./mdb');
const helpers = require('./helpers');

const queryIterations = 100;
const numberOfDocuments = 10_000;
const tests = [
  { schema: [2, 5] },
  { schema: [5, 5] },
  { schema: [10, 5] },
  { schema: [20, 5] },
];

const populateCollections = async ({ schema }) => {
  await mdb.dropCollections();

  const docsStructured = Array.from({ length: numberOfDocuments }).map(() =>
    helpers.generateStructuredDocument(schema)
  );
  const docsFlat = docsStructured.map((docStructured) =>
    helpers.convertFromStructuredToFlat(docStructured)
  );

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
  for (const { schema } of tests) {
    const totalFields = schema.reduce((acc, cur) => acc * cur, 1);
    console.log(
      `\n\nFlat Schema: ${totalFields}, Structured Schema: ${schema}`
    );

    await populateCollections({ schema });

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
