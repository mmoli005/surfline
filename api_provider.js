const north_hb_pier = "http://api.surfline.com/v1/forecasts/4223?days=1";
const thirtysixth_st = "http://api.surfline.com/v1/forecasts/4226?days=1";
const blackies = "http://api.surfline.com/v1/forecasts/53412?days=1";
const oldmans = "http://api.surfline.com/v1/forecasts/109918?days=1";
const doheny = "http://api.surfline.com/v1/forecasts/4848?days=1";
const saltcreek = "http://api.surfline.com/v1/forecasts/4233?days=1";

const returnapi = location => {
  if (location == "northhb") {
    return north_hb_pier;
  } else if (location == "36thst") {
    return thirtysixth_st;
  } else if (location == "blackies") {
    return blackies;
  } else if (location == "oldmans") {
    return oldmans;
  } else if (location == "doheny") {
    return doheny;
  } else if (location == "saltcreek") {
    return saltcreek;
  }
};

module.exports = {
  returnapi: returnapi
};
