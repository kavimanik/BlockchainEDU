//basic contract for the EducationPage
var EducationPage = artifacts.require("./EducationPage.sol");

module.exports = function(deployer){
    deployer.deploy(EducationPage);
}