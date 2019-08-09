function GridLayout(group, members) {
    var me=this;
    var h_interval = 80, v_interval = 40, h_l_interval = 50, v_t_interval = 50;

    this.group_bounds = group.bounds();

    this.items = members?members:group.getMembers();
    // item之间的水平间隔
    this.h_interval = h_interval;
    // item之间的垂直间隔
    this.v_interval = v_interval;

    // 最左边的边界间隔 left
    this.h_l_interval = h_l_interval;
    // 最右边的边界间隔 right
    this.h_r_interval = 5;
    // 顶边的边界间隔 top
    this.v_t_interval = v_t_interval;
    // 底边的边界间隔 bottom
    this.v_b_interval = 5;

    // 相对坐标系 candidate_position
    this.base_point = { x : this.group_bounds.x, y : this.group_bounds.y};
    // 侯选位置 === 光标
    this.candidate_position = { x: this.candidate_left_bound,
        y: this.candidate_top_bound };
    // 候选位置左边界坐标
    this.candidate_left_bound = this.base_point.x + this.h_l_interval + this.h_interval;
    // 侯选位置上边界坐标
    this.candidate_top_bound = this.base_point.y + this.v_t_interval + this.v_interval;
    // 一行的最大y坐标
    this.max_bottom_right = this.candidate_position.y;

    // canvas宽
    this.canvas_width = this.group_bounds.width;
    // canvas高
    this.canvas_height = this.group_bounds.height;
    // canvas右边界 垂直x坐标
    this.canvas_right = this.base_point.x + this.canvas_width - this.h_r_interval;
    // canvas下边界 垂直y坐标
    this.canvas_bottom = this.base_point.y + this.canvas_height - this.v_b_interval;

    // 丢弃队列
    this.drop_queue = [];

    // image默认宽高
    this.default_width = 32;
    this.default_height = 32;

    this.arrange = function () {

        if (me.candidate_position.x + me.h_interval > me.base_point.x + me.canvas_width ||
            me.candidate_position.y + me.v_interval > me.base_point.y + me.canvas_height)
            return me.drop_queue;

        return __rank();
    };

    this.adjust_arrange = function () {
        var item;
        for (var index = 0; index < me.items.length; ++index) {
            item = me.items[index];
            item.setWidth(me.default_width);
            item.setHeight(me.default_height);
        }

        var sqrt_div = Math.sqrt(me.items.length);
        var mid = (Math.floor(sqrt_div) ** 2 + Math.ceil(sqrt_div) ** 2) / 2;
        var matrix_div = me.items.length > mid ? Math.ceil(sqrt_div) : Math.floor(sqrt_div);

        group.setWidth(me.h_l_interval + (me.default_width + me.h_interval) * matrix_div + me.h_interval);
        if (Math.ceil(me.items.length / matrix_div) > matrix_div) {
            group.setHeight(me.v_t_interval + (me.default_height + me.v_interval) * (matrix_div + 1) + me.v_interval);
        } else {
            group.setHeight(me.v_t_interval + (me.default_height + me.v_interval) * (matrix_div) + me.v_interval);
        }

        var rown = 0;
        var coln = 0;
        for (index = 0; index < me.items.length; ++index) {
            rown = Math.floor(index / matrix_div);
            coln = index % matrix_div;
            item = me.items[index];
            item.setX(me.candidate_left_bound + coln * (me.default_width + me.h_interval));
            item.setY(me.candidate_top_bound +  rown * (me.default_height + me.v_interval));
        }


    };

    var __rank = function () {
        var item_bounds;
        for (var index = 0; index < me.items.length; index++) {
            item_bounds = me.items[index].bounds();
            if (__in_right_bounds(item_bounds) && __in_bottom_bounds(item_bounds)) {
                // item不需要换行
                __update(me.items[index]);
            } else if (!__in_right_bounds(item_bounds) && __in_bottom_bounds(item_bounds)) {
                __bp_wrap();
                // 换行后检查是否越界
                if (!__in_right_bounds(item_bounds) || !__in_bottom_bounds(item_bounds)) {
                    me.drop_queue.push(me.items[index]);
                } else {
                    __update(me.items[index]);
                }
            } else {
                // item的y坐标越界则直接放入drop queue
                me.drop_queue.push(me.items[index]);
            }
        }
        return me.drop_queue;
    };

    var __update = function (item) {
        // 设置item的坐标
        item.setX(me.candidate_position.x);
        item.setY(me.candidate_position.y);
        var item_bounds = item.bounds();
        // 更新这一行最大y，用于候选坐标换行间隔
        if (item_bounds.y + item_bounds.height > me.max_bottom_right.y) {
            me.max_bottom_right.y = item_bounds.y + item_bounds.height;
        }
        // 更新候选坐标
        if (me.candidate_position.x + item_bounds.width + me.h_interval >= me.canvas_right) {
            __bp_wrap();
        }
        else {
            me.candidate_position.x += (item_bounds.width + me.h_interval);
        }
    };

    var __bp_wrap = function () {
        // 候选坐标换行
        me.candidate_position.x = me.candidate_left_bound;
        me.candidate_position.y = me.max_bottom_right.y + me.v_interval;
        // 初始化一行的最大y
        me.max_bottom_right.y = me.candidate_position.y;
    };

    var __in_right_bounds = function (item_bounds) {
        // 检查item是否在右边界内
        return me.candidate_position.x + item_bounds.width <= me.canvas_right
    };

    var __in_bottom_bounds = function (item_bounds) {
        // 检查item是否在下边界内
        return me.candidate_position.y + item_bounds.height <= me.canvas_bottom
    };

    this.adjust_arrange();
}
