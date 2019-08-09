function ActionRecorder(canvas) {
    var canvas = canvas;
    var actionPintterBuffer = [];
    this.performDoCancel = function (index) {
        var r = actionPintterBuffer[index];
        r.cancel()
    };
    this.recordAction = function (record, index) {
    }
};

function ShapeEntity(id, name, x, y, width, height) {
    Shape.call(this, id, name);
    var me = this;
    var superPaint = me.paint;
    var lines = [];
    this.getType = function () {
        return "entity"
    };
    this.isEntity = function () {
        return true
    };
    this.addLine = function (line) {
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == line || lines[i].getId() == line.getId()) {
                return
            }
        }
        lines[lines.length] = line
    };
    this.deleteLine = function (line) {
        var rs = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i] == line || lines[i].getId() == line.getId()) {
                continue
            }
            rs.push(lines[i])
        }
        lines = rs
    };
    this.getLines = function () {
        return lines
    };
    this.getEntitySin = function () {
        var h = me.getHeight();
        var w = me.getWidth();
        return h / Math.sqrt(h * h + w * w)
    };
    this.paint = function (ctx) {
        return superPaint(ctx)
    };
    this.reLocationLines = function () {
        if (!lines) {
            return
        }
        for (var i = 0; i < lines.length; i++) {
            lines[i].relocationFrom();
            lines[i].relocationTo()
        }
    };
    this.bounds = function () {
        var b = {};
        b.x = me.getX();
        b.y = me.getY();
        b.width = me.getWidth();
        b.height = me.getHeight();
        b.cx = b.x + b.width / 2;
        b.cy = b.y + b.height / 2;
        return b
    };
    if (x) {
        me.setX(autoParseNumber(x))
    }
    if (y) {
        me.setY(autoParseNumber(y))
    }
    if (width) {
        me.setWidth(autoParseNumber(width, 32))
    }
    if (height) {
        me.setHeight(autoParseNumber(height, 32))
    }
};

function Shape(idInf, nameInf) {
    var me = this;
    var id = idInf;
    var name = nameInf;
    var x = 100, x2;
    var y = 100, y2;
    var width = 32;
    var height = 32;
    var oftX = 0;
    var oftY = 0;
    var selectedFlag = false;
    var labelFont = "Arial";
    var labelFontSize = "15px";
    var labelFontColor = "black";
    var shadowColor = "black";
    var shadowBlur = -1;
    var mapLevel = 1;
    var canvas;
    var ks;
    me.restoreMap = {};
    var isDeleted = false;
    this.deleted = function (o) {
        if (undefined == o) {
            return isDeleted = o
        }
        isDeleted = o
    };
    this.restore = function () {
        console.log("restore:", me.restoreMap);
        if (me.restoreMap.shadowBlur) {
            me.setShadowBlur(me.restoreMap.shadowBlur)
        }
        if (me.restoreMap.labelFont) {
            me.setLabelFont(me.restoreMap.labelFont)
        }
        if (me.restoreMap.shadowColor) {
            me.setShadowColor(me.restoreMap.shadowColor)
        }
        if (me.restoreMap.labelFontSize) {
            me.setLabelFontSize(me.restoreMap.labelFontSize)
        }
        if (me.restoreMap.labelFontColor) {
            me.setLabelFontColor(me.restoreMap.labelFontColor)
        }
        if (me.restoreMap.lineWidth) {
            me.setLineWidth(me.restoreMap.lineWidth)
        }
        if (me.restoreMap.lineColor) {
            me.setLineColor(me.restoreMap.lineColor)
        }
    };
    this.mapLevel = function (level) {
        if (level == undefined) {
            return mapLevel
        }
        mapLevel = autoParseNumber(level, 1)
    };
    this.canShow = function () {
        var s = ks.mapScale();
        switch (mapLevel) {
            case 1:
                return true;
            case 2:
                return s > 0.5;
            case 3:
                return s > 1.3;
            case 4:
                return s > 2
        }
        return true
    };
    this.setCanvas = function (cv) {
        canvas = cv
    };
    this.setKCanvas = function (_ks) {
        ks = _ks
    };
    this.getKCanvas = function () {
        return ks
    };
    var parentGroup;
    this.inGroup = function (group) {
        parentGroup = group
    };
    this.getParentGroup = function () {
        return parentGroup
    };
    this.isInGroup = function (group) {
        if (group == undefined) {
            return parentGroup != null && ks.getItem(parentGroup.getId()) != null
        }
        if (group != null && ks.getItem(group.getId()) != null) {
            var mems = group.getMembers();
            if (mems) {
                for (var i = 0; i < mems.length; i++) {
                    if (mems[i].getId() == me.getId()) {
                        var b1 = group.bounds(), b2 = me.bounds();
                        if (boundsInclude(b1, b2)) {
                            return true
                        } else {
                            group.removeMember(me);
                            return false
                        }
                    }
                }
            }
        }
        return false
    };
    var extProperties = [];
    this.getExtProperties = function () {
        return extProperties
    };
    this.getExtProperty = function (propertyName) {
        for (var i = 0;
             i < extProperties.length; i++) {
            if (extProperties[i].name == propertyName) {
                return extProperties[i].value
            }
        }
        return null
    };
    this.setExtProperties = function (atts) {
        if (atts) {
            extProperties = atts
        }
    };
    this.addExtProperties = function (att) {
        for (var i = 0; i < extProperties.length; i++) {
            if (extProperties[i].name == att.name) {
                extProperties[i].value = att.value;
                return
            }
        }
        var newAtt = {};
        newAtt.name = att.name;
        newAtt.value = att.value;
        extProperties[extProperties.length] = newAtt
    };
    this.getType = function () {
        return "shape"
    };
    this.isEntity = function () {
        return false
    };
    this.getId = function () {
        return id
    };
    this.getName = function () {
        return name
    };
    this.setName = function (str) {
        name = str
    };
    this.getX = function () {
        return x
    };
    this.getY = function () {
        return y
    };
    this.getOftX = function () {
        return oftX
    };
    this.getCenterX = function () {
        return x + me.getWidth() / (me.getKCanvas().mapScale() * 2)
    };
    this.getCenterY = function () {
        return y + me.getHeight() / (me.getKCanvas().mapScale() * 2)
    };
    this.getCenterPoint = function () {
        var p = {};
        p.x = me.getCenterX();
        p.y = me.getCenterY();
        return p
    };
    this.getOftY = function () {
        return oftY
    };
    this.getWidth = function () {
        return width
    };
    this.getHeight = function () {
        return height
    };
    this.moveOft = function (ln) {
        me.setX(x + ln.x);
        me.setY(y + ln.y)
    };
    this.setX = function (x1) {
        x = autoParseNumber(x1, 0);
        if (me.reLocationLines) {
            me.reLocationLines()
        }
    };
    this.setY = function (y1) {
        y = autoParseNumber(y1, 0);
        if (me.reLocationLines) {
            me.reLocationLines()
        }
    };
    this.setWidth = function (w) {
        width = Math.abs(autoParseNumber(w, 32));
        width = Math.min(canvas && canvas.width ? canvas.width : 1000, width);
        if (me.reLocationLines) {
            me.reLocationLines()
        }
    };
    this.setHeight = function (h) {
        height = Math.abs(autoParseNumber(h, 32));
        height = Math.min(canvas && canvas.height ? canvas.height : 1000, height);
        if (me.reLocationLines) {
            me.reLocationLines()
        }
    };
    this.setLabelFont = function (_labelFont, enableRestore) {
        if (enableRestore) {
            me.restoreMap.labelFont = me.getLabelFont()
        }
        labelFont = _labelFont
    };
    this.getLabelFont = function () {
        return labelFont
    };
    this.setLabelFontSize = function (_labelFontSize, enableRestore) {
        if (enableRestore) {
            me.restoreMap.labelFontSize = me.getLabelFontSize()
        }
        if (!_labelFontSize) {
            labelFontSize = "12px";
            return
        }
        var s = _labelFontSize.toLowerCase();
        labelFontSize = s.indexOf("px") > 0 ? s : s + "px";
        labelFontSize = translateFontSize(labelFontSize) + "px"
    };
    this.getLabelFontSize = function () {
        return labelFontSize
    };
    this.setLabelFontColor = function (_labelFontColor, enableRestore) {
        if (enableRestore) {
            me.restoreMap.labelFontColor = me.getLabelFontColor()
        }
        labelFontColor = _labelFontColor
    };
    this.getLabelFontColor = function () {
        return labelFontColor ? labelFontColor : "black"
    };
    this.setShadowBlur = function (level, enableRestore) {
        if (enableRestore) {
            me.restoreMap.shadowBlur = me.getShadowBlur()
        }
        shadowBlur = autoParseNumber(level, -1)
    };
    this.getShadowBlur = function () {
        return shadowBlur
    };
    this.setShadowColor = function (scolor, enableRestore) {
        if (enableRestore) {
            me.restoreMap.shadowColor = me.getShadowColor()
        }
        shadowColor = scolor
    };
    this.getShadowColor = function () {
        return shadowColor
    };
    this.canMoving = function () {
        return true
    };
    this.isIn = function (px, py) {
        oftX = px - x;
        oftY = py - y;
        var sc = me.getKCanvas().mapScale();
        var rs = oftX > 0 && oftX < me.getWidth() / sc && oftY > 0 && oftY < me.getHeight() / sc;
        return rs
    };
    this.selected = function (o) {
        selectedFlag = o
    };
    this.isSelected = function () {
        return selectedFlag
    };
    this.paint = function (ctx) {
        if (me.canShow() == false) {
            return false
        }
        if (me.getShadowBlur() && me.getShadowColor()) {
            ctx.shadowBlur = me.getShadowBlur();
            ctx.shadowColor = me.getShadowColor()
        }
        if (selectedFlag) {
            me.paintSelected(ctx)
        }
        return true
    };
    this.paintSelected = function (ctx) {
        ctx.shadowBlur = "20";
        ctx.shadowColor = "blue"
    };
    this.getNamePaintLocation = function () {
        return {}
    };
    var editor = null;
    this.getEditor = function (canvas) {
        if (editor == null) {
            editor = new EntityEditor(canvas, null, me)
        }
        return editor
    };
    var getScaleFontSize = function () {
        var v = translateFontSize(labelFontSize);
        var sc = ks ? ks.mapScale() : 1;
        return (v / sc).toFixed(0) + "px"
    };
    this.paintLabelStyle = function (ctx) {
        if (me.getLabelFontColor()) {
            ctx.fillStyle = me.getLabelFontColor()
        }
        ctx.font = "normal normal 100 " + getScaleFontSize() + " " + me.getLabelFont()
    };
    this.toString = function () {
        return '{id:"' + id + '",type:"' + me.getType() + '",name:"' + name + '",x:' + me.getX() + ",y:" + me.getY() + ",width:" + me.getWidth() + ",height:" + me.getHeight() + (x2 ? (",x2:" + x2) : "") + (y2 ? (",y2:" + y2) : "") + ',shadowColor:"' + shadowColor + '",shadowBlur:' + shadowBlur + "}"
    };
    var getOldStyle = function (ctx) {
        return ctx.strokeStyle ? ctx.strokeStyle : null
    }
};

function Line(id, name, x1, y1, _x2, _y2, lineWidthValue, _lineColor) {
    Shape.call(this, id, name);
    var me = this;
    var superPaint = me.paint;
    var superSety = me.setY;
    var lineWidth = autoParseNumber(lineWidthValue, 1);
    var x2 = autoParseNumber(_x2, 0);
    var y2 = autoParseNumber(_y2, 0);
    var lineColor = _lineColor ? _lineColor : "black";
    var nameColor = "black";
    var fromObj;
    var toObj;
    var fromComment = "";
    var toComment = "";
    var isShowArrow = false;
    var lineOrder = 1;
    var maxLevel = 1;
    me.setX(x1);
    me.setY(y1);
    var isShowInterface = false;
    this.showInterface = function (o) {
        if (o === undefined) {
            return isShowInterface
        }
        isShowInterface = o
    };
    var interfaceStatusFrom = "on";
    this.setFromInterfaceStatus = function (status) {
        interfaceStatusFrom = status
    };
    this.getFromInterfaceStatus = function () {
        return interfaceStatusFrom
    };
    var interfaceStatusTo = "on";
    this.setToInterfaceStatus = function (status) {
        interfaceStatusTo = status
    };
    this.getToInterfaceStatus = function () {
        return interfaceStatusTo
    };
    var interfaceStatusColor = [];
    interfaceStatusColor["on"] = "green";
    interfaceStatusColor["off"] = "red";
    interfaceStatusColor["warning"] = "orange";
    this.setInterfaceStatusColor = function (status, color) {
        interfaceStatusColor[status] = color
    };
    var getInterfaceStatusColor = function (status) {
        var color = interfaceStatusColor[status];
        if (color) {
            return color
        }
        return "orange"
    };
    this.canShow = function () {
        if (fromObj && toObj) {
            return fromObj.canShow() && toObj.canShow()
        }
        return false
    };
    this.getType = function () {
        return "line"
    };
    this.setX2 = function (x) {
        x2 = autoParseNumber(x, 0)
    };
    this.setY2 = function (y) {
        y2 = autoParseNumber(y, 0)
    };
    this.setY = function (y1) {
        superSety(y1)
    };
    this.isShowArrow = function () {
        return isShowArrow
    };
    this.showArrow = function (o) {
        isShowArrow = (o === 1 || o === true || o === "1" || o === "true")
    };
    this.moveOft = function (ln) {
        me.setX(me.getX() + ln.x);
        me.setX2(me.getX2() + ln.x);
        me.setY(me.getY() + ln.y);
        me.setY2(me.getY2() + ln.y)
    };
    this.getX2 = function () {
        return x2
    };
    this.getY2 = function () {
        return y2
    };
    this.setLineWidth = function (lw, enableRestore) {
        if (enableRestore) {
            me.restoreMap.lineWidth = me.getLineWidth()
        }
        lineWidth = autoParseNumber(lw, 1)
    };
    this.getLineWidth = function () {
        return lineWidth
    };
    this.setLineColor = function (_lineColor, enableRestore) {
        if (enableRestore) {
            me.restoreMap.lineColor = me.getLineColor()
        }
        lineColor = _lineColor
    };
    this.getLineColor = function () {
        return lineColor
    };
    this.setNameColor = function (c) {
        nameColor = c
    };
    this.getNameColor = function () {
        return nameColor
    };
    this.setFromComment = function (comment) {
        fromComment = comment
    };
    this.getFromComment = function () {
        return fromComment
    };
    this.setToComment = function (comment) {
        toComment = comment
    };
    this.getToComment = function () {
        return toComment
    };
    var getLineLocation = function (obj1, obj2, nodeType) {
        var p = {}, objType = obj1.getType();
        if ("group" == objType || "text" == objType || "polygon" == objType) {
            var cp = obj2.getCenterPoint();
            var bs = obj1.bounds();
            var a = cp.x < bs.x, b = cp.y < bs.y, A = (!a) && cp.x <= (bs.x + bs.width),
                B = (!b) && cp.y <= (bs.y + bs.height);
            if (a & b) {
                p.x = bs.x;
                p.y = bs.y
            } else {
                if (a & B) {
                    p.x = bs.x;
                    p.y = cp.y
                } else {
                    if (a && (!B)) {
                        p.x = bs.x;
                        p.y = bs.y + bs.height
                    } else {
                        if (A && b) {
                            p.y = bs.y;
                            p.x = cp.x
                        } else {
                            if (A && (!B)) {
                                p.y = bs.y + bs.height;
                                p.x = cp.x
                            } else {
                                if ((!A) && b) {
                                    p.x = bs.x + bs.width;
                                    p.y = bs.y
                                } else {
                                    if ((!A) && B) {
                                        p.x = bs.x + bs.width;
                                        p.y = cp.y
                                    } else {
                                        if ((!A) && (!B)) {
                                            p.x = bs.x + bs.width;
                                            p.y = bs.y + bs.height
                                        } else {
                                            p.x = cp.x;
                                            p.y = cp.y
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            var oft = getRelocationOft();
            if ("from" == nodeType) {
                p.x = oft.fromX - oft.x / oft.h;
                p.y = oft.fromY - oft.y / oft.h
            } else {
                if ("to" == nodeType) {
                    p.x = oft.toX + oft.x / oft.h;
                    p.y = oft.toY + oft.y / oft.h
                }
            }
        }
        return p
    };
    this.setFromObj = function (obj) {
        fromObj = obj
    };
    this.setToObj = function (obj) {
        toObj = obj
    };
    this.getOtherRelationObj = function (currentObj) {
        if (currentObj.getId() == fromObj.getId()) {
            return toObj
        } else {
            if (currentObj.getId() == toObj.getId()) {
                return fromObj
            } else {
                return null
            }
        }
    };
    this.getFromObj = function () {
        return fromObj
    };
    this.getToObj = function () {
        return toObj
    };
    this.getOrderId = function () {
        if (fromObj && toObj) {
            var fid = fromObj.getId();
            var tid = toObj.getId();
            if (fid > tid) {
                return fid + tid
            } else {
                return tid + fid
            }
        }
        return uuid()
    };
    this.getLineOrder = function () {
        return lineOrder
    };
    this.setLineOrder = function (order) {
        lineOrder = order
    };
    this.setMaxLineOrder = function (max) {
        maxLevel = max
    };
    this.getMaxLineOrder = function () {
        return maxLevel
    };
    var tp = null;
    this.titleLocation = function (titX, titY) {
        if (titX && titY) {
            tp = {};
            tp.x = titX;
            tp.y = titY
        } else {
            if (titX == undefined && titY == undefined) {
                return tp
            } else {
                throw new Error("x,y must be not null or null at same time!")
            }
        }
    };
    this.moveOft = function (ln) {
        console.log("top location", tp);
        console.log("drag location", ln);
        tp.x = (tp.x + ln.x);
        tp.y = (tp.y + ln.y)
    };
    this.clone = function () {
        var rs = new Line(uuid(), me.getName(), me.getX(), me.getY(), me.getX2(), me.getY2(), me.getLineWidth(), me.getLineColor());
        rs.setFromComment(me.getFromComment());
        rs.setToComment(me.getToComment());
        rs.setShadowColor(me.getShadowColor());
        rs.setShadowBlur(me.getShadowBlur());
        return rs
    };
    var getArcCenterPointer = function (a, b) {
        var cen = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2};
        var tg = Math.atan((b.y - a.y) / (b.x - a.x));
        var piSize = 3;
        var OFT = 2 / (5 * piSize);
        var r = Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
        var t = me.getLineOrder() % 2 == 1 ? 1 : -1;
        var oftLen = (3 * lineWidth * (1 + me.getLineOrder() / 2)) / me.getKCanvas().mapScale();
        cen.x = cen.x + t * Math.sin(tg) * oftLen;
        cen.y = cen.y - t * Math.cos(tg) * oftLen;
        var lenX = b.x - a.x, lenY = b.y - b.y;
        return {
            x: cen.x - t * r * (Math.sin(tg)) * (1 - OFT),
            y: cen.y + t * r * (Math.cos(tg)) * (1 - OFT),
            spi: t * (Math.PI + (Math.PI * 1 / piSize)) + tg,
            epi: t * (Math.PI + (Math.PI * 2 / piSize)) + tg,
            r: r,
            ck: t < 0,
            ax: cen.x + t * Math.sin(tg) * (r / 8),
            ay: cen.y - t * Math.cos(tg) * (r / 8)
        }
    };
    this.paint = function (ctx) {
        if (superPaint(ctx) == false) {
            return false
        }
        var a = {x: me.getX(), y: me.getY()}, b = {x: me.getX2(), y: me.getY2()};
        var mx = a.x - b.x, my = a.y - b.y;
        var h = Math.sqrt(mx * mx + my * my);
        var center = null;
        if (me.isShowArrow()) {
            center = drawArrow(ctx, a, b, null, null, lineWidth, lineColor)
        } else {
            center = drawLine(ctx, a, b, lineWidth, lineColor);
            paintInterface(ctx, a, b)
        }
        var af = Math.atan(my / (mx + 0.0001));
        var level = me.getLineOrder();
        var tpl = me.titleLocation();
        var tx = tpl ? tpl.x : center.x;
        var ty = tpl ? tpl.y : center.y;
        var n = maxLevel / 2;
        me.paintLabelStyle(ctx);
        if (me.getName()) {
            ctx.fillStyle = nameColor;
            ctx.fillText("(" + me.getLineOrder() + ")" + me.getName(), tx, ty);
            if (!tpl) {
                me.titleLocation(tx, ty)
            }
        }
        h = Math.sqrt(h);
        h = Math.sqrt(h);
        h = h / 0.67;
        var oftH = h;
        var len = 15;
        if (me.getFromComment()) {
            var bs = canvasTextBounds("15px", me.getFromComment());
            tx = me.getX() - mx / oftH - bs.width / 2 + Math.cos(af) * len;
            ty = me.getY() - my / oftH;
            ty -= (len * (n - level) + 5);
            ctx.fillText("(" + me.getLineOrder() + ")" + me.getFromComment(), tx, ty)
        }
        if (me.getToComment()) {
            var bs = canvasTextBounds("15px", me.getToComment());
            tx = me.getX2() + mx / oftH - bs.width / 2 + Math.cos(af) * len;
            ty = me.getY2() + my / oftH;
            ty -= (len * (n - level) + 5);
            ctx.fillText("(" + me.getLineOrder() + ")" + me.getToComment(), tx, ty)
        }
        return true
    };
    var drawLine = function (ctx, a, b, width, color) {
        width = width ? width : 1;
        color = color ? color : "#000";
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width / me.getKCanvas().mapScale();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.restore();
        return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
    };
    var paintInterface = function (g, a, b) {
        if (isShowInterface == false) {
            return
        }
        var R = 5 / me.getKCanvas().mapScale();
        g.save();
        g.beginPath();
        g.fillStyle = getInterfaceStatusColor(me.getFromInterfaceStatus());
        g.arc(a.x, a.y, R, 0, 2 * Math.PI);
        g.fill();
        g.beginPath();
        g.fillStyle = getInterfaceStatusColor(me.getToInterfaceStatus());
        g.arc(b.x, b.y, R, 0, 2 * Math.PI);
        g.fill();
        g.stroke();
        g.restore()
    };
    var drawArrow = function (ctx, a, b, theta, headlen, width, color) {
        theta = theta ? theta : 30;
        headlen = headlen ? headlen : 10;
        width = width ? width : 1;
        color = color ? color : "#000";
        var angle = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI, angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180, topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1), botX = headlen * Math.cos(angle2), botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        var arrowX = a.x - topX, arrowY = a.y - topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        arrowX = b.x + topX;
        arrowY = b.y + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(b.x, b.y);
        arrowX = b.x + botX;
        arrowY = b.y + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
        return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
    };
    var getRelocationOft = function () {
        var rs = {};
        var pf = me.getFromObj().getCenterPoint();
        var pt = me.getToObj().getCenterPoint();
        rs.fromX = pf.x;
        rs.fromY = pf.y;
        rs.toX = pt.x;
        rs.toY = pt.y;
        var mx = pf.x - pt.x, my = pf.y - pt.y;
        var h = Math.sqrt(mx * mx + my * my);
        h = Math.sqrt(h);
        h = Math.sqrt(h);
        h = h / 0.33;
        rs.x = mx;
        rs.y = my;
        rs.h = h;
        return rs
    };
    this.relocationFrom = function () {
        var p = getLineLocation(fromObj, toObj, "from");
        me.setX(p.x);
        me.setY(p.y);
        var cp = me.getCenterPoint();
        me.titleLocation(cp.x, cp.y)
    };
    this.relocationTo = function () {
        var p = getLineLocation(toObj, fromObj, "to");
        me.setX2(p.x);
        me.setY2(p.y);
        var cp = me.getCenterPoint();
        me.titleLocation(cp.x, cp.y)
    };
    this.getCenterPoint = function () {
        var b = me.bounds();
        return {x: b.x + b.width / 2, y: b.y + b.height / 2}
    };
    this.bounds = function () {
        var b = {};
        b.x = Math.min(me.getX(), me.getX2());
        b.y = Math.min(me.getY(), me.getY2());
        b.width = Math.abs(me.getX() - me.getX2());
        b.height = Math.abs(me.getY() - me.getY2());
        return b
    };
    this.getNamePaintLocation = function () {
        var rs = {};
        rs.x = me.getX();
        rs.y = superGetY();
        rs.w = me.getWidth();
        rs.h = me.getHeight();
        rs.y = rs.y - rs.h / 2;
        rs.x = rs.x + 10;
        return rs
    };
    this.getEditValue = function () {
        return me.getContent()
    };
    this.isIn = function (px, py) {
        var oft = 13 / me.getKCanvas().mapScale();
        var a = {x: me.getX(), y: me.getY()}, b = {x: me.getX2(), y: me.getY2()};
        var isInForSingleLine = function (oft) {
            if ((px - oft) > Math.max(a.x, b.x) || (px + oft) < Math.min(a.x, b.x) || (py - oft) > Math.max(a.y, b.y) || (py + oft) < Math.min(a.y, b.y)) {
                return false
            }
            var X1 = (a.x - px), Y1 = (a.y - py);
            if (Math.abs(X1) < oft && Math.abs(Y1) < oft) {
                return false
            }
            var X2 = (a.x - b.x), Y2 = (a.y - b.y);
            if (Math.abs(X2) < oft && Math.abs(Y2) < oft) {
                return false
            }
            var tv = 0.5;
            X1 = X1 == 0 ? tv : X1;
            Y1 = Y1 == 0 ? tv : Y1;
            var asin1 = Math.asin(X1 / Math.sqrt(X1 * X1 + Y1 * Y1));
            var asin2 = Math.asin(X2 / Math.sqrt(X2 * X2 + Y2 * Y2));
            var sin = Math.sin((asin1 - asin2));
            var h = (sin * Math.sqrt(X1 * X1 + Y1 * Y1));
            return h < oft && h > (-1 * oft)
        };
        if (me.getLineOrder() == 1) {
            return isInForSingleLine(oft)
        } else {
            var c = getArcCenterPointer(a, b), maxX = Math.max(Math.max(a.x, b.x), c.ax),
                maxY = Math.max(Math.max(a.y, b.y), c.ay), minX = Math.min(Math.min(a.x, b.x), c.ax),
                minY = Math.min(Math.min(a.y, b.y), c.ay);
            if ((px - oft) > maxX || (px + oft) < minX || (py - oft) > maxY || (py + oft) < minY) {
                return false
            }
            var r = Math.sqrt((px - c.x) * (px - c.x) + (py - c.y) * (py - c.y));
            return (Math.abs(r - c.r) < oft)
        }
    };
    this.canMoving = function () {
        return true
    };
    var editor = null;
    this.getEditor = function (canvas) {
        if (editor == null) {
            editor = new LineEditor(canvas, null, me)
        }
        return editor
    };
    this.toString = function () {
        return '{id:"' + me.getId() + '",type:"' + me.getType() + '",name:"' + me.getName() + '",x1:' + me.getX() + ",y1:" + me.getY() + ",x2:" + me.getX2() + ",y2:" + me.getY2() + ',color:"' + lineColor + '",lineWidth:' + lineWidth + ((fromObj && toObj) ? (',fromObj:"' + fromObj.getId() + '",toObj:"' + toObj.getId() + '"') : "") + ',fromComment:"' + fromComment + '",toComment:"' + toComment + '",isShowArrow:' + isShowArrow + ',shadowColor:"' + me.getShadowColor() + '",shadowBlur:' + me.getShadowBlur() + "}"
    }
};

function TipComment(_canvas) {
    var entity;
    var mouseLocation;
    var canvas = _canvas;
    var me = this;
    var isShow = false;
    var VIEW_LABEL_FONT_SIZE = 12;
    var VIEW_BOUNT_FONT_SIZE = 13.5;
    this.show = function (o) {
        isShow = o;
        canvas.repaint()
    };
    this.setEntity = function (en) {
        entity = en
    };
    this.getEntity = function () {
        return entity
    };
    this.setMouseLocation = function (ln) {
        mouseLocation = ln
    };
    this.paint = function (ctx) {
        if (entity == null || isShow == false) {
            return
        }
        var entityId = entity.getId && entity.getId() ? entity.getId() : "[N/A]";
        var data = canvas.getEntityTipComment ? canvas.getEntityTipComment(entity) : {
            data: [{
                name: "id",
                value: entityId
            }, {name: "name", value: entity.getName()}], bounds: entity.bounds()
        };
        if (data && data.data) {
            var b = null;
            var arr = data.data;
            var ln = data.bounds;
            var w = 0;
            var sc = canvas.mapScale();
            for (var i = 0; i < arr.length; i++) {
                var s = arr[i].name + " " + arr[i].value;
                b = canvasTextBounds((VIEW_BOUNT_FONT_SIZE / sc) + "px", s);
                w = Math.max(w, b.width)
            }
            paintTip(ctx, getBeginLocation(ln, w), arr, w, b.height)
        }
    };
    var getBeginLocation = function (ln, maxWidth) {
        switch (entity.getType()) {
            case"image":
                return ln;
            case"line":
                ln.x = mouseLocation.x;
                ln.y = mouseLocation.y;
                ln.width = 5;
                return ln;
            case"text":
                ln.y = (mouseLocation.y - ln.y) > ln.height / 2 ? mouseLocation.y + (ln.height / 2) + 10 : ln.y - 15;
                ln.x = mouseLocation.x;
                ln.width = 0;
                ln.height = 0;
                return ln;
            case"group":
                ln.x = mouseLocation.x;
                ln.y = mouseLocation.y;
                ln.width = 0;
                ln.height = 0;
                return ln
        }
        return ln
    };
    var paintTip = function (ctx, beginLocation, arr, rowWidth, rowHeight) {
        var ln = beginLocation;
        var sc = canvas.mapScale();
        var px = ln.x + ln.width / sc, py = ln.y - (rowHeight + 1) * sc, fs = VIEW_LABEL_FONT_SIZE / sc;
        ctx.save();
        ctx.font = fs + "px HeiTi";
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = "black";
        ctx.fillRect(px - 3 / sc, py - rowHeight, (rowWidth + 6 / sc), (rowHeight * arr.length + 6 / sc));
        ctx.globalAlpha = 0.9;
        for (var i = 0; i < arr.length; i++) {
            var s = arr[i].name + " " + arr[i].value;
            ctx.fillText(s, px, py + i * rowHeight)
        }
        ctx.restore()
    }
};

function Canvas(_canvas, bounds) {
    this.version = function () {
        return "KCanvas_4.1.4"
    };
    var canvas = _canvas;
    var editor;
    var enableEditor = false;
    var enableMoving = true;
    var isReadonly = false;
    var isShowEntityTip = true;
    var libraries;
    var me = this;
    var name;
    var tip = new TipComment(me);
    var thum;
    var size = {};
    var setBounds = function (bounds) {
        canvas.x = bounds ? bounds.x : 0;
        canvas.y = bounds ? bounds.y : 0;
        canvas.width = bounds ? bounds.width : 1000;
        canvas.height = bounds ? bounds.height : 1000;
        size.w = canvas.width;
        size.h = canvas.height;
        if (thum) {
            var b = {};
            b.w = canvas.width / 10;
            b.h = canvas.height / 10;
            b.x = 0;
            b.y = 0;
            thum.size({width: b.w, height: b.h});
            thum.position({x: b.x, y: b.y})
        }
    };
    if (bounds) {
        setBounds(bounds)
    }
    var scale = 1;
    var ctx = canvas.getContext("2d");
    var items = [];
    var getCanvasItems = function () {
        return items
    };
    this.getScale = function () {
        return scale
    };
    this.mapScale = function () {
        return scale
    };
    this.scale = function (s) {
        if (s == undefined) {
            return scale
        }
        var isScale = true;
        if (me.doChangingScale) {
            isScale = me.doChangingScale(scale)
        }
        if (isScale) {
            scale = scale * s;
            ctx.scale(s, s);
            if (me.doChangedScale) {
                me.doChangedScale(scale)
            }
        }
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].reLocationLines) {
                    items[i].reLocationLines()
                }
            }
        }
    };
    this.setScale = function (s) {
        if (!s) {
            scale = 1;
            return
        }
        scale = s
    };
    this.zoomIn = function () {
        me.scale(1.33)
    };
    this.zoomOut = function () {
        me.scale(0.67)
    };
    this.zoomTo = function (s) {
        me.scale(s / me.scale())
    };
    var flickTime = 1000;
    var flickStatus = true;
    this.bounds = function () {
        var b = {};
        b.width = canvas.width;
        b.height = canvas.height;
        b.x = 0;
        b.y = 0;
        return b
    };
    this.ready = function (conf) {
        flickTime = conf.flickTime ? conf.flickTime : flickTime;
        flickStatus = conf.flickStatus ? conf.flickStatus : flickStatus;
        name = conf.name ? conf.name : uuid();
        if (flickStatus) {
            initFlicker()
        }
        if (conf.backgroundColor) {
            canvas.style.backgroundColor = conf.backgroundColor
        }
        if (conf.bounds) {
            setBounds(conf.bounds)
        }
        if (conf.doMovedEntity) {
            me.doMovedEntity = conf.doMovedEntity
        }
        if (conf.doStartMovingEntity) {
            me.doStartMovingEntity = conf.doStartMovingEntity
        }
        if (conf.doAddedNewEntity) {
            me.doAddedNewEntity = conf.doAddedNewEntity
        }
        if (conf.doAddingNewEntity) {
            me.doAddingNewEntity = conf.doAddingNewEntity
        }
        if (conf.doLinking) {
            me.doLinking = conf.doLinking
        }
        if (conf.doLinked) {
            me.doLinked = conf.doLinked
        }
        if (conf.doDropingEntity) {
            me.doDropingEntity = conf.doDropingEntity
        }
        if (conf.doDropedEntity) {
            me.doDropedEntity = conf.doDropedEntity
        }
        if (conf.doSelectEntity) {
            me.doSelectEntity = conf.doSelectEntity
        }
        if (conf.doUnSelectEntity) {
            me.doUnSelectEntity = conf.doUnSelectEntity
        }
        if (conf.doDeletingObject) {
            me.doDeletingObject = conf.doDeletingObject
        }
        if (conf.doDeletedObject) {
            me.doDeletedObject = conf.doDeletedObject
        }
        if (conf.doShowEntityEditor) {
            me.doShowEntityEditor = conf.doShowEntityEditor
        }
        if (conf.doAddingText) {
            me.doAddingText = conf.doAddingText
        }
        if (conf.doAddedText) {
            me.doAddedText = conf.doAddedText
        }
        if (conf.doAddingGroup) {
            me.doAddingGroup = conf.doAddingGroup
        }
        if (conf.doAddedGroup) {
            me.doAddedGroup = conf.doAddedGroup
        }
        if (conf.getImageSrcPath) {
            me.getImageSrcPath = conf.getImageSrcPath
        }
        if (conf.getEntityTipComment) {
            me.getEntityTipComment = conf.getEntityTipComment
        }
        if (conf.doTranslating) {
            me.doTranslating = conf.doTranslating
        }
        if (conf.doTranslated) {
            me.doTranslated = conf.doTranslated
        }
        if (conf.doResizedEntity) {
            me.doResizedEntity = conf.doResizedEntity
        }
        if (conf.restoreActionStatus) {
            me.restoreActionStatus = conf.restoreActionStatus
        }
        if (conf.init) {
            conf.init()
        }
    };
    var imgTemplate;
    this.getTemplateImageNode = function () {
        if (imgTemplate) {
            return imgTemplate
        } else {
            imgTemplate = document.getElementById("canvasTemplateImage")
        }
        return imgTemplate
    };
    this.setLibraries = function (libs) {
        libraries = libs
    };
    this.putLibraries = function (libs) {
        if (libraries == null) {
            libraries = libs
        } else {
            if (libraries.imgs) {
                if (libs.imgs) {
                    var isSameType = function (p, typeName) {
                        return p.name == typeName
                    };
                    for (var i = 0; i < libs.imgs.length; i++) {
                        var existName = false;
                        var inx = -1;
                        for (var j = 0; j < libraries.imgs.length; j++) {
                            if (isSameType(libraries.imgs[j], libs.imgs[i].name)) {
                                existName = true;
                                inx = j;
                                break
                            }
                        }
                        if (existName) {
                            libraries.imgs[inx] = libs.imgs[i]
                        } else {
                            libraries.imgs.push(libs.imgs[i])
                        }
                    }
                }
            } else {
                libraries.imgs = libs.imgs
            }
        }
    };
    this.getLibraries = function () {
        return libraries
    };
    this.isShowEditor = function () {
        return enableEditor
    };
    this.readonly = function (o) {
        if (o == undefined) {
            return isReadonly
        }
        isReadonly = o;
        if (isReadonly) {
            graphAction = null;
            setMouseStyle(false);
            me.unSelectItems()
        }
    };
    this.showEntityTip = function (o) {
        if (o == undefined) {
            return isShowEntityTip
        }
        isShowEntityTip = o
    };
    this.canMoving = function (o) {
        if (o == undefined) {
            return enableMoving
        }
        enableMoving = o
    };
    this.enableShowEditor = function (o) {
        enableEditor = false
    };
    this.setEntityEditor = function (_editor) {
        editor = _editor;
        editor.addEventListener("keydown", function (e) {
            editorAction(e)
        }, true)
    };
    this.springLayout = function (w, h) {
        var layout = new SpringLayout(w, h, 100, 100, me.mapScale());
        var include = function (opts, opt) {
            if (opt) {
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].getId() == opt.getId()) {
                        return opt
                    }
                }
            }
            return null
        };
        var getCellRelation = function (allCells, c) {
            var ls = c.getLines();
            if (ls == null || ls.length == 0) {
                return null
            }
            var rs = [];
            for (var i = 0; i < ls.length; i++) {
                var rc = include(allCells, ls[i].getOtherRelationObj(c));
                if (!rc || rc.canShow() == false) {
                    continue
                }
                rs[rs.length] = rc
            }
            return rs
        };
        var allItems = me.getSelectedItems();
        if ((allItems && allItems.length > 0) == false) {
            allItems = me.getItems()
        }
        var allCells = [];
        for (var i = 0; i < allItems.length; i++) {
            var c = allItems[i];
            if (c.getType() == "image") {
                allCells[allCells.length] = c
            }
        }
        for (var i = 0; i < allCells.length; i++) {
            var c = allCells[i];
            var relations = getCellRelation(allCells, c);
            layout.layout(c, relations, allCells)
        }
    };
    var animation;
    var animationStatus = "stop";
    this.stopAnimation = function () {
        animation = null;
        animationStatus = "stop"
    };
    this.canvasAnimationStatus = function (s) {
        if (s == undefined) {
            return animationStatus
        }
        return animationStatus
    };
    this.setAnimation = function (_animation, rate) {
        if (animationStatus != "stop") {
            throw new Exception("current animation is not stop! Please call stopAnimation() first!")
        }
        animation = _animation;
        animation.setCanvas(me);
        var animationRepaint = function () {
            if (animation && animation.bounds) {
                me.repaint(animation.bounds())
            } else {
                me.repaint()
            }
        };
        var _doAnimation = function () {
            if (animation == null || animationStatus == "stop" || animation.timeout && animation.timeout()) {
                animationRepaint();
                me.stopAnimation();
                return
            }
            animation.run();
            animationRepaint();
            animation.paint(ctx);
            window.setTimeout(function () {
                _doAnimation()
            }, rate)
        };
        animationStatus = "start";
        _doAnimation()
    };
    this.getEntityEditor = function () {
        return editor
    };
    this.getBounds = function () {
        var b = {};
        b.x = canvas.x;
        b.y = canvas.y;
        b.width = canvas.width;
        b.height = canvas.height;
        return b
    };
    this.getName = function () {
        return name
    };
    var graphAction;
    this.getMouseAction = function () {
        return graphAction
    };
    var setMouseAction = function (act) {
        graphAction = act;
        setMouseStyle(act)
    };
    var setMouseStyle = function (o) {
        if (o == false || me.readonly() || o == null) {
            canvas.style.cursor = "default";
            return
        }
        switch (graphAction) {
            case"link":
                canvas.style.cursor = "crosshair";
                return;
            case"text":
                canvas.style.cursor = "text";
                return;
            case"translation":
                canvas.style.cursor = "pointer";
                return;
            case"group":
                canvas.style.cursor = "all-scroll";
                return;
            case"n-resize":
                canvas.style.cursor = "n-resize";
                return;
            case"e-resize":
                canvas.style.cursor = "e-resize";
                return;
            case"s-resize":
                canvas.style.cursor = "s-resize";
                return;
            case"w-resize":
                canvas.style.cursor = "w-resize";
                return;
            case"ne-resize":
                canvas.style.cursor = "ne-resize";
                return;
            case"se-resize":
                canvas.style.cursor = "se-resize";
                return;
            case"nw-resize":
                canvas.style.cursor = "nw-resize";
                return;
            case"sw-resize":
                canvas.style.cursor = "sw-resize";
                return
        }
    };
    this.readyPointer = function () {
        graphAction = null;
        setMouseStyle(false)
    };
    this.readyLink = function (o) {
        setMouseAction(o ? "link" : null);
        linkSrcObj = null;
        linkDstObj = null
    };
    this.isReadyLink = function () {
        return graphAction == "link"
    };
    this.readyText = function (o) {
        setMouseAction(o ? "text" : null);
        linkSrcObj = null;
        linkDstObj = null
    };
    this.isReadyText = function () {
        return graphAction == "text"
    };
    this.readyResize = function (o) {
        if (o == undefined) {
            return graphAction == "se-resize"
        }
        if (o == "se") {
            setMouseAction(o + "-resize")
        } else {
            setMouseAction(null)
        }
    };
    this.readyTranslation = function (o) {
        if (o == undefined) {
            return graphAction == "translation"
        }
        setMouseAction(o ? "translation" : null)
    };
    this.setTranslationOft = function (tx, ty) {
        if (me.doTranslating) {
            if (me.doTranslating() == false) {
                return
            }
        }
        var items = me.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getType() == "line") {
                continue
            }
            item.setX(item.getX() + tx);
            item.setY(item.getY() + ty)
        }
        if (me.doTranslated) {
            me.doTranslated()
        }
    };
    this.readyGroup = function (o) {
        setMouseAction(o ? "group" : null);
        linkSrcObj = null;
        linkDstObj = null
    };
    this.isReadyGroup = function () {
        return graphAction == "group"
    };
    this.getItemByPoint = function (l) {
        for (var i = items.length - 1; i >= 0; i--) {
            var type = items[i].getType();
            if (type != "line" && type != "group" && items[i].canShow() && items[i].isIn(l.x, l.y)) {
                return items[i]
            }
        }
        for (var i = items.length - 1; i >= 0; i--) {
            if (items[i].getType() == "line" && items[i].canShow() && items[i].isIn(l.x, l.y)) {
                return items[i]
            }
        }
        var groups = me.getGroupEntities();
        for (var i = groups.length - 1; i >= 0; i--) {
            if (groups[i].isIn(l.x, l.y)) {
                return groups[i]
            }
        }
        return null
    };
    this.addItem = function (item) {
        if (me.doAddingNewEntity) {
            if (me.doAddingNewEntity(item) == false) {
                return null
            }
        }
        for (var i = 0; i < items.length; i++) {
            if (items[i].getId() == item.getId()) {
                return null
            }
        }
        item.setCanvas(canvas);
        item.setKCanvas(me);
        items[items.length] = item;
        if (me.doAddedNewEntity) {
            me.doAddedNewEntity(item)
        }
        me.resetLineOrder();
        return item
    };
    this.moveSelectItems = function (ev) {
        if (me.canMoving() == false) {
            return
        }
        var items = me.getSelectedItems();
        if ((!items) || items.length == 0) {
            return
        }
        var x = 0, y = 0;
        var oft = ev.ctrlKey ? 1 : 3;
        switch (ev.key) {
            case"ArrowDown":
                y = oft;
                break;
            case"ArrowUp":
                y = -1 * oft;
                break;
            case"ArrowLeft":
                x = -1 * oft;
                break;
            case"ArrowRight":
                x = oft;
                break
        }
        var ln = {};
        ln.x = x;
        ln.y = y;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getType() == "line") {
                continue
            }
            item.moveOft(ln)
        }
    };
    this.deleteItem = function (obj) {
        var ids = [];
        ids[ids.length] = obj.getId();
        if (obj.isEntity()) {
            var links = obj.getLines();
            if (links != null) {
                for (var i = 0; i < links.length; i++) {
                    ids[ids.length] = links[i].getId()
                }
            }
        } else {
            if (obj.getType() == "line") {
            }
        }
        var isInArray = function (arr, str) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == str) {
                    return true
                }
            }
            return false
        };
        var newItems = [];
        var cleanLineNodeRelation = function (line) {
            var fromObj = line.getFromObj();
            if (fromObj) {
                fromObj.deleteLine(line)
            }
            var toObj = line.getToObj();
            if (toObj) {
                toObj.deleteLine(line)
            }
        };
        for (var i = 0; i < items.length; i++) {
            if (isInArray(ids, items[i].getId())) {
                var objDeleted = items[i];
                if (me.doDeletingObject && (me.doDeletingObject(objDeleted) == false)) {
                    return
                }
                items[i] = null;
                if (me.doDeletedObject) {
                    me.doDeletedObject(objDeleted)
                }
                if (objDeleted.getType() == "line") {
                    cleanLineNodeRelation(objDeleted)
                }
                objDeleted.deleted(true);
                continue
            }
            newItems[newItems.length] = items[i]
        }
        items = newItems;
        me.resetLineOrder();
        me.repaint()
    };
    this.getEntity = function (id) {
        return me.getItem(id)
    };
    this.getItem = function (id) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].getId() == id) {
                return items[i]
            }
        }
        return null
    };
    this.resetLineOrder = function () {
        var map = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getType() == "line") {
                var orderId = item.getOrderId();
                var order = map[orderId] ? (map[orderId] + 1) : 1;
                map[orderId] = order;
                item.setLineOrder(map[item.getOrderId()])
            }
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.getType() == "line") {
                var orderId = item.getOrderId();
                var maxOrder = map[orderId];
                item.setMaxLineOrder(maxOrder)
            }
        }
    };
    this.getGroupEntities = function () {
        var rs = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].getType() == "group") {
                rs[rs.length] = items[i]
            }
        }
        for (var i = 0; i < rs.length - 1; i++) {
            for (var j = 0; j < rs.length - 1 - i; j++) {
                if (rs[j].subLevel() > rs[j + 1].subLevel()) {
                    var temp = rs[j];
                    rs[j] = rs[j + 1];
                    rs[j + 1] = temp
                }
            }
        }
        return rs
    };
    this.autoAttachEntityToGroup = function (entity) {
        if (entity == null || entity == undefined || entity.getType() == "line") {
            return
        }
        var groups = me.getGroupEntities();
        for (var i = groups.length - 1; i >= 0; i--) {
            if (groups[i].getId() == entity.getId()) {
                continue
            }
            var b1 = groups[i].bounds(), b2 = entity.bounds();
            if (boundsInclude(b1, b2)) {
                if (entity.isInGroup() == false) {
                } else {
                    var parentGroup = entity.getParentGroup();
                    parentGroup.removeMember(entity)
                }
                groups[i].addMember(entity);
                return
            } else {
                if (entity.isInGroup(groups[i])) {
                    me.autoAttachEntityToGroup(groups[i].removeMember(entity))
                }
            }
        }
    };
    this.getPathByNodes = function (nodeIds) {
        var ok = nodeIds && nodeIds.length > 1;
        if (ok == false) {
            return []
        }
        var node = me.getItem(nodeIds[0]);
        var lines = node.getLines();
        var paths = [];
        paths[paths.length] = node;
        for (var i = 0; i < nodeIds.length; i++) {
            var nid = nodeIds[i];
            node = me.getItem(nid);
            for (var j = 0; j < lines.length; j++) {
                var l = lines[j];
                if (l.getFromObj().getId() == nid || l.getToObj().getId() == nid) {
                    paths[paths.length] = l;
                    paths[paths.length] = node;
                    break
                }
            }
            lines = node.getLines()
        }
        return paths
    };
    this.getSelectedItems = function () {
        var arr = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].isSelected()) {
                arr[arr.length] = items[i]
            }
        }
        return arr
    };
    this.unSelectItems = function () {
        for (var i = 0; i < items.length; i++) {
            if (items[i].isSelected()) {
                items[i].selected(false);
                if (me.doUnSelectEntity) {
                    me.doUnSelectEntity(items[i])
                }
            }
        }
        me.repaint()
    };
    this.selectRelationItems = function (currentNodes) {
        if (!currentNodes || currentNodes.length == 0) {
            throw new Exception("No current nodes selected!")
        }
        var rs = [];
        for (var i = 0; i < currentNodes.length; i++) {
            var nd = currentNodes[i];
            var ls = nd.getLines();
            if (ls && ls.length > 0) {
                for (var j = 0; j < ls.length; j++) {
                    var otherObj = ls[j].getOtherRelationObj(nd);
                    if (notInclude(rs, otherObj)) {
                        rs[rs.length] = otherObj
                    }
                }
            }
        }
        if (rs.length > 0) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].isSelected() == false) {
                    selectEntity(rs[i], true)
                }
            }
            me.repaint()
        }
    };
    this.getItems = function () {
        return items
    };
    this.setFlickTime = function (millionTime) {
        flickTime = millionTime
    };
    this.paintToolBar = function () {
    };
    this.repaint = function (b) {
        ctx.shadowBlur = 0;
        me.paintBackground();
        me.paintGroups();
        me.paintLines();
        me.paintEntitys();
        me.paintToolBar();
        tip.paint(ctx)
    };
    this.paintBackground = function () {
        ctx.rect(canvas.x, canvas.y, canvas.width / me.scale(), canvas.height / me.scale());
        var bc = canvas.style.backgroundColor;
        ctx.fillStyle = bc ? bc : "#ffffff";
        ctx.fill()
    };
    this.paintGroups = function () {
        var groups = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].getType() == "group") {
                groups[groups.length] = items[i]
            }
        }
        var gs2 = groups.sort(function (a, b) {
            if (a.subLevel() > b.subLevel()) {
                return 1
            } else {
                if (a.subLevel() < b.subLevel()) {
                    return -1
                } else {
                    return 0
                }
            }
        });
        for (var i = 0; i < gs2.length; i++) {
            try {
                gs2[i].paint(ctx)
            } catch (e) {
                console.log(" invalid group entity: " + items[i].toString(), e)
            }
            ctx.shadowBlur = 0
        }
    };
    this.paintLines = function () {
        for (var i = 0; i < items.length; i++) {
            if (items[i].getType() == "line") {
                try {
                    items[i].paint(ctx)
                } catch (e) {
                    console.log(" invalid line: " + items[i].toString(), e)
                }
                ctx.shadowBlur = 0
            }
        }
    };
    this.paintEntitys = function () {
        for (var i = items.length - 1; i >= 0; i--) {
            var type = items[i].getType();
            if (type != "line" && type !== "group") {
                try {
                    items[i].paint(ctx)
                } catch (e) {
                    console.log(" invalid entity: " + items[i].toString(), e)
                }
                ctx.shadowBlur = 0
            }
        }
    };
    var util = new CanvasUtil();
    this.importDocument = function (json) {
        me.putLibraries(json.libraries);
        util.importEntities(me, json)
    };
    this.exportDocument = function () {
        var json = util.exportEntitiesToJson(me);
        return json
    };
    this.exportSelected = function () {
        var json = util.exportEntitiesToJson(me, me.getSelectedItems());
        return json
    };
    this.showSelectedEntityInfo = function () {
        var info = util.exportEntitiesToJson(me, me.getSelectedItems());
        if (me.showEntitiesInfo) {
            me.showEntitiesInfo(info)
        } else {
            console.log("selected entities info:", info)
        }
    };
    var copiedItems;
    this.doCopyAction = function () {
        copiedItems = me.getSelectedItems()
    };
    this.doPasteAction = function () {
        if (copiedItems) {
            var _m = [];
            var _lines = [];
            for (var i = 0; i < copiedItems.length; i++) {
                var item = copiedItems[i];
                if (item.clone) {
                    var newItem = item.clone();
                    me.addItem(newItem);
                    _m[item.getId()] = newItem.getId();
                    if (item.getType() == "line") {
                        _lines[_lines.length] = newItem;
                        newItem.setFromObj(item.getFromObj());
                        newItem.setToObj(item.getToObj())
                    }
                }
            }
            if (_lines.length > 0) {
                for (var i = 0; i < _lines.length; i++) {
                    var l = _lines[i], fid = _m[l.getFromObj().getId()], tid = _m[l.getToObj().getId()];
                    var fromObj = fid ? me.getItem(fid) : null;
                    var toObj = tid ? me.getItem(tid) : null;
                    if (fromObj) {
                        l.setFromObj(fromObj)
                    }
                    if (toObj) {
                        l.setToObj(toObj)
                    }
                }
            }
        }
    };
    var dragingLn;
    this.setDragEntityOffset = function (ln) {
        dragingLn = ln
    };
    var actionRecorder = new ActionRecorder(me);
    this.setActionRecorder = function (recorder) {
        actionPointerIndex = -1;
        actionRecorder = recorder
    };
    var actionPointerIndex = -1;
    this.doCancel = function () {
        if (actionPointerIndex < 0) {
            return
        }
        actionRecorder.performDoCancel(actionPointerIndex);
        actionPointerIndex--
    };
    this.doRecordAction = function (record) {
        actionRecorder.recordAction[record, actionPointerIndex++]
    };
    var getMouseOnObj = function (x, y) {
        return me.getItemByPoint({x: x, y: y})
    };
    var dragObj = null;
    var dragObjHistory = null;
    var linkSrcObj;
    var linkDstObj;
    var findLinkingToEntity = function (x, y) {
        var obj = getMouseOnObj(x, y);
        if (obj) {
            if (obj.getType() == "line") {
                return null
            }
        }
        return obj
    };
    var pointTranslating;
    var scaleLocation = function (ev) {
        return {x: ev.offsetX / me.mapScale(), y: ev.offsetY / me.mapScale()}
    };
    canvas.oncontextmenu = function (event) {
        var event = event || window.event;
        me.readyPointer();
        if (me.restoreActionStatus) {
            me.restoreActionStatus()
        }
        return false
    };
    canvas.onmousedown = function (e) {
        if (me.readonly() || e.button != 0) {
            return
        }
        var ln = scaleLocation(e);
        var x = ln.x;
        var y = ln.y;
        console.log("mouse down:", ln);
        if (me.isReadyLink()) {
            linkSrcObj = findLinkingToEntity(x, y);
            if (dragObjHistory) {
                selectEntity(dragObjHistory, false)
            }
            hiddenEditor(dragObjHistory);
            return
        }
        if (me.isReadyText()) {
            if (me.doAddingText) {
                var newTxt = me.doAddingText(e);
                if (doAddNewTxt(newTxt, x, y, e)) {
                    me.readyText(false);
                    releasePaintDrawRect()
                }
            }
            me.repaint();
            return
        }
        if (me.isReadyGroup()) {
            if (me.doAddingGroup) {
                var newGroup = me.doAddingGroup(e);
                if (doAddNewGroup(newGroup, x, y, e)) {
                    me.readyGroup(false);
                    releasePaintDrawRect()
                }
            }
            me.repaint();
            return
        }
        if (me.readyTranslation() || me.readyResize()) {
            pointTranslating = {x: x, y: y};
            return
        }
        dragObj = getMouseOnObj(x, y);
        if (dragObj != null) {
            try {
                if (dragObjHistory && dragObjHistory != dragObj && dragObj.isSelected() == false) {
                    if (e.ctrlKey == false) {
                        if (dragObjHistory) {
                            selectEntity(dragObjHistory, false)
                        }
                        me.unSelectItems()
                    }
                    hiddenEditor(dragObjHistory)
                }
                selectEntity(dragObj, true);
                if (doubleClick(e)) {
                    showEditor(x, y, dragObj, e);
                    dragObj = null;
                    pointDrawingRect = null;
                    return
                }
                if (me.doStartMovingEntity && isMouseDraging(e)) {
                    me.doStartMovingEntity(dragObj)
                }
            } catch (ex) {
                console.log(ex)
            }
        } else {
            if (dragObjHistory) {
                if (e.ctrlKey == false) {
                    selectEntity(dragObjHistory, false);
                    me.unSelectItems()
                }
            }
            hiddenEditor(dragObjHistory)
        }
        if (isMouseDraging(e)) {
            pointDrawingRect = {};
            pointDrawingRect.x = x;
            pointDrawingRect.y = y
        }
        me.repaint();
        dragObjHistory = dragObj
    };
    var isDrawingRect = false;
    canvas.onmouseup = function (e) {
        if (me.readonly() || e.button != 0) {
            return
        }
        var ln = scaleLocation(e);
        var x = ln.x;
        var y = ln.y;
        if (me.isReadyText() || me.isReadyGroup() || me.readyResize()) {
            if (me.readyResize()) {
                var objs = me.getSelectedItems();
                if (objs && objs.length == 1 && me.doResizedEntity) {
                    me.doResizedEntity(objs[0])
                }
            }
            return
        }
        if (me.isReadyLink()) {
            if (linkSrcObj) {
                linkDstObj = findLinkingToEntity(x, y);
                if (linkDstObj && linkSrcObj != linkDstObj) {
                    var newLine = me.doLinkBetweenSrcAndDst(linkSrcObj, linkDstObj);
                    if (newLine != null && me.doLinked) {
                        try {
                            me.doLinked(newLine)
                        } catch (ex) {
                            console.log(ex)
                        }
                    }
                }
                linkSrcObj = null;
                linkDstObj = null;
                oldSrcEntityWhenLinking = null;
                me.repaint()
            }
            return
        }
        if (dragObj != null) {
            try {
                if (me.doMovedEntity) {
                    me.doMovedEntity(dragObj)
                }
            } catch (ex) {
                console.log(ex)
            }
            dragObj = null
        } else {
            console.log("...................");
            if (e.ctrlKey == false) {
                me.unSelectItems()
            }
        }
        if (isDrawingRect) {
            doSelectInDrawRect(x, y);
            releasePaintDrawRect()
        }
        me.repaint()
    };
    var oldSrcEntityWhenLinking = null;
    canvas.onmousemove = function (e) {
        if (me.readonly() || e.button != 0) {
            paintTipInfo(e);
            return
        }
        if (me.isReadyText() || me.isReadyGroup()) {
            return
        }
        var ln = scaleLocation(e);
        var x = ln.x;
        var y = ln.y;
        if (me.readyTranslation() && e.buttons == 1) {
            var tx = x - pointTranslating.x, ty = y - pointTranslating.y;
            me.setTranslationOft(tx, ty);
            pointTranslating = null;
            me.repaint();
            pointTranslating = {x: x, y: y};
            return
        }
        if (me.readyResize() && e.buttons == 1) {
            var obj = me.getSelectedItems()[0];
            if (!obj) {
                me.readyPointer();
                return
            }
            var tx = x - pointTranslating.x, ty = y - pointTranslating.y;
            var b = obj.bounds();
            resizeSelectedEntity(b, tx, ty, obj);
            pointTranslating.x = x;
            pointTranslating.y = y;
            return
        }
        if (me.isReadyLink()) {
            var obj = findLinkingToEntity(x, y);
            if (obj) {
                if (oldSrcEntityWhenLinking != obj) {
                    obj.paintSelected(ctx);
                    obj.paint(ctx);
                    oldSrcEntityWhenLinking = obj
                }
            } else {
                me.repaint();
                oldSrcEntityWhenLinking = null
            }
        }
        if (isMouseFree(e)) {
            dragObj = null;
            if (me.getMouseAction() == null) {
                paintTipInfo(e)
            }
            if (me.getMouseAction() == null || me.readyResize()) {
                initResizeSelectedEntity(x, y)
            }
            return
        }
        if (me.isReadyLink()) {
            if (linkSrcObj) {
                me.repaint();
                paintReadLink(linkSrcObj, x, y)
            }
            return
        }
        if (dragObj == null) {
            me.repaint();
            paintDrawRect(x, y);
            return
        }
        if (me.canMoving() && dragObj != null && dragObj.canMoving()) {
            tip.show(false);
            var ln = {};
            ln.x = x - dragObj.getX() - dragObj.getOftX();
            ln.y = y - dragObj.getY() - dragObj.getOftY();
            var selectedItems = me.getSelectedItems();
            if (isMoveLineTitle(selectedItems)) {
                selectedItems[0].titleLocation(x, y)
            } else {
                for (var i = 0; i < selectedItems.length; i++) {
                    var item = selectedItems[i];
                    if (item.getType() == "line") {
                        continue
                    }
                    item.moveOft(ln)
                }
            }
            var relations = [];
            for (var i = 0; i < selectedItems.length; i++) {
                getRelationItems(relations, selectedItems[i])
            }
            for (var i = 0; i < relations.length; i++) {
                relations[i].moveOft(ln)
            }
            if (dragObj != null) {
                me.repaint()
            }
        }
    };
    var isMoveLineTitle = function (selectedItems) {
        return selectedItems && selectedItems.length == 1 && selectedItems[0].getType() == "line"
    };
    var notInclude = function (rs, node) {
        for (var i = 0; i < rs.length; i++) {
            if (rs[i].getId() == node.getId()) {
                return false
            }
        }
        return true
    };
    var getRelationItems = function (rs, nd) {
        if (nd.isInGroup()) {
            return
        }
        if (!nd.getLines) {
            return
        }
        var ls = nd.getLines();
        if (ls && ls.length > 0) {
            for (var i = 0; i < ls.length; i++) {
                var l = ls[i];
                var node = l.getOtherRelationObj(nd);
                if (node && node.canShow() == false && notInclude(rs, node)) {
                    rs[rs.length] = node;
                    getRelationItems(rs, node)
                }
            }
        }
    };
    var resizeSelectedEntity = function (b, tx, ty, obj) {
        var sc = me.mapScale();
        if (obj.getType() == "text") {
            var fs = (((b.width + tx * sc) / obj.getTextMaxLength())).toFixed(2);
            fs = Math.min(fs, 100);
            fs = Math.max(fs, 10);
            obj.setLabelFontSize(fs + "px")
        } else {
            if (obj.getType() == "group") {
                obj.setWidth(b.width + tx);
                obj.setHeight((b.height + ty))
            } else {
                if (obj.getType() == "image") {
                    obj.setWidth(b.width + tx * sc);
                    obj.setHeight(b.height + ty * sc)
                }
            }
        }
        me.repaint()
    };
    var initResizeSelectedEntity = function (x, y) {
        var objs = me.getSelectedItems();
        if (objs != null && objs.length == 1 && (objs[0].isEntity && objs[0].isEntity())) {
            var sc = me.mapScale();
            var oft = 0;
            var b = objs[0].bounds();
            if (objs[0].getType() == "image") {
                oft = Math.sqrt(b.width * b.width + b.height * b.height) / 4;
                oft = oft / sc;
                b.width = b.width / sc;
                b.height = b.height / sc
            } else {
                if (objs[0].getType() == "group") {
                    oft = 13 / sc
                } else {
                    if (objs[0].getType() == "text") {
                        oft = Math.sqrt(b.width * b.width / 4 + b.rowHeight * b.rowHeight) / 4;
                        oft = oft / sc;
                        b.width = b.width / sc;
                        if (sc > 1) {
                            b.height = (b.height + (sc - 1) * b.rowHeight) / sc
                        } else {
                            if (sc < 1) {
                                b.height = (b.height - (1 - sc) * b.rowHeight) / sc
                            } else {
                                b.height = b.height / sc
                            }
                        }
                    }
                }
            }
            if (Math.abs(b.x - x) <= oft && Math.abs(b.y - y) <= oft) {
            } else {
                if (Math.abs(x - b.x - b.width) <= oft && Math.abs(y - b.y - b.height) <= oft) {
                    me.readyResize("se");
                    return
                }
            }
            me.readyResize(false)
        }
    };
    var paintTipInfo = function (e) {
        if (me.showEntityTip() == false) {
            return
        }
        var ln = scaleLocation(e);
        var x = ln.x;
        var y = ln.y;
        var mouseOnObj = getMouseOnObj(x, y);
        if (mouseOnObj != tip.getEntity()) {
            tip.setEntity(mouseOnObj);
            tip.setMouseLocation({x: x, y: y});
            tip.show(true)
        }
        if (mouseOnObj == null) {
            tip.show(false)
        }
    };
    canvas.ondragover = function (ev) {
        if (me.readonly()) {
            return
        }
        ev.preventDefault()
    };
    canvas.ondrop = function (ev) {
        ev.stopPropagation();
        if (me.readonly()) {
            return
        }
        ev.preventDefault();
        var data = me.doDropingEntity(ev);
        if (!data) {
            console.log("Can not find the data for drop entity!");
            return
        }
        var ln = scaleLocation(ev);
        var x = ln.x;
        var y = ln.y;
        if (dragingLn) {
            x = x - dragingLn.x / me.mapScale();
            y = y - dragingLn.y / me.mapScale()
        }
        var entity = me.createImageEntity(data, x, y);
        if (entity.getType() == "image") {
            var att = {};
            att.name = "imageType";
            att.value = data.imageType || data.type;
            entity.addExtProperties(att);
            entity.setImageType(data.type)
        }
        me.addItem(entity);
        if (me.doDropedEntity) {
            me.doDropedEntity(entity)
        }
        me.repaint()
    };
    canvas.keydown = function (ev) {
        if (me.readonly()) {
            return
        }
        console.log(ev);
        switch (ev.key) {
            case"Delete":
                var selecteds = me.getSelectedItems();
                for (var i = 0; i < selecteds.length; i++) {
                    me.deleteItem(selecteds[i]);
                    if (selecteds[i].getType() == "group") {
                        var ops = selecteds[i].getMembers();
                        if (ops) {
                            for (var j = 0; j < ops.length; j++) {
                                me.autoAttachEntityToGroup(ops[j])
                            }
                        }
                    }
                }
                break;
            case"ArrowDown":
                me.moveSelectItems(ev);
                break;
            case"ArrowRight":
                me.moveSelectItems(ev);
                break;
            case"ArrowLeft":
                me.moveSelectItems(ev);
                break;
            case"ArrowUp":
                me.moveSelectItems(ev);
                break;
            case"c":
                if (ev.ctrlKey) {
                    me.doCopyAction()
                }
                break;
            case"C":
                if (ev.ctrlKey) {
                    me.doCopyAction()
                }
                break;
            case"v":
                if (ev.ctrlKey) {
                    if (ev.shiftKey) {
                        alert("Version:" + me.version() + "\n Author: Xue Chen")
                    } else {
                        me.doPasteAction()
                    }
                }
                break;
            case"V":
                if (ev.ctrlKey) {
                    if (ev.shiftKey) {
                        alert("Version:" + me.version() + "\n Author: Xue Chen")
                    } else {
                        me.doPasteAction()
                    }
                }
                break;
            case"Z":
                if (ev.ctrlKey) {
                    me.doCancel()
                }
                break;
            case"z":
                if (ev.ctrlKey) {
                    me.doCancel()
                }
                break;
            case"U":
                if (ev.ctrlKey && ev.shiftKey) {
                    me.showSelectedEntityInfo()
                }
                break
        }
        me.repaint()
    };
    var doAddNewTxt = function (data, x, y, ev) {
        var txt = me.createTxtEntity(data, x, y);
        me.addItem(txt);
        if (me.doAddedText) {
            me.doAddedText(txt)
        }
        return true
    };
    this.createImageEntity = function (data, x, y) {
        var img = new Image(data.id ? data.id : uuid(), data.name, data.image, x, y, data.width, data.height);
        img.setKCanvas(me);
        return img
    };
    this.createTxtEntity = function (data, x, y) {
        var txt = new Text(data.id ? data.id : uuid(), data.name, x, y, data.content, data.color, data.font, data.size);
        txt.setKCanvas(me);
        return txt
    };
    this.createGroupEntity = function (data, x, y) {
        var group = new EntityGroup(uuid(), data.name, x, y, autoParseNumber(data.width, 100), autoParseNumber(data.height, 100), data.color ? data.color : "lightgray");
        group.setKCanvas(me);
        return group
    };
    var doAddNewGroup = function (data, x, y, ev) {
        var group = me.createGroupEntity(data, x, y);
        me.addItem(group);
        if (me.doAddedGroup) {
            me.doAddedGroup(group)
        }
        return true
    };
    this.doLinkBetweenSrcAndDst = function (src, dst) {
        var data = {};
        if (me.doLinking) {
            data = me.doLinking(src, dst);
            if (data == null) {
                return null
            }
        }
        var uid = uuid();
        var linkLabel = data.name ? data.name : "";
        var x1 = src.getCenterX(), y1 = src.getCenterY(), x2 = dst.getCenterX(), y2 = dst.getCenterY();
        var lw = data.lineWidth ? data.lineWidth : 2;
        var lc = data.lineColor ? data.lineColor : "black";
        var l = new Line(uid, linkLabel, x1, y1, x2, y2, lw, lc);
        l.setKCanvas(me);
        l.setFromObj(src, dst);
        l.setToObj(dst, src);
        src.addLine(l);
        dst.addLine(l);
        l.relocationFrom();
        l.relocationTo();
        me.addItem(l);
        return l
    };
    var pointDrawingRect;
    var releasePaintDrawRect = function () {
        pointDrawingRect = null;
        isDrawingRect = false;
        me.repaint()
    };
    var doSelectInDrawRect = function (x2, y2) {
        var x = pointDrawingRect.x, y = pointDrawingRect.y;
        var b = {};
        b.x = Math.min(x, x2);
        b.y = Math.min(y, y2);
        b.width = Math.abs(x - x2);
        b.height = Math.abs(y - y2);
        var its = me.getItems();
        for (var i = 0; i < its.length; i++) {
            var item = its[i];
            if (item.canShow() == false) {
                continue
            }
            if (boundsInclude(b, item.bounds())) {
                selectEntity(item, true);
                dragObjHistory = item
            }
        }
    };
    var selectEntity = function (item, o) {
        item.selected(o);
        if (o) {
            if (me.doSelectEntity) {
                me.doSelectEntity(item)
            }
        } else {
            if (me.doUnSelectEntity) {
                me.doUnSelectEntity(item)
            }
        }
    };
    var paintDrawRect = function (x2, y2) {
        if (pointDrawingRect) {
            var x = pointDrawingRect.x, y = pointDrawingRect.y;
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = (1 / me.mapScale()).toFixed(0);
            ctx.strokeRect(x, y, x2 - x, y2 - y);
            ctx.stroke();
            ctx.restore();
            isDrawingRect = true
        }
    };
    var paintReadLink = function (srcObj, x, y) {
        srcObj.paintSelected(ctx);
        srcObj.paint(ctx);
        var obj = findLinkingToEntity(x, y);
        if (obj) {
            obj.paintSelected(ctx);
            obj.paint(ctx)
        }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = (1.5 / me.mapScale()).toFixed(0);
        ctx.beginPath();
        var x0 = srcObj.getCenterX();
        var y0 = srcObj.getCenterY();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore()
    };
    var initFlicker = function () {
    };
    var isMouseDraging = function (e) {
        return e.buttons == 1 && e.detail == 1
    };
    var isMouseFree = function (e) {
        return e.buttons == 0 && e.detail == 0
    };
    var doubleClick = function (e) {
        return e.buttons == 1 && e.detail == 2
    };
    var entityEditor;
    var hiddenEditor = function (obj) {
        if (entityEditor) {
            entityEditor.hidden();
            entityEditor = null
        }
        me.repaint()
    };
    var showEditor = function (x, y, obj, ev) {
        if (me.doShowEntityEditor) {
            me.doShowEntityEditor(obj, ev)
        } else {
            if (me.enableShowEditor() == false) {
                return
            }
            entityEditor = obj.getEditor(me);
            log("********************************Entity editor: " + canvas.offsetLeft + "," + canvas.offsetTop);
            log(canvas);
            log(ev);
            if (entityEditor) {
                entityEditor.show(x, y, ev);
                entityEditor.focus()
            } else {
                log("Can not get the editor for node " + obj.toString())
            }
        }
    };
    window.addEventListener("keydown", function (e) {
        var node = e.target || e.srcElement;
        if (node.nodeName == "BODY") {
            canvas.keydown(e)
        }
    }, true);
    var editorAction = function (ev) {
        var selecteds = me.getSelectedItems();
        if (selecteds && selecteds.length == 1) {
            var view = selecteds[0].getEditor(me);
            if (ev.key == "Enter") {
                view.update();
                hiddenEditor()
            } else {
                view.autoResizeEditorField()
            }
        }
    };
    return this
}

var uuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
        var randomFun = window.crypto.random;
        var ram = randomFun ? randomFun() : Math.random();
        s[i] = hexDigits.substr(Math.floor(ram * 16), 1)
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 3) | 8, 1);
    var uuid = s.join("");
    return uuid
};
var translateFontSize = function (fsize) {
    if (fsize.indexOf("px")) {
        var v = fsize.substring(0, fsize.indexOf("px"));
        return Math.abs(parseFloat(v))
    } else {
        return Math.abs(parseFloat(fsize))
    }
};
var canvasTextBounds = function (fontSize, strTitle) {
    var arr = strTitle.split("\n");
    var rs = {height: 0, width: 0};
    var fsize = fontSize;
    fsize = fsize ? fsize : "15px";
    var h = translateFontSize(fsize);
    for (var i = 0; i < arr.length; i++) {
        var str = arr[i];
        var len = textWidth(str);
        rs.width = Math.max(((h * len) / 2), rs.width)
    }
    rs.height = h;
    return rs
};
var textWidth = function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
            realLength += 1
        } else {
            realLength += 2
        }
    }
    return realLength
};
var pointDistance = function (p1, p2) {
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;
    return Math.sqrt(x * x + y * y)
};
var boundsInclude = function (b1, b2) {
    var rs = b2.x >= (b1.x - b2.width / 2) && (b1.x + b1.width) > (b2.x + b2.width / 2);
    rs = rs && b2.y >= (b1.y - b2.height / 2) && (b1.y + b1.height) > (b2.y + b2.height / 2);
    return rs && b1.width > b2.width && b1.height > b2.height
};
var boundsNotConnect = function (b1, b2) {
};
var createBlankImage = function () {
    console.log("TODO create blank image for image entity.")
};
var autoParseNumber = function (v, defValue) {
    if (!v) {
        return defValue
    }
    var tf = typeof (v);
    return tf == "string" ? parseInt(v) : tf == "number" ? v : defValue ? defValue : 0
};
var log = function (msg, obj) {
    if (true) {
        return
    }
    if (obj) {
        console.log(msg, obj)
    } else {
        console.log(msg)
    }
};

function Thumbnail() {
    var bounds = {};
    this.size = function (s) {
        bounds.width = s.width;
        bounds.height = s.height
    };
    this.position = function (p) {
        bounds.x = p.x;
        bounds.y = p.y
    };
    this.paint = function (ctx) {
    }
};

function Image(id, name, imgObj, x, y, width, height) {
    ShapeEntity.call(this, id, name, x, y, width, height);
    var me = this;
    var img = imgObj ? imgObj : createBlankImage();
    var imageType;
    var superPaint = me.paint;
    var superSetName = me.setName;
    var superRestore = me.restore;
    this.topComment = null;
    this.comment = null;
    this.setName = function (_name) {
        superSetName(_name);
        me.comment = null
    };
    var generateComment = function () {
        var d = {
            content: me.getName(),
            color: me.getLabelFontColor(),
            font: me.getLabelFont(),
            size: me.getLabelFontSize()
        };
        me.comment = me.getKCanvas().createTxtEntity(d, 0, 0)
    };
    if (!width) {
        me.setWidth(img && img.width ? img.width : 32)
    }
    if (!height) {
        me.setHeight(img && img.height ? img.height : 32)
    }
    this.restore = function () {
        superRestore();
        if (me.restoreMap.img) {
            me.setImage(me.restoreMap.img)
        }
    };
    this.getType = function () {
        return "image"
    };
    this.setImage = function (imgObj, enableRestore) {
        if (enableRestore) {
            me.restoreMap.img = me.getImage()
        }
        img = imgObj
    };
    this.getImage = function () {
        return img ? img : (me.canvas.getNullImage ? me.canvas.getNullImage() : null)
    };
    this.setImageType = function (obj) {
        imageType = obj
    };
    this.getImageType = function () {
        return imageType
    };
    this.clone = function () {
        var w = me.getWidth();
        var h = me.getHeight();
        var rs = new Image(uuid(), me.getName(), me.getImage(), me.getX() + w + 32, me.getY() + h + 32, w, h);
        rs.setLabelFontColor(me.getLabelFontColor());
        rs.setLabelFont(me.getLabelFont());
        rs.setLabelFontSize(me.getLabelFontSize());
        rs.setShadowColor(me.getShadowColor());
        rs.setShadowBlur(me.getShadowBlur());
        rs.setImageType(me.getImageType());
        if (me.topComment) {
            rs.setTopComment(me.topComment.getContent())
        }
        return rs
    };
    this.setTopComment = function (str) {
        if (!str) {
            return
        }
        var d = {content: str, color: me.getLabelFontColor(), font: me.getLabelFont(), size: me.getLabelFontSize()};
        me.topComment = me.getKCanvas().createTxtEntity(d, 0, 0)
    };
    this.getTopComment = function () {
        return me.topComment ? me.topComment.getContent() : null
    };
    this.paint = function (ctx) {
        if (superPaint(ctx) == false) {
            return false
        }
        var sc = me.getKCanvas().mapScale();
        if (me.getImage()) {
            ctx.drawImage(me.getImage(), me.getX(), me.getY(), me.getWidth() / sc, me.getHeight() / sc)
        }
        me.paintLabelStyle(ctx);
        if (!me.comment) {
            generateComment()
        }
        var ln = me.getNamePaintLocation();
        if (me.comment) {
            me.comment.setX(ln.x);
            me.comment.setY(ln.y);
            me.comment.paint(ctx)
        }
        if (me.getTopComment()) {
            me.topComment.setX(ln.topX);
            me.topComment.setY(ln.topY);
            me.topComment.paint(ctx)
        }
        return true
    };
    this.getNamePaintLocation = function () {
        var bounds = canvasTextBounds(me.getLabelFontSize(), me.getName());
        var sc = me.getKCanvas().mapScale();
        var ln = {};
        var tx = me.getX() + (me.getWidth() - bounds.width) / (2 * sc);
        var ty = me.getY() + (me.getHeight() + bounds.height) / sc + 3 / sc;
        if (me.getTopComment()) {
            var bt = canvasTextBounds(me.getLabelFontSize(), me.getTopComment());
            ln.topY = ty - (bt.height + me.getHeight()) / sc - 6 / sc;
            ln.topX = me.getX() + (me.getWidth() - bt.width) / (2 * sc)
        }
        ln.x = tx;
        ln.y = ty;
        ln.w = bounds.width;
        ln.h = bounds.height;
        return ln
    };
    var editor = null;
    this.getEditor = function (canvas) {
        if (editor == null) {
            editor = new ImageEditor(canvas, null, me)
        }
        return editor
    };
    this.toString = function () {
        return '{id:"' + me.getId() + '",type:"' + me.getType() + '",name:"' + me.getName() + '",x:' + me.getX() + ",y:" + me.getY() + ",width:" + me.getWidth() + ",height:" + me.getHeight() + ',imageType:"' + me.getImageType() + '"' + ',shadowColor:"' + me.getShadowColor() + '",shadowBlur:"' + (me.getShadowBlur() ? me.getShadowBlur() : "") + '"' + ',topComment:"' + me.getTopComment() + '"' + "}"
    }
};

function Text(id, name, x, y, _content, color, font, size) {
    ShapeEntity.call(this, id, name);
    this.getType = function () {
        return "text"
    };
    var me = this;
    var superPaint = me.paint;
    var superGetY = me.getY;
    var superIsIn = me.isIn;
    var superGetWidth = me.getWidth;
    var content;
    if (x) {
        me.setX(x)
    }
    if (y) {
        me.setY(y)
    }
    if (_content) {
        content = _content
    }
    this.getContent = function () {
        var lab = content ? content : me.getName();
        return lab
    };
    this.setContent = function (str) {
        content = str
    };
    if (color) {
        me.setLabelFontColor(color)
    }
    if (font) {
        me.setLabelFont(font)
    }
    if (size) {
        me.setLabelFontSize(size)
    }
    this.getWidth = function () {
        var lab = me.getContent();
        var w = 0;
        if (lab) {
            var arr = lab.split("\n");
            for (var i = 0; i < arr.length; i++) {
                w = Math.max(w, canvasTextBounds(me.getLabelFontSize(), arr[i]).width)
            }
        }
        return w
    };
    this.getTextMaxLength = function () {
        var lab = me.getContent();
        var w = 1;
        if (lab) {
            var arr = lab.split("\n");
            for (var i = 0; i < arr.length; i++) {
                w = Math.max(w, arr[i].length)
            }
        }
        return w
    };
    this.getHeight = function () {
        var lab = me.getContent();
        if (lab) {
            var h = canvasTextBounds(me.getLabelFontSize(), lab).height;
            var arr = lab.split("\n");
            return h * arr.length + h / 4
        }
        return 0
    };
    this.isIn = function (px, py) {
        superIsIn(px, py);
        var sc = me.getKCanvas().mapScale();
        var oftX = px - me.getX();
        var oftY = py - me.getY();
        var lab = me.getContent() ? me.getContent() : " ";
        var arr = lab.split("\n");
        var len = arr.length;
        var bounds = {};
        bounds.width = me.getWidth() / sc;
        bounds.height = me.getHeight() / sc;
        var rs = oftX > 0 && oftX < bounds.width && oftY > (-1 * (bounds.height / len)) && oftY < ((bounds.height - bounds.height / len));
        return rs
    };
    this.paint = function (ctx) {
        if (superPaint(ctx) == false) {
            return false
        }
        var lab = me.getContent() ? me.getContent() : " ";
        me.paintLabelStyle(ctx);
        var b = canvasTextBounds(me.getLabelFontSize(), lab);
        var arr = lab.split("\n");
        var sc = me.getKCanvas().mapScale();
        for (var i = 0; i < arr.length; i++) {
            var x = me.getX(), y = me.getY() + (i) * b.height / sc;
            ctx.fillText(arr[i], x, y)
        }
        return true
    };
    this.clone = function () {
        var w = me.getWidth();
        var h = me.getHeight();
        var rs = new Text(uuid(), me.getName(), me.getX() + w + 32, me.getY() + h + 32, me.getContent(), me.getLabelFontColor(), me.getLabelFont(), me.getLabelFontSize());
        rs.setShadowColor(me.getShadowColor());
        rs.setShadowBlur(me.getShadowBlur());
        return rs
    };
    this.bounds = function () {
        var b = {};
        b.x = me.getX();
        b.width = me.getWidth();
        b.height = me.getHeight();
        var lab = me.getContent() ? me.getContent() : " ";
        var cb = canvasTextBounds(me.getLabelFontSize(), lab);
        b.y = me.getY() - cb.height;
        b.rowHeight = cb.height;
        return b
    };
    this.getNamePaintLocation = function () {
        var rs = {};
        rs.x = me.getX();
        rs.y = superGetY();
        var lab = me.getContent() ? me.getContent() : " ";
        rs.w = textWidth(lab);
        rs.h = me.getHeight();
        return rs
    };
    var editor = null;
    this.getEditor = function (canvas) {
        if (editor == null) {
            editor = new TextEditor(canvas, null, me)
        }
        return editor
    }
};

function EntityGroup(id, name, x, y, width, height, _color) {
    ShapeEntity.call(this, id, name, x, y, width, height);
    var superMoveOft = this.moveOft;
    var me = this;
    var superPaint = me.paint;
    var superIsIn = me.isIn;
    var members = [];
    var color = _color ? _color : "black";
    var backgroundColor = "#eeeeee";
    var subLv = 1;
    this.subLevel = function (lv) {
        if (lv == null || lv == undefined) {
            return subLv
        }
        subLv = lv
    };
    this.getType = function () {
        return "group"
    };
    this.setColor = function (c) {
        color = c
    };
    this.getColor = function () {
        return color
    };
    this.setBackgroundColor = function (c) {
        backgroundColor = c
    };
    this.getBackgroundColor = function () {
        return backgroundColor
    };
    var increaseSubLevel = function (group, level) {
        group.subLevel(group.subLevel() + level);
        var ms = group.getMembers();
        if (ms && ms.length > 0) {
            for (var i = 0; i < ms.length; i++) {
                if (ms[i].getType() == "group") {
                    increaseSubLevel(ms[i], level)
                }
            }
        }
    };
    this.addMember = function (obj) {
        for (var i = 0; i < members.length; i++) {
            if (members[i] == obj) {
                return
            }
        }
        members[members.length] = obj;
        obj.inGroup(me);
        console.log(me.getId() + " do addMember:", obj.getId());
        if (obj.getType() == "group") {
            increaseSubLevel(obj, me.subLevel())
        }
    };
    this.removeMember = function (obj) {
        console.log("removeMember:", obj.getId());
        var n = -1;
        var ns = [];
        for (var i = 0; i < members.length; i++) {
            if (members[i].getId() == obj.getId()) {
                console.log(me.getId() + " do removeMember:", obj.getId());
                n = i;
                obj.inGroup(null);
                continue
            }
            ns[ns.length] = members[i]
        }
        if (n < 0) {
            return null
        }
        var rs = members[n];
        members = ns;
        if (rs.getType() == "group") {
            increaseSubLevel(rs, -1 * me.subLevel())
        }
        return rs
    };
    this.getMembers = function () {
        return members
    };
    this.moveOft = function (ln) {
        superMoveOft(ln);
        for (var i = 0; i < members.length; i++) {
            if (members[i].isSelected()) {
                continue
            }
            members[i].moveOft(ln)
        }
    };
    var drawDashLine = function (ctx, x1, y1, x2, y2, stepOft) {
        var step = stepOft ? stepOft : 5;
        var x = x2 - x1;
        var y = y2 - y1;
        var count = Math.floor(Math.sqrt(x * x + y * y) / step);
        var xv = x / count;
        var yv = y / count;
        ctx.beginPath();
        for (var i = 0; i < count; i++) {
            if (i % 2 === 0) {
                ctx.moveTo(x1, y1)
            } else {
                ctx.lineTo(x1, y1)
            }
            x1 += xv;
            y1 += yv
        }
        ctx.lineTo(x2, y2);
        ctx.stroke()
    };
    var drawDashRect = function (ctx, left, top, width, height, stepOft) {
        var step = stepOft ? stepOft : 5;
        drawDashLine(ctx, left + 3, top, left + width, top, step);
        drawDashLine(ctx, left + width, top, left + width, top + height - 3, step);
        drawDashLine(ctx, left + width, top + height, left + 3, top + height, step);
        drawDashLine(ctx, left, top + height, left, top + 3, step)
    };
    this.canShow = function () {
        if (members && members.length > 0) {
            for (var i = 0; i < members.length; i++) {
                if (members[i].canShow()) {
                    return true
                }
            }
            return false
        }
        return true
    };
    this.paint = function (ctx) {
        if (superPaint(ctx) == false) {
            return false
        }
        ctx.save();
        var b = me.bounds();
        drawDashRect(ctx, b.x, b.y, b.width, b.height);
        if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.globalAlpha = 0.67;
            ctx.fillRect(b.x, b.y, b.width, b.height)
        }
        ctx.restore();
        return true
    };
    this.isIn = function (px, py) {
        superIsIn(px, py);
        var oftX = px - me.getX();
        var oftY = py - me.getY();
        var rs = oftX > 0 && oftX < me.getWidth() && oftY > 0 && oftY < me.getHeight();
        return rs
    };
    this.toString = function () {
        return '{id:"' + me.getId() + '",type:"' + me.getType() + '",name:"' + me.getName() + '",x:' + me.getX() + ",y:" + me.getY() + ",width:" + me.getWidth() + ",height:" + me.getHeight() + ',shadowColor:"' + me.getShadowColor() + '",shadowBlur:' + me.getShadowBlur() + ",backgroundColor:" + me.getBackgroundColor() + ",subLevel:" + me.subLevel() + "}"
    }
};

function CanvasUtil() {
    this.imageLibrary = [];
    var me = this;
    var image_entities_library_id = "canvas_imageLibrary";
    this.importEntities = function (canvas, json) {
        var doc = json.doc;
        var entities = json.entities;
        if (doc.name) {
            name = doc.name
        }
        if (doc.width) {
            canvas.width = doc.width
        }
        if (doc.height) {
            canvas.height = doc.height
        }
        if (entities) {
            for (var i = 0; i < entities.length; i++) {
                var obj = generateEntity(canvas, entities[i], json.libraries);
                canvas.addItem(obj)
            }
            for (var i = 0; i < entities.length; i++) {
                if (entities[i].properties) {
                    initRelationWhenImport(canvas, entities[i])
                }
            }
            canvas.resetLineOrder()
        }
        if (json.libraries) {
            canvas.setLibraries(json.libraries)
        }
        setTimeout(function () {
            canvas.repaint()
        }, 300)
    };
    var getAllRelationItems = function (canvas, _items) {
        var map = [];
        var items = [];
        for (var i = 0; i < _items.length; i++) {
            map[_items[i].getId()] = _items[i];
            items[items.length] = _items[i]
        }
        var initEntityLines = function (node, _lines) {
            for (var i = 0; i < _lines.length; i++) {
                if (map[_lines[i].getId()]) {
                    continue
                }
                var fromId = _lines[i].getFromObj().getId();
                var toId = _lines[i].getToObj().getId();
                if (map[fromId] && map[toId]) {
                    items[items.length] = _lines[i];
                    map[_lines[i].getId()] = _lines[i]
                }
            }
        };
        var initEntityGroup = function (group) {
            var ms = group.getMembers();
            if (ms) {
                for (var i = 0; i < ms.length; i++) {
                    if (map[ms[i].getId()]) {
                        continue
                    }
                    if (canvas.getItem(ms[i].getId()) == null) {
                        continue
                    }
                    var b1 = group.bounds(), b2 = ms[i].bounds();
                    if (boundsInclude(b1, b2) == false) {
                        continue
                    }
                    items[items.length] = ms[i];
                    map[ms[i].getId()] = ms[i];
                    var lines = ms[i].getLines();
                    if (lines) {
                        initEntityLines(ms[i], lines)
                    }
                    if (ms[i].getType() == "group") {
                        initEntityGroup(ms[i])
                    }
                }
            }
        };
        for (var i = 0; i < _items.length; i++) {
            if (_items[i].isEntity() == false) {
                continue
            }
            var lines = _items[i].getLines();
            if (lines) {
                initEntityLines(_items[i], lines)
            }
            if (_items[i].getType() == "group") {
                initEntityGroup(_items[i])
            }
        }
        return items
    };
    this.exportEntitiesToJson = function (canvas, _items) {
        var json = {};
        var doc = {};
        var bounds = canvas.getBounds();
        doc.width = bounds.width;
        doc.height = bounds.height;
        json.doc = doc;
        json.libraries = {};
        var entities = [];
        var items = _items ? getAllRelationItems(canvas, _items) : canvas.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var entity = {};
            entity.id = item.getId();
            entity.name = item.getName();
            entity.type = item.getType();
            var atts = item.getExtProperties();
            if (item.getType() == "image") {
                if (validateImageEntityWhenExport(item) == false) {
                    return
                }
                initImagePropertiesWhenExport(item, atts, json.libraries)
            } else {
                if (item.getType() == "line") {
                    initLinePropertiesWhenExport(item, atts)
                } else {
                    if (item.getType() == "text") {
                        initTextPropertiesWhenExport(item, atts)
                    } else {
                        if (item.getType() == "group") {
                            initGroupPropertiesWhenExport(canvas, item, atts)
                        }
                    }
                }
            }
            initPropertiesDefWhenExport(item, atts);
            entity.properties = atts;
            entities[entities.length] = entity
        }
        json.entities = entities;
        json = JSON.stringify(json);
        return json
    };
    var validateImageEntityWhenExport = function (item) {
        if (item.getImage() && item.getImageType()) {
            return true
        }
        return false
    };
    var initPropertiesDefWhenExport = function (item, atts) {
        if (item.getShadowBlur() && item.getShadowColor()) {
            var sdc = {};
            sdc.name = "shadowColor";
            sdc.value = item.getShadowColor();
            var sdb = {};
            sdb.name = "shadowBlur";
            sdb.value = item.getShadowBlur();
            filterProperty(atts, sdc);
            filterProperty(atts, sdb)
        }
        if (item.mapLevel) {
            var ml = {};
            ml.name = "mapLevel";
            ml.value = item.mapLevel();
            filterProperty(atts, ml)
        }
        var font = {};
        font.name = "font";
        font.value = item.getLabelFont();
        var fontSize = {};
        fontSize.name = "fontSize";
        fontSize.value = item.getLabelFontSize();
        var fontColor = {};
        fontColor.name = "fontColor";
        fontColor.value = item.getLabelFontColor();
        filterProperty(atts, font);
        filterProperty(atts, fontSize);
        filterProperty(atts, fontColor)
    };
    var initImagePropertiesWhenExport = function (item, atts, libs) {
        var x = {};
        x.name = "x";
        x.value = item.getX();
        var y = {};
        y.name = "y";
        y.value = item.getY();
        var w = {};
        w.name = "width";
        w.value = item.getWidth();
        var h = {};
        h.name = "height";
        h.value = item.getHeight();
        var iType = {};
        iType.name = "imageType";
        iType.value = item.getImageType();
        var tm = {};
        tm.name = "topComment";
        tm.value = item.getTopComment() ? item.getTopComment() : "";
        filterProperty(atts, x);
        filterProperty(atts, y);
        filterProperty(atts, w);
        filterProperty(atts, h);
        if (iType.value) {
            filterProperty(atts, iType)
        }
        filterProperty(atts, tm);
        var imgType = getProperty("imageType", item.getExtProperties());
        var src = item.getImage().src;
        src = filterImageRelativeSrc(src);
        var lib = {name: imgType, value: src};
        var imgs = libs.imgs ? libs.imgs : [];
        filterProperty(imgs, lib);
        libs.imgs = imgs
    };
    var filterImageRelativeSrc = function (src) {
        var str = src;
        console.log("filterImageRelativeSrc", str);
        if (str.substring(0, 5) === "http:" || str.substring(0, 6) === "https:") {
            var host = window.location.origin;
            console.log(host);
            if (str.indexOf(host) >= 0) {
                str = str.substring(host.length);
                var n = str.indexOf("/");
                str = str.substring(n)
            }
        }
        return str
    };
    var initLinePropertiesWhenExport = function (item, atts) {
        var w = {};
        w.name = "lineWidth";
        w.value = item.getLineWidth();
        var from = {};
        from.name = "from";
        from.value = item.getFromObj().getId();
        var to = {};
        to.name = "to";
        to.value = item.getToObj().getId();
        var c = {};
        c.name = "lineColor";
        c.value = item.getLineColor();
        var nc = {};
        nc.name = "nameColor";
        nc.value = item.getNameColor();
        var sa = {};
        sa.name = "showArrow";
        sa.value = item.isShowArrow();
        var fromComment = {};
        fromComment.name = "fromComment";
        fromComment.value = item.getFromComment();
        var toComment = {};
        toComment.name = "toComment";
        toComment.value = item.getToComment();
        filterProperty(atts, w);
        filterProperty(atts, from);
        filterProperty(atts, to);
        filterProperty(atts, c);
        filterProperty(atts, nc);
        filterProperty(atts, sa);
        filterProperty(atts, fromComment);
        filterProperty(atts, toComment)
    };
    var initTextPropertiesWhenExport = function (item, atts) {
        var x = {};
        x.name = "x";
        x.value = item.getX();
        var y = {};
        y.name = "y";
        y.value = item.getY();
        var txt = {};
        txt.name = "content";
        txt.value = item.getContent();
        filterProperty(atts, x);
        filterProperty(atts, y);
        filterProperty(atts, txt)
    };
    var initGroupPropertiesWhenExport = function (canvas, item, atts) {
        var x = {};
        x.name = "x";
        x.value = item.getX();
        var y = {};
        y.name = "y";
        y.value = item.getY();
        var w = {};
        w.name = "width";
        w.value = item.getWidth();
        var h = {};
        h.name = "height";
        h.value = item.getHeight();
        var c = {};
        c.name = "color";
        c.value = item.getColor();
        var bc = {};
        bc.name = "backgroundColor";
        bc.value = item.getBackgroundColor();
        filterProperty(atts, x);
        filterProperty(atts, y);
        filterProperty(atts, w);
        filterProperty(atts, h);
        filterProperty(atts, c);
        filterProperty(atts, bc);
        var members = item.getMembers();
        if (members && members.length > 0) {
            var ids = "";
            for (var i = 0; i < members.length; i++) {
                if (i > 0) {
                    ids += ","
                }
                var mid = members[i].getId();
                var mb = canvas.getItem(mid);
                if (mb != null) {
                    var b1 = item.bounds(), b2 = mb.bounds();
                    if (boundsInclude(b1, b2)) {
                        ids += members[i].getId()
                    }
                }
            }
            var items = {};
            items.name = "members";
            items.value = ids;
            filterProperty(atts, items)
        }
    };
    var filterProperty = function (atts, p) {
        for (var i = 0; i < atts.length; i++) {
            if (atts[i].name == p.name) {
                atts[i].value = p.value;
                return
            }
        }
        atts[atts.length] = p
    };
    var generateEntity = function (canvas, data, libs) {
        var rs;
        switch (data.type) {
            case"image":
                var imgObj = getEntityImageElementFromLibrary(canvas, data.properties, libs);
                if (imgObj == null) {
                    imgObj = getEntityImageElement(data.properties)
                }
                rs = new Image(data.id, data.name, imgObj);
                break;
            case"line":
                rs = new Line(data.id, data.name);
                break;
            case"group":
                rs = new EntityGroup(data.id, data.name);
                break;
            case"text":
                rs = new Text(data.id, data.name);
                break
        }
        if (rs) {
            rs.setCanvas(canvas);
            initEntityProperties(rs, data.properties)
        }
        return rs
    };
    var initRelationWhenImport = function (canvas, entityData) {
        var obj = canvas.getItem(entityData.id);
        if (obj == null) {
            return
        }
        obj.setExtProperties(entityData.entities);
        if (entityData.type == "line") {
            var line = obj;
            var fromId = getProperty("from", entityData.properties);
            var toId = getProperty("to", entityData.properties);
            var from = canvas.getItem(fromId);
            var to = canvas.getItem(toId);
            if (from && to) {
                line.setFromObj(from);
                line.setToObj(to);
                from.addLine(line);
                to.addLine(line);
                line.relocationFrom();
                line.relocationTo()
            } else {
                canvas.deleteItem(line)
            }
        } else {
            if (entityData.type == "group") {
                var mstr = getProperty("members", entityData.properties);
                if (mstr) {
                    var marr = mstr.split(",");
                    for (var i = 0; i < marr.length; i++) {
                        var member = canvas.getItem(marr[i]);
                        if (member) {
                            obj.addMember(member)
                        }
                    }
                }
            }
        }
    };
    var initEntityProperties = function (entity, properties) {
        for (var i = 0; i < properties.length; i++) {
            var item = properties[i];
            entity.addExtProperties(item);
            try {
                switch (item.name) {
                    case"x":
                        entity.setX(item.value);
                        continue;
                    case"y":
                        entity.setY(item.value);
                        continue;
                    case"width":
                        entity.setWidth(item.value);
                        continue;
                    case"height":
                        entity.setHeight(item.value);
                        continue;
                    case"content":
                        entity.setContent(item.value);
                        continue;
                    case"shadowColor":
                        entity.setShadowColor(item.value);
                        continue;
                    case"lineWidth":
                        entity.setLineWidth(item.value);
                        continue;
                    case"shadowBlur":
                        entity.setShadowBlur(item.value);
                        continue;
                    case"font":
                        entity.setLabelFont(item.value);
                        continue;
                    case"color":
                        entity.setColor(item.value);
                        continue;
                    case"nameColor":
                        entity.setNameColor(item.value);
                        continue;
                    case"showArrow":
                        entity.showArrow(item.value);
                        continue;
                    case"topComment":
                        entity.setTopComment(item.value);
                        continue;
                    case"fontSize":
                        entity.setLabelFontSize(item.value);
                        continue;
                    case"fontColor":
                        entity.setLabelFontColor(item.value);
                        continue;
                    case"lineColor":
                        entity.setLineColor(item.value);
                        continue;
                    case"fromComment":
                        entity.setFromComment(item.value);
                        continue;
                    case"toComment":
                        entity.setToComment(item.value);
                        continue;
                    case"imageType":
                        entity.setImageType(item.value);
                        continue;
                    case"backgroundColor":
                        entity.setBackgroundColor(item.value);
                        continue;
                    case"members":
                        continue;
                    case"mapLevel":
                        entity.mapLevel(item.value)
                }
            } catch (e) {
                console.log(e)
            }
        }
    };
    var getEntityImageElementFromLibrary = function (canvas, properties, libs) {
        var imgType = getProperty("imageType", properties);
        var src = getProperty(imgType, libs.imgs);
        if (src == null && canvas.getImageSrcPath) {
            src = canvas.getImageSrcPath(imgType)
        }
        console.log("image path type:" + imgType, src);
        if (src) {
            var img = me.imageLibrary[src];
            if (img) {
                return img
            }
            var len = src.length;
            if (false && src.toLocaleLowerCase().indexOf(".svg") == (len - 4)) {
                var templateNode = null;
                var image = templateNode ? templateNode.cloneNode() : document.createElement("IMG");
                img = document.createElementNS("http://www.w3.org/2000/svg", "image");
                img.namespaceURI = "http://www.w3.org/1999/xhtml";
                img.href.baseVal = src;
                image.appendChild(img);
                console.log("create img:", img);
                console.log("create image:", image)
            } else {
                img = document.createElement("IMG");
                img.src = src
            }
            return img
        }
        return null
    };
    var getEntityImageElement = function (properties) {
        var lib = document.getElementById(image_entities_library_id);
        if (lib && lib.childNodes) {
            var images = lib.childNodes;
            var imgType = getProperty("imageType", properties);
            for (var i = 0; i < images.length; i++) {
                var obj = images.item(i);
                if (obj.nodeType != 1) {
                    continue
                }
                var img = obj;
                if (img.getAttribute("type") == imgType) {
                    return img
                }
            }
        }
        return null
    };
    var getProperty = function (property, properties) {
        for (var i = 0; i < properties.length; i++) {
            var item = properties[i];
            if (item.name == property) {
                return item.value
            }
        }
        return null
    }
};

function SpringLayout(w, h, px, py, scale) {
    var width = w ? w : 1920;
    var height = h ? h : 1080;
    var padingX = px ? px : 100;
    var padingY = py ? py : 100;
    console.log(width + "," + height);
    var oft = 2;
    var ALL_CELLS = 1;
    var EXPAND_CELLS = 2;
    var arrangeType = ALL_CELLS;
    var SPRING_LENGTH = (256 / oft) / scale;
    var STIFFNESS = 10 / oft;
    var ELECTRICAL_REPULISION = 32 / oft;
    var INCREMENT = 1.5 / oft;
    this.layout = function (cell, children, allVertices) {
        if (children == null || children.length <= 0) {
            return
        }
        var bound = cell.bounds();
        var xForce = 0, yForce = 0, distance, spring, repulsion, xSpring = 0, ySpring = 0, xRepulsion = 0,
            yRepulsion = 0, adjacentDistance = 0, adjX, adjY, thisX = bound.cx, thisY = bound.cy;
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node.getId() == cell.getId()) {
                continue
            }
            bound = node.bounds();
            adjX = bound.cx;
            adjY = bound.cy;
            distance = Math.sqrt(Math.pow(adjX - thisX, 2) + Math.pow(adjY - thisY, 2));
            if (distance == 0) {
                distance = 0.0001
            }
            spring = STIFFNESS * Math.log(distance / SPRING_LENGTH) * ((thisX - adjX) / (distance));
            xSpring += spring;
            spring = STIFFNESS * Math.log(distance / SPRING_LENGTH) * ((thisY - adjY) / (distance));
            ySpring += spring
        }
        for (var i = 0; i < allVertices.length; i++) {
            var node = allVertices[i];
            if (node.getId() == cell.getId() || node.getLines() == null || node.getLines().length == 0) {
                continue
            }
            bound = node.bounds();
            adjX = bound.cx;
            adjY = bound.cy;
            distance = Math.sqrt(Math.pow(adjX - thisX, 2) + Math.pow(adjY - thisY, 2));
            if (distance == 0) {
                distance = 0.0001
            }
            repulsion = (ELECTRICAL_REPULISION / distance) * ((thisX - adjX) / (distance));
            xRepulsion += repulsion;
            repulsion = (ELECTRICAL_REPULISION / distance) * ((thisY - adjY) / (distance));
            yRepulsion += repulsion
        }
        xForce = xSpring - xRepulsion;
        yForce = ySpring - yRepulsion;
        var xadj = 0 - (xForce * INCREMENT);
        var yadj = 0 - (yForce * INCREMENT);
        bound = cell.bounds();
        var X = (arrangeType == ALL_CELLS) ? ((xadj + bound.x)) : Math.abs((xadj + bound.x)),
            Y = (arrangeType == ALL_CELLS) ? ((yadj + bound.y)) : Math.abs((yadj + bound.y));
        if (cell.isInGroup() == false) {
            cell.setX(X);
            cell.setY(Y)
        }
    }
};
