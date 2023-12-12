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

function getTATExtraDays(nrwc_type,totalDaysPassed){
  return Math.floor(totalDaysPassed - configNRWC.accepted_TAT_Bureau[nrwc_type])
}

function updateTATForFiles(allFiles){

  for(let i=0;i<allFiles.length;i++){
    
      let startDateForCardTAT = allFiles[i].dataValues.CutOffTime;

      allFiles[i].dataValues.bureauwithintat = 0;
      allFiles[i].dataValues.bureauoutsidetat = 0;
      allFiles[i].dataValues.courierwithintat = 0;
      allFiles[i].dataValues.courieroutsidetat = 0;
      allFiles[i].dataValues.totalCards = allFiles[i].cards.length;
      allFiles[i].dataValues['courieroutsidetat_list']=[];
      allFiles[i].dataValues['bureauoutsidetat_list'] =[];

      for(let j=0;j<allFiles[i].cards.length;j++){
        allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days']= Math.floor(( new Date() - new Date(startDateForCardTAT) )/(1000 * 60 * 60 * 24));
        if(allFiles[i].cards[j].dataValues.Bureau_Status === 1){
          allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days']= Math.floor(( new Date() - new Date(allFiles[i].cards[j].dataValues.Bureau_Status_Timestamp) )/(1000 * 60 * 60 * 24));
          allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] = allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days'];
          allFiles[i].dataValues.courieroutsidetat =  allFiles[i].dataValues.courieroutsidetat + 1;
          allFiles[i].dataValues['courieroutsidetat_list'].push(allFiles[i].cards[j].dataValues.id)
        }else{
          allFiles[i].cards[j].dataValues['Courier_Total_TAT_Days']=null;
          allFiles[i].cards[j].dataValues['Courier_TAT_Extra_Days_Passed'] =null;
          allFiles[i].cards[j].dataValues['Bureau_TAT_Extra_Days_Passed'] = getTATExtraDays(allFiles[i].cards[j].dataValues['NRWC_Flag'], allFiles[i].cards[j].dataValues['Bureau_Total_TAT_Days']);
      
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
