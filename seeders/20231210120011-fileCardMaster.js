'use strict';
var faker = require('faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    

    var SeedfileMasters = generateFakeFiles('hdfc',5);
    await queryInterface.bulkInsert('fileMasters', SeedfileMasters, {});
    SeedfileMasters = generateFakeFiles('icici',5);
    await queryInterface.bulkInsert('fileMasters', SeedfileMasters, {});

    var Seedcards = generateFakeCards(1000);

    await queryInterface.bulkInsert('cards', Seedcards, {});
 

  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query('ALTER TABLE fileMasters AUTO_INCREMENT = 1');
    await queryInterface.bulkDelete('fileMasters', null, {});
    await queryInterface.bulkDelete('cards', null, {});
    queryInterface.sequelize.query('ALTER TABLE cards AUTO_INCREMENT = 1');
    
  }
};

function generateFakeFiles(bank,count) {

  let files = [];

  for (let i = 0; i < count; i++) {

    files.push({
        fileName: bank+'_'+faker.lorem.word(6)+'.zip',
        DataProcessor: faker.lorem.word(6),
        BureauName:'BureauName_'+faker.random.arrayElement(['a', 'b', 'c']),
        FileAttribute:'',
        CuffOffTime:faker.date.recent('100')
      });
  }
  
  for (let i = count; i < count+2; i++) {
    files.push({
        fileName: bank+'_'+faker.lorem.word(6)+'_'+i+'.zip',
        DataProcessor: faker.lorem.word(6),
        BureauName:'BureauName_'+faker.random.arrayElement(['a', 'b', 'c']),
        FileAttribute:'',
        CuffOffTime: faker.date.soon('2')
      });
  }
  console.log('======= files =====',files);
  return files;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateFakeCards(count){
  let cardsList=[];
  for(let i=0;i<count;i++){
     cardsList.push({
      Bank: faker.random.arrayElement(["IDFC", "HDFC", "SBI"]),
      Date:new Date(),
     
      Address1: faker.address.Address1,
      Address2:faker.address.Address2,
      Address3: faker.address.Address3,
      City: faker.address.City,
      State: faker.address.State,
     
      AWB_No: faker.internet.AWB_No,
      RTO_Address1:  faker.address.Address1,
      RTO_Address2:  faker.address.Address2,
      RTO_Address3:  faker.address.Address3,
     
      Courier_Code:'Courier_'+faker.random.arrayElement(['a', 'b', 'c']),
      
      fileMasterId: randomIntFromInterval(1,10) 
     })
  }

  console.log(cardsList);
  return cardsList;
}

/*

 Product: faker.helpers.arrayElement(['VISA Master', 'VISA Master', 'Platinum']),
      Logo: faker.helpers.arrayElement(['FPL', 'PPL', 'GPL']),
      Scheme: faker.helpers.arrayElement(['VISA', 'MC', 'AMEX','JCB','CUP']),
      Name: faker.internet.Name,

      */