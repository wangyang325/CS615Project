module.exports = {
    JsonSort: function (json, key) {
        return JsonSort(json, key);
    }
};
// *********************************
// ** Order Json file
// *********************************
function JsonSort(json, key)
{
    for (let j = 1, jl = json.length; j < jl; j++) {
        let temp = json[j],
            val = temp[key],
            i = j - 1;
        while (i >= 0 && json[i][key] > val) {
            json[i + 1] = json[i];
            i = i - 1;
        }
        json[i + 1] = temp;
    }
    return json;
}