var constants = {

    OTHER :{
        displayName : 'Other',
        value : 'other'
    },
    SLIDE_TIME_IN_MILLIS : 50,
    ATTR_FOR_SELECTED : 'selected',
    EMPTY_STRING : ""
};

var URI = {
    distributions : "distributions"
};

var errorMessages ={
    failMessage : "Error fetching distribution list"
};


var getCachedDistributions = null;

function fetchDistributions(){

    return $.ajax({
            url: URI.distributions,
            type: "GET"
        })
        .done(function (distributions) {
            getCachedDistributions = (function(){
                return function(){ return sortedDistributions(distributions)};
            })();
        })
        .fail(function (jqXHR) {
            bootbox.alert(errorMessages.failMessage + jqXHR.statusText);
        })
}

function sortedDistributions(distributions){
    return distributions.sort(function(distro1, distro2){
        return distro1.name.localeCompare(distro2.name);
    });
}

function createHtmlForDistributionInfo(distributionId) {
    var html = '';
    getCachedDistributions().forEach(function (distribution) {
        if (distribution.id == distributionId) {
            html = "<div><span class='site-label'>Distribution:</span> " + distribution.name + "</div>";
            return false;
        }
    });
    return html;
}

function getDistributionByName(distributionName) {
    return getCachedDistributions().find(function(distribution){
        return distribution.name === distributionName
    });
}

function getDistributionById(id){
    return getCachedDistributions().find(function(distribution){
        return distribution.id == id;
    });
}
function manageOtherDistribution(element){
    var index =  element.selectedIndex;
    var selectedText = element.options[index].text.toLowerCase();

    selectedText === constants.OTHER.value ?
        $('#nonStandardDistributionNameContainer').slideDown(constants.SLIDE_TIME_IN_MILLIS):
        $('#nonStandardDistributionNameContainer').slideUp(constants.SLIDE_TIME_IN_MILLIS);
        $('#nonStandardDistributionName').removeAttr('value');
}

function createOptionsForDistributionSelectBox(siteDistributionId, attributes) {
    var html = new Option(" -- Select Distribution --", null, true, true).getHtml();

    var isOtherSelected = false;
    getCachedDistributions().forEach(function (distribution){
        //is_standard value is returned as "0" or 0 based on MySql version so it is equated to true to make it compatible with all versions
        if(distribution.is_standard == true){
            var isSelected = siteDistributionId == distribution.id;
            html += new Option(distribution.name, distribution.id, isSelected).getHtml();
        }

        if(!siteDistributionId && attributes.name != constants.EMPTY_STRING){
            isOtherSelected = true;
            attributes.containerClass = constants.EMPTY_STRING;
        }

        if(distribution.is_standard != true && distribution.id == siteDistributionId){
            isOtherSelected = true;
            attributes.name = distribution.name;
            attributes.containerClass = constants.EMPTY_STRING;
        }
    });

    html+= new Option(constants.OTHER.displayName, constants.OTHER.value, isOtherSelected).getHtml();

    return html;
}

function createNonStandardDistributionInput(nonStandardDistribution) {

    var html = "<div class='form-group " + nonStandardDistribution.containerClass + "' id='nonStandardDistributionNameContainer'>";
    html += "<input type='text' id='nonStandardDistributionName' placeholder='Enter distribution name' class='form-control input-sm' value='" + nonStandardDistribution.name + "'></div>";
    return html;
}

function createDistributionSelectBox(siteDistributionId, nonStandardDistributionName) {

    var nonStandardDistribution ={
        containerClass : "soft-hidden",
        name : nonStandardDistributionName || constants.EMPTY_STRING
    };

    var html = "<div class='form-group'>";
    html += "<select title='Distribution' id='distributions' class='form-control input-sm' onchange='manageOtherDistribution(this)'>";
    html += createOptionsForDistributionSelectBox(siteDistributionId, nonStandardDistribution);
    html += "</select></div>";
    html += createNonStandardDistributionInput(nonStandardDistribution);

    return html;
}

function getSelectedDistributionValue() {
    return $("select#distributions").val() == constants.OTHER.value ? null : $("select#distributions").val();
}
