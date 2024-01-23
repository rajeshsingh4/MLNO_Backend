const db = require("../models");
const configNRWC = require("../config/global.config.js");
const FileMaster = db.fileMaster;
const Card = db.card;

exports.getFileTracking = async (req, res) => {
  try {
    let findAllConditions = {
      include: [
        {
          model: Card,
          where: {
            Bank: req.organisation
          }
        }
      ]
    };
    const allFiles = await FileMaster.findAll(findAllConditions);
    const allFilesUpdated = updateTATForFiles(allFiles);
    res.status(200).send(allFilesUpdated);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};


//search for specific Bank
exports.getBureauTracking = async (req, res) => {
  try {
    const allFiles = await FileMaster.findAll({
      include: [{ model: Card }]
    });
    const allFilesUpdated = updateTATForFiles(allFiles);
    const bureauData = updateBureauGrouping(allFilesUpdated);
    // console.log('------------------------------------>>>',bureauData);
    res.status(200).send(bureauData);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

function getBureauSummary(allFilesData, bureauId) {
  const bureauSummary = {
    allFiles: [],
    bureauId: bureauId
  };

  bureauSummary['allFiles'] = allFilesData;
  // bureauSummary['dateWiseSummary'].push(dateWiseSummaryObj)

  //Search for oldest outside TAT Date
  // bureauSummary.allFiles
  oldestDate = getOldestTATDate(allFilesData);
  bureauSummary['oldestDate'] = oldestDate;

  return bureauSummary;
}

function getOldestTATDate(fileList) {
  //search for file have=ing heighest Bureau_TAT_Extra_Days_Passed

  let maxTATVal = 0;
  let maxDetailData = {};
  let TATWiseGroup = {}
  let TATDateLIST = []
  for (let i = 0; i < fileList.length; i++) {
    for (let k = 0; k < fileList[i].cards.length; k++) {
      if (maxTATVal < fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed) {
        maxTATVal = fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed;
        maxDetailData['oldestDataSet'] = fileList[i].cards[k].dataValues;
      }

      let CutOffTime = new Date(fileList[i].dataValues.CutOffTime).toLocaleDateString();
      // let CutOffTime = fileList[i].dataValues.CutOffTime;
      // IF TAT is already Present in List then don't push in list,
      //    fetch previous Data and do average
      // if Not Present , push in list add in TATWiseGroup
      if (TATWiseGroup[CutOffTime]) {
        let TotalCountAllocated = TATWiseGroup[CutOffTime]['TotalCountAllocated'] + fileList[i].dataValues.totalCards;
        let countDispatched = TATWiseGroup[CutOffTime]['countDispatched'] + fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat;
        let countPending = TATWiseGroup[CutOffTime]['countPending'] + (fileList[i].dataValues.totalCards - (fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat));
        let beyondTAT = TATWiseGroup[CutOffTime]['beyondTAT'] + fileList[i].dataValues.bureauoutsidetat;
        let withinTAT = TATWiseGroup[CutOffTime]['withinTAT'] + fileList[i].dataValues.bureauwithintat;

        TATWiseGroup[CutOffTime] = {
          'TotalCountAllocated': TotalCountAllocated,
          'countDispatched': countDispatched,
          'countPending': countPending,
          'percentPending': 0,
          'beyondTAT': beyondTAT,
          'withinTAT': withinTAT,
          'beyondTATPercentage': 0,
          'overallPercentageWithinTAT': 0,
          'willBeOutsideTATToday': 0,
          'willBeOutsideTATTommorow': 0,
          'dateAllocated': CutOffTime,
        }

      } else {

        if (fileList[i].cards[k].dataValues.Bureau_TAT_Extra_Days_Passed) {
          TATDateLIST.push(CutOffTime)
        }

        let TotalCountAllocated = fileList[i].dataValues.totalCards;
        let countDispatched = fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat;
        let countPending = fileList[i].dataValues.totalCards - (fileList[i].dataValues.courieroutsidetat + fileList[i].dataValues.courierwithintat);
        let beyondTAT = fileList[i].dataValues.bureauoutsidetat;
        let withinTAT = fileList[i].dataValues.bureauwithintat;

        TATWiseGroup[CutOffTime] = {
          'TotalCountAllocated': TotalCountAllocated,
          'countDispatched': countDispatched,
          'countPending': countPending,
          'percentPending': 0,
          'beyondTAT': beyondTAT,
          'withinTAT': withinTAT,
          'beyondTATPercentage': 0,
          'overallPercentageWithinTAT': 0,
          'willBeOutsideTATToday': 0,
          'willBeOutsideTATTommorow': 0,
          'dateAllocated': CutOffTime,
        }
      }
    }
  }

  // TATDateLIST.sort(function(a, b){return a-b});
  TATDateLIST.sort(function (a, b) {
    // Convert the date strings to Date objects
    let dateA = new Date(a);
    let dateB = new Date(b);

    // Subtract the dates to get a value that is either negative, positive, or zero
    return dateA - dateB;
  });
  /*   
   
    overAllDataAllocated:0,
    overCardsWithInTAT:0,
    overCardsOutsideTAT:0,
    overCardsWithInTATPercentage:0,
    overCardsOutsideTATPercentage:0,
     'beyondTAT': beyondTAT,
            'withinTAT': withinTAT,
  */
  maxDetailData['overAllDataAllocated'] = 0;
  maxDetailData['overCardsWithInTAT'] = 0;
  maxDetailData['overCardsOutsideTAT'] = 0;
  maxDetailData['overCardsCountPending'] = 0;

  for (key in TATWiseGroup) {
    // code block to be executed
    console.log('---- key->>>>', key);
    console.log('-------------------------- BEFORE overAllDataAllocated --------------------------', maxDetailData['overAllDataAllocated'])
    TATWiseGroup[key]['percentPending'] = Math.floor((TATWiseGroup[key]['countPending'] / TATWiseGroup[key]['TotalCountAllocated']) * 100, 1)
    TATWiseGroup[key]['beyondTATPercentage'] = Math.floor((TATWiseGroup[key]['beyondTAT'] / TATWiseGroup[key]['TotalCountAllocated']) * 100, 1)
    TATWiseGroup[key]['overallPercentageWithinTAT'] = 100 - TATWiseGroup[key]['beyondTATPercentage'];
    maxDetailData['overAllDataAllocated'] = maxDetailData['overAllDataAllocated'] + TATWiseGroup[key]['TotalCountAllocated'];
    maxDetailData['overCardsWithInTAT'] = maxDetailData['overCardsWithInTAT'] + TATWiseGroup[key]['withinTAT'];
    maxDetailData['overCardsOutsideTAT'] = maxDetailData['overCardsOutsideTAT'] + TATWiseGroup[key]['beyondTAT'];
    maxDetailData['overCardsCountPending'] = maxDetailData['overCardsCountPending'] + TATWiseGroup[key]['countPending'];
    console.log('-------------------------- overAllDataAllocated --------------------------', maxDetailData['overAllDataAllocated'])
  }

  maxDetailData['overAllTotalCardWithInTATPercentage'] = Math.floor((maxDetailData['overCardsWithInTAT'] / maxDetailData['overAllDataAllocated']) * 100, 2);
  maxDetailData['overAllTotalCardOutsideTATPercentage'] = 100 - maxDetailData['overAllTotalCardWithInTATPercentage'];

  maxDetailData['TATWiseGroup'] = TATWiseGroup;
  maxDetailData['TATDateLIST'] = TATDateLIST;

  // console.log('-------------------------- TATDateLIST --------------------------',TATWiseGroup)
  return maxDetailData;
}

exports.fetchBureauData = async (req, res) => {
  try {
    const allFiles = await FileMaster.findAll({
      where: {
        BureauName: req.params.id
      },
      include: [{ model: Card }]
    });
    const allFilesUpdated = updateTATForFiles(allFiles);
  
    const bureauSummaryData = getBureauSummary(allFilesUpdated, req.params.id)
  
    res.status(200).send(bureauSummaryData);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
}

function updateBureauGrouping(allFilesData) {

  const BureauGrouping = {};
  for (let i = 0; i < allFilesData.length; i++) {
    console.log('---- cards ----', allFilesData[i]);
    if (BureauGrouping[allFilesData[i].dataValues['BureauName']] === undefined) {
      BureauGrouping[allFilesData[i].dataValues['BureauName']] = {};
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat'] = allFilesData[i].dataValues['bureauoutsidetat'];
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat'] = allFilesData[i].dataValues['bureauwithintat'];

    } else {
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat'] = BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauoutsidetat'] + allFilesData[i].dataValues['bureauoutsidetat'];
      BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat'] = BureauGrouping[allFilesData[i].dataValues['BureauName']]['bureauwithintat'] + allFilesData[i].dataValues['bureauwithintat'];

    }
  }
  return BureauGrouping;
}

function getTATExtraDays(nrwc_type, totalDaysPassed) {
  return Math.floor(totalDaysPassed - configNRWC.accepted_TAT_Bureau[nrwc_type])
}

function updateTATForFiles(allFiles) {

  for (let i = 0; i < allFiles.length; i++) {

    let startDateForCardTAT = allFiles[i].dataValues.CutOffTime;

    allFiles[i].dataValues.bureauwithintat = 0;
    allFiles[i].dataValues.bureauoutsidetat = 0;
    allFiles[i].dataValues.bureauWIP = 0;
    allFiles[i].dataValues.courierwithintat = 0;
    allFiles[i].dataValues.courieroutsidetat = 0;
    allFiles[i].dataValues.totalCards = allFiles[i].cards.length;
    allFiles[i].dataValues['courieroutsidetat_list'] = [];
    allFiles[i].dataValues['bureauoutsidetat_list'] = [];
    allFiles[i].dataValues['bureauoutwip_list'] = [];

    for (let j = 0; j < allFiles[i].cards.length; j++) {
      allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days'] = Math.floor((new Date() - new Date(startDateForCardTAT)) / (1000 * 60 * 60 * 24));
      if (allFiles[i].cards[j].dataValues.Bureau_Status === 1) {
        allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days'] = Math.floor((new Date() - new Date(allFiles[i].cards[j].dataValues.Bureau_Status_Timestamp)) / (1000 * 60 * 60 * 24));
        allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] = allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days'];
        allFiles[i].dataValues.courieroutsidetat = allFiles[i].dataValues.courieroutsidetat + 1;
        allFiles[i].dataValues['courieroutsidetat_list'].push(allFiles[i].cards[j].dataValues.id)
      } else {
        // console.log('----- B statue not 1 ---->',allFiles[i].cards[j].dataValues.id,allFiles[i].cards[j].dataValues.Bureau_Status);
        allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days'] = null;
        allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] = null;
        allFiles[i].cards[j].dataValues['Bureau_TAT_Extra_Days_Passed'] = getTATExtraDays(allFiles[i].cards[j].dataValues['NRWC_Flag'], allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days']);
        allFiles[i].dataValues.bureauWIP = allFiles[i].dataValues.bureauWIP + 1;
        allFiles[i].dataValues['bureauoutwip_list'].push(allFiles[i].cards[j].dataValues.id);
      }

      if (allFiles[i].cards[j].dataValues['Bureau_TAT_Extra_Days_Passed'] > 0) {
        allFiles[i].dataValues.bureauoutsidetat = allFiles[i].dataValues.bureauoutsidetat + 1;
        allFiles[i].dataValues['bureauoutsidetat_list'].push(allFiles[i].cards[j].dataValues.id);
      }

    }

    allFiles[i].dataValues.bureauwithintat = allFiles[i].dataValues.totalCards - allFiles[i].dataValues.bureauoutsidetat;
  }

  // create tat and outside tat list
  for (let i = 0; i < allFiles.length; i++) {
    allFiles[i].dataValues['bureauoutsidetat_listData'] = [];
    allFiles[i].dataValues['bureauwithintat_listData'] = [];
    allFiles[i].dataValues['courieroutsidetat_listData'] = [];
    allFiles[i].dataValues['courierwithintat_listData'] = [];

    for (let j = 0; j < allFiles[i].cards.length; j++) {
      if (allFiles[i].dataValues['courieroutsidetat_list'].includes(allFiles[i].cards[j].dataValues.id)) {
        allFiles[i].dataValues['courieroutsidetat_listData'].push(allFiles[i].cards[j].dataValues);
      } else {
        allFiles[i].dataValues['courierwithintat_listData'].push(allFiles[i].cards[j].dataValues);
      }
      if (allFiles[i].dataValues['bureauoutsidetat_list'].includes(allFiles[i].cards[j].dataValues.id)) {
        allFiles[i].dataValues['bureauoutsidetat_listData'].push(allFiles[i].cards[j].dataValues);
      } else {
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
      include: [{ model: Card }]
    });
    res.status(200).send(fileDetailsByFileId);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};
