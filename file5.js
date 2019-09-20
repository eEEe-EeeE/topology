function isSimilarVertex(vertex1, vertex2) {
    if (vertex1.getExtProperty("devType") !== vertex2.getExtProperty("devType"))
        return false;
    var lines1 = vertex1.getLines();
    var lines2 = vertex2.getLines();
    if (lines1.length !== lines2.length)
        return false;

    var adjObjects1 = [];
    var adjObjects2 = [];

    var line;
    for (line of lines1) {
        adjObjects1.push(line.getOtherRelationObj(vertex1));
    }
    for (line of lines2) {
        adjObjects2.push(line.getOtherRelationObj(vertex2));
    }

    var idOfObjs1 = adjObjects1.map(item => item.getId()).sort();
    var idOfObjs2 = adjObjects2.map(item => item.getId()).sort();

    var len = adjObjects1.length;
    for (var i = 0; i < len; ++i) {
        if (idOfObjs1[i] !== idOfObjs2[i])
            return false;
    }
    return true;

}

function aggregate(items, combineType, combineContent) {
    var identical_items = [];
    var item;
    for (item of items) {
        if (item.getExtProperty("devType") === combineType)
            identical_items.push(item);
    }

    var similarGroups = [];
    var group;
    var isJoin = false;
    for (item of identical_items) {
        for (group of similarGroups) {
            if (isSimilarVertex(item, group[0])) {
                group.push(item);
                isJoin = true;
            }
        }
        if (isJoin === false)
            similarGroups.push([item]);
        else
            isJoin = false;
    }

    var res = [];
    var strArr = [];
    for (group of similarGroups) {
        for (item of group) {
            strArr.push(item.getExtProperty(combineContent));
        }
        res.push(group[0].clone().setExtProperties(combineContent, strArr.join(',')));
        strArr = [];
    }

    return res;

}