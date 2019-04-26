const express = require('express')
const router = express.Router()
const moment = require('moment');

// Add your routes here - above the module.exports line

// Code supplied by Gary for dealing with query strings
router.use(function(req, res, next){
  Object.assign(res.locals,{
    postData: (req.body ? req.body : false)
  });

  Object.assign(res.locals,{
    getData: (req.query ? req.query : false)
  });

  next();
});

var path = require('path')

// Data sources
router.all('/data/:data/source/:source', (req, res) => {
  const { data, source } = req.params
  res.json(require(`./data/${data}/source/${source}`))
})

// Code from Steven for dealing with variables on list page

router.get('/apply/v9/list', (req, res, next) => {

  if (!req.session.sectionStatus){
    console.log('no session');
    req.session.sectionStatus = {
      // cwyn: 'complete',
      yourhealth: undefined,
      paidwork: undefined,
      ssp: undefined,
      voluntarywork: undefined,
      pension: undefined,
      insurance: undefined,
      yourdetails: undefined,
      submitted: undefined,
    }
  }

  if (req.query.yourhealth) {
    req.session.sectionStatus.yourhealth = req.query.yourhealth
  };
  if (req.query.paidwork) {
    req.session.sectionStatus.paidwork = req.query.paidwork
  };
  if (req.query.ssp) {
    req.session.sectionStatus.ssp = req.query.ssp
  };
  if (req.query.voluntarywork) {
    req.session.sectionStatus.voluntarywork = req.query.voluntarywork
  };
  if (req.query.pension) {
    req.session.sectionStatus.pension = req.query.pension
  };
  if (req.query.insurance) {
    req.session.sectionStatus.insurance = req.query.insurance
  };
  if (req.query.yourdetails) {
    req.session.sectionStatus.yourdetails = req.query.yourdetails
  };
  if (req.query.submitted) {
    req.session.sectionStatus.submitted = req.query.submitted
  };

  res.render('apply/v9/list.html', {sectionStatus: req.session.sectionStatus});
});


// Adding the moment plug in for Claim Date screen
router.get('/*/claimdate', function (req, res, next) {
  var ssp = req.session.data['ssp-dob-year'] + '-' +req.session.data['ssp-dob-month'] + '-' + req.session.data['ssp-dob-day'];
  ssp = moment(ssp, 'YYYY-MM-DD');
  
  var recent = req.session.data['ssp-recent-dob-year'] + '-' +req.session.data['ssp-recent-dob-month'] + '-' + req.session.data['ssp-recent-dob-day'];
  recent = moment(recent, 'YYYY-MM-DD');
  
  var last = req.session.data['last-dob-year'] + '-' +req.session.data['last-dob-month'] + '-' + req.session.data['last-dob-day'];
  last = moment(last, 'YYYY-MM-DD');
  
  var dateToShow, whichDate;
  if (last.isValid() && req.session.data['self-employed'] == 'mines') {
    whichDate = 'lastWorked';
    dateToShow = last;
  }

  if(recent.isValid()) {
    whichDate = 'sspRecent';
    dateToShow = recent;
  }

  if(ssp.isValid()) {
    whichDate = 'ssp';
    dateToShow = ssp;
  }

  if(dateToShow > moment().subtract(3, 'months')) {
    dateToShow.add(1, 'days');
    res.locals.dateToShow = dateToShow.format('D MMMM YYYY');
    res.locals.whichDate = whichDate;
  } else {
    res.locals.whichDate = whichDate;
    res.locals.date3monthsAgo = moment().subtract(3, 'months').add(1, 'days').format('D MMMM YYYY')
  }

  next();
})

// Adding the moment plug in for the fit for work screen
router.get('/*/fit-for-work', function (req, res, next) {
  var ssp = req.session.data['ssp-dob-year'] + '-' +req.session.data['ssp-dob-month'] + '-' + req.session.data['ssp-dob-day'];
  ssp = moment(ssp, 'YYYY-MM-DD');
  
  var recent = req.session.data['ssp-recent-dob-year'] + '-' +req.session.data['ssp-recent-dob-month'] + '-' + req.session.data['ssp-recent-dob-day'];
  recent = moment(recent, 'YYYY-MM-DD');
  
  var last = req.session.data['last-dob-year'] + '-' +req.session.data['last-dob-month'] + '-' + req.session.data['last-dob-day'];
  last = moment(last, 'YYYY-MM-DD');
  
  var dateToShow, whichDate;
  if (last.isValid() && req.session.data['self-employed'] == 'mines') {
    whichDate = 'lastWorked';
    dateToShow = last;
  }

  if(recent.isValid()) {
    whichDate = 'sspRecent';
    dateToShow = recent;
  }

  if(ssp.isValid()) {
    whichDate = 'ssp';
    dateToShow = ssp;
  }

  if(dateToShow > moment().subtract(3, 'months')) {
    dateToShow.add(1, 'days');
    res.locals.dateToShow = dateToShow.format('D MMMM YYYY');
    res.locals.whichDate = whichDate;
  } else {
    res.locals.whichDate = whichDate;
    res.locals.date3monthsAgo = moment().subtract(3, 'months').add(1, 'days').format('D MMMM YYYY')
  }

  next();
})

// Page routing
router.get('*', function (req, res, next) {
  if (req.params[0].substr(-1) == '/') res.locals.path = req.params[0].slice(0,-1).substr(1);
  else res.locals.path = path.dirname(req.params[0]).substr(1);
  next();
})



module.exports = router
