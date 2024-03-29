'use strict';
var faker = require('faker');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    var bankName= 'HDFC';
    var productName=faker.random.arrayElement(['VISA Master', 'VISA Master', 'Platinum']);
    
    var SeedfileMasters = generateFakeFiles(bankName,1);
    await queryInterface.bulkInsert('fileMasters', SeedfileMasters, {});
    var Seedcards = generateFakeCards(bankName,productName,4,100);
    
    await queryInterface.bulkInsert('cards', Seedcards, {});

  
    bankName= 'ICICI';
    productName=faker.random.arrayElement(['VISA Master', 'VISA Master', 'Platinum']);
   
    SeedfileMasters = generateFakeFiles(bankName,5);
    Seedcards = generateFakeCards(bankName,productName,8,100);
    await queryInterface.bulkInsert('fileMasters', SeedfileMasters, {});
    await queryInterface.bulkInsert('cards', Seedcards, {});
  },

  async down (queryInterface, Sequelize) {
     queryInterface.sequelize.query('ALTER TABLE fileMasters AUTO_INCREMENT = 1');
    await queryInterface.bulkDelete('fileMasters', null, {});
    await queryInterface.bulkDelete('cards', null, {});;
    
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
        CutOffTime:faker.date.recent('100'),
        createdBy: randomIntFromInterval(1,6) ,
        modifiedBy: randomIntFromInterval(1,6) ,
        userId: randomIntFromInterval(1,6) ,
      });
  }
  
  for (let i = count; i < count+2; i++) {
    files.push({
        fileName: bank+'_'+faker.lorem.word(6)+'_'+i+'.zip',
        DataProcessor: faker.lorem.word(6),
        BureauName:'BureauName_'+faker.random.arrayElement(['a', 'b', 'c']),
        FileAttribute:'',
        CutOffTime: faker.date.soon('2'),
        createdBy: randomIntFromInterval(1,6) ,
        modifiedBy: randomIntFromInterval(1,6) ,
        userId: randomIntFromInterval(1,6) ,
      });
  }
  console.log('======= files =====',files);
  return files;
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateFakeCards(bankName,product,maxId,count){
  let cardsList=[];
  for(let i=0;i<count;i++){
     cardsList.push({
      Bank: bankName,
      Date:new Date(),
     
      Address1:'Address1_'+faker.lorem.word(2),
      Address2: 'Address2_'+faker.lorem.word(2),
      Address3: 'Address3_'+faker.lorem.word(2),
      City: 'Add_c_'+faker.lorem.word(2),
      State: 'Address_s_'+faker.lorem.word(2),
     
      AWB_No: 'AWB_'+faker.lorem.word(5),
      RTO_Address1:  'RTO1'+faker.lorem.word(2),
      RTO_Address2:  'RTO2'+faker.lorem.word(2),
      RTO_Address3:  'RTO3'+faker.lorem.word(2),
      Product: product ,
      Logo: faker.random.arrayElement(['FPL', 'PPL', 'GPL']),
      Scheme: faker.random.arrayElement(['VISA', 'MC', 'AMEX','JCB','CUP']),
     
      Courier_Code:'Courier_'+faker.random.arrayElement(['a', 'b', 'c']),
      Name:faker.lorem.word(7),
      fileMasterId: randomIntFromInterval(1,maxId) ,
      Bureau_Status : randomIntFromInterval(0,5) ,
      Courier_Status :  randomIntFromInterval(0,5) ,
      NRWC_Flag: faker.random.arrayElement(['N', 'R', 'W','C']),
      createdAt: faker.date.recent('30'),
      createdBy: randomIntFromInterval(1,maxId) ,
      modifiedBy: randomIntFromInterval(1,maxId) ,
      userId: randomIntFromInterval(1,maxId) ,
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