const db = require("../models");
const config = require("../config/auth.config");
const configNRWC = require("../config/global.config.js");
const FileMaster = db.fileMaster;
const Card = db.card;
const AuditLog = db.auditLog;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getFileTracking = async (req, res) => {
  try {
    const allFiles = await FileMaster.findAll({
      include: [{model: Card}]
    });
    const allFilesUpdated = updateTATForFiles(allFiles);
    res.json(allFilesUpdated);
  } catch (error) {
    res.json({ message: error.message });
  }
};


//search for specific Bank
exports.getBureauTracking = async (req, res) => {
  try {
    const allFiles = await FileMaster.findAll({
      include: [{model: Card}]
    });
    const allFilesUpdated = updateTATForFiles(allFiles);
    const bureauData = updateBureauGrouping(allFilesUpdated);
   // console.log('------------------------------------>>>',bureauData);
    res.json(bureauData);
  } catch (error) {
    res.json({ message: error.message });
  }
};

function getBureauSummary(allFilesData,bureauId){
  const bureauSummary = {
    allFiles:[],
    bureauId: bureauId,
    oldestDataSince:'',
    oldestDataDayCount:0,
    overAllDataAllocated:0,
    overCardsWithInTAT:0,
    overCardsOutsideTAT:0,
    overCardsWithInTATPercentage:0,
    overCardsOutsideTATPercentage:0,
    dateWiseSummary:[]
  };  
 
 

  dateWiseSummaryObj = {
    'TotalCountAllocated':0,
    'countDispatched':0,
    'countPending':0,
    'percentPending':0,
    'beyondTAT':0,
    'beyondTATPercentage':0,
    'overallPercentageWithinTAT':0,
    'willBeOutsideTATToday':0,
    'willBeOutsideTATTommorow':0,
  };


  bureauSummary['allFiles'] = allFilesData;
  bureauSummary['dateWiseSummary'].push(dateWiseSummaryObj) 
 // console.log('--------------------- Test calling getolderdaat------------------');
  //Search for oldest outside TAT Date
  // bureauSummary.allFiles
  oldestDate = getOldestTATDate(allFilesData);
  bureauSummary['oldestDate'] = oldestDate;
 // console.log('---------------------///// Test calling getolderdaat------------------>>>>',bureauSummary['oldestDate']);

  return bureauSummary;
}

function getOldestTATDate(fileList){
  //search for file have=ing heighest Bureau_TAT_Extra_Days_Passed
 // console.log('--------------------- INSIDE Test calling getolderdaat------------------',fileList[0].dataValues.cards)
  let maxTATVal=0;
  let maxDetailData={};
  let TATWiseGroup = {}
  let TATDateLIST=[]
  for(let i=0;i<fileList.length;i++){
    for(let k=0;k<fileList[i].cards.length;k++){
      if(maxTATVal < fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed){
        maxTATVal = fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed;
        maxDetailData['oldestDataSet'] =  fileList[i].cards[k].dataValues;
      }

      // IF TAT is already Present in List then don't push in list,
      //    fetch previous Data and do average
      // if Not Present , push in list add in TATWiseGroup
      if(TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]){
        let TotalCountAllocated = TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]['TotalCountAllocated']+ fileList[i].dataValues.totalCards ;
        let countDispatched = TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]['countDispatched']+  fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat;
        let countPending  = TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]['countPending'] + (fileList[i].dataValues.totalCards - (fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat) );
        let beyondTAT = TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]['beyondTAT'] + fileList[i].dataValues.bureauoutsidetat;
        let withinTAT = TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]['withinTAT'] + fileList[i].dataValues.bureauwithintat;

      TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]={
          'TotalCountAllocated':  TotalCountAllocated,
          'countDispatched': countDispatched,
          'countPending': countPending,
          'percentPending':0,
          'beyondTAT': beyondTAT,
          'withinTAT':withinTAT,
          'beyondTATPercentage':0,
          'overallPercentageWithinTAT':0,
          'willBeOutsideTATToday':0,
          'willBeOutsideTATTommorow':0,
        }
        
      }else{

        if(fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed){
          TATDateLIST.push(fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed)
        }
      
       
        let TotalCountAllocated = fileList[i].dataValues.totalCards ;
        let countDispatched = fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat;
        let countPending  = fileList[i].dataValues.totalCards - (fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat) ;
        let beyondTAT = fileList[i].dataValues.bureauoutsidetat;
        let withinTAT = fileList[i].dataValues.bureauwithintat;
        
        TATWiseGroup[fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed]={
            'TotalCountAllocated': TotalCountAllocated ,
            'countDispatched': countDispatched,
            'countPending': countPending,
            'percentPending':0,
            'beyondTAT': beyondTAT,
            'withinTAT': withinTAT,
            'beyondTATPercentage':0,
            'overallPercentageWithinTAT':0,
            'willBeOutsideTATToday':0,
            'willBeOutsideTATTommorow':0,
        }
      }
     


      
     }        
  }
  
  TATDateLIST.sort(function(a, b){return a-b});

  maxDetailData['TATWiseGroup']=TATWiseGroup;
  maxDetailData['TATDateLIST']=TATDateLIST;

  console.log('-------------------------- TATDateLIST --------------------------',TATDateLIST)
  return maxDetailData;
}

exports.fetchBureauData = async (req, res) => {
   console.log("------->>> BureauId --->",req.params.id);
   const allFiles = await FileMaster.findAll({
    where: {
      BureauName: req.params.id
    },
    include: [{model: Card}]
  });
  const allFilesUpdated = updateTATForFiles(allFiles);

  const bureauSummaryData = getBureauSummary(allFilesUpdated,req.params.id)
  
  res.json(bureauSummaryData); 
}

function updateBureauGrouping(allFilesData){

  const BureauGrouping={};
  for(let i=0;i<allFilesData.length;i++){
    console.log('---- cards ----',allFilesData[i]);
    if(BureauGrouping[allFilesData[i].dataValues['BureauName']]=== undefined){
      BureauGrouping[allFilesData[i].dataValues['BureauName']]={};
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat'] = allFilesData[i].dataValues['bureauoutsidetat'];
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat'] = allFilesData[i].dataValues['bureauwithintat'];

    }else{
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat'] = BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat']+ allFilesData[i].dataValues['bureauoutsidetat'];
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat'] = BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat']  + allFilesData[i].dataValues['bureauwithintat'];

    }
   
  }
  return BureauGrouping;
}

function getTATExtraDays(nrwc_type,totalDaysPassed){
  return Math.floor(totalDaysPassed - configNRWC.accepted_TAT_Bureau[nrwc_type])
}

function updateTATForFiles(allFiles){

  for(let i=0;i<allFiles.length;i++){
    
      let startDateForCardTAT = allFiles[i].dataValues.CutOffTime;

      allFiles[i].dataValues.bureauwithintat = 0;
      allFiles[i].dataValues.bureauoutsidetat = 0;
      allFiles[i].dataValues.bureauWIP = 0;
      allFiles[i].dataValues.courierwithintat = 0;
      allFiles[i].dataValues.courieroutsidetat = 0;
      allFiles[i].dataValues.totalCards = allFiles[i].cards.length;
      allFiles[i].dataValues['courieroutsidetat_list']=[];
      allFiles[i].dataValues['bureauoutsidetat_list'] =[];
      allFiles[i].dataValues['bureauoutwip_list'] =[];

      for(let j=0;j<allFiles[i].cards.length;j++){
        allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days']= Math.floor(( new Date() - new Date(startDateForCardTAT) )/(1000 * 60 * 60 * 24));
        if(allFiles[i].cards[j].dataValues.Bureau_Status === 1){
          allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days']= Math.floor(( new Date() - new Date(allFiles[i].cards[j].dataValues.Bureau_Status_Timestamp) )/(1000 * 60 * 60 * 24));
          allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] = allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days'];
          allFiles[i].dataValues.courieroutsidetat =  allFiles[i].dataValues.courieroutsidetat + 1;
          allFiles[i].dataValues['courieroutsidetat_list'].push(allFiles[i].cards[j].dataValues.id)
        }else{
          // console.log('----- B statue not 1 ---->',allFiles[i].cards[j].dataValues.id,allFiles[i].cards[j].dataValues.Bureau_Status);
          allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days']=null;
          allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] =null;
          allFiles[i].cards[j].dataValues['Bureau_TAT_Extra_Days_Passed'] = getTATExtraDays(allFiles[i].cards[j].dataValues['NRWC_Flag'], allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days']);
          allFiles[i].dataValues.bureauWIP =  allFiles[i].dataValues.bureauWIP + 1;
          allFiles[i].dataValues['bureauoutwip_list'].push(allFiles[i].cards[j].dataValues.id);
        }

        if(allFiles[i].cards[j].dataValues['Bureau_TAT_Extra_Days_Passed']>0){
          allFiles[i].dataValues.bureauoutsidetat = allFiles[i].dataValues.bureauoutsidetat + 1;
          allFiles[i].dataValues['bureauoutsidetat_list'].push(allFiles[i].cards[j].dataValues.id);
        }

      }

      allFiles[i].dataValues.bureauwithintat  = allFiles[i].dataValues.totalCards  - allFiles[i].dataValues.bureauoutsidetat;
  }

  // create tat and outside tat list
  for(let i=0;i<allFiles.length;i++){
    allFiles[i].dataValues['bureauoutsidetat_listData'] =[];
    allFiles[i].dataValues['bureauwithintat_listData'] =[];
    allFiles[i].dataValues['courieroutsidetat_listData']=[];
    allFiles[i].dataValues['courierwithintat_listData']=[];

    for(let j=0;j<allFiles[i].cards.length;j++){
        if(allFiles[i].dataValues['courieroutsidetat_list'].includes(allFiles[i].cards[j].dataValues.id)){
          allFiles[i].dataValues['courieroutsidetat_listData'].push(allFiles[i].cards[j].dataValues);
        }else{
          allFiles[i].dataValues['courierwithintat_listData'].push(allFiles[i].cards[j].dataValues);
        }
        if(allFiles[i].dataValues['bureauoutsidetat_list'].includes(allFiles[i].cards[j].dataValues.id)){
          allFiles[i].dataValues['bureauoutsidetat_listData'].push(allFiles[i].cards[j].dataValues);
        }else{
          allFiles[i].dataValues['bureauwithintat_listData'].push(allFiles[i].cards[j].dataValues);
        }
    }
  }

  return allFiles;
}


exports.getFileTrackingById = async (req, res) => {
  try {
    const fileDetailsByFileId = await FileMaster.findOne({
      where: {
        id: req.params.id
      },
      include: [{model: Card}]
    });
    res.json(fileDetailsByFileId);
  } catch (error) {
    res.json({ message: error.message });
  }
};
