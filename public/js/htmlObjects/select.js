
function Option(label, value, isSelected, isDisabled){
    var html = (function() {
        var valueAttr = value ? " value = '" + value + "'" : constants.EMPTY_STRING;
        var selectionText = isSelected ? constants.ATTR_FOR_SELECTED : constants.EMPTY_STRING;
        var disabledText = isDisabled ? "disabled" : constants.EMPTY_STRING;
        return "<option " + selectionText + " " + disabledText + valueAttr + ">" + label + " </option>";
    })();

    this.getHtml = function(){
        return html;
    }
}