
function Topo(group, items, h_interval = 40, v_interval = 40, h_l_interval = 50, v_t_interval = 50) {

    this.group_bounds = group.bounds();

    this.items = items;
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

        if (this.candidate_position.x + this.h_interval > this.base_point.x + this.canvas_width ||
            this.candidate_position.y + this.v_interval > this.base_point.y + this.canvas_height)
            return this.drop_queue;

        return this.__rank();
    };

    this.adjust_arrange = function () {
        var item;
        for (var index = 0; index < this.items.length; ++index) {
            item = this.items[index];
            item.setWidth(this.default_width);
            item.setHeight(this.default_height);
        }

        var sqrt_div = Math.sqrt(items.length);
        var mid = (Math.floor(sqrt_div) ** 2 + Math.ceil(sqrt_div) ** 2) / 2;
        var matrix_div = items.length > mid ? Math.ceil(sqrt_div) : Math.floor(sqrt_div);

        group.setWidth(this.h_l_interval + (this.default_width + this.h_interval) * matrix_div + this.h_interval);
        if (Math.ceil(items.length / matrix_div) > matrix_div) {
            group.setHeight(this.v_t_interval + (this.default_height + this.v_interval) * (matrix_div + 1) + this.v_interval);
        } else {
            group.setHeight(this.v_t_interval + (this.default_height + this.v_interval) * (matrix_div) + this.v_interval);
        }

        var rown = 0;
        var coln = 0;
        for (index = 0; index < this.items.length; ++index) {
            rown = Math.floor(index / matrix_div);
            coln = index % matrix_div;
            item = this.items[index];
            item.setX(this.candidate_left_bound + coln * (this.default_width + this.h_interval));
            item.setY(this.candidate_top_bound +  rown * (this.default_height + this.v_interval));
        }


    };

    this.__rank = function () {
        var item_bounds;
        for (var index = 0; index < this.items.length; index++) {
            item_bounds = this.items[index].bounds();
            if (this.__in_right_bounds(item_bounds) && this.__in_bottom_bounds(item_bounds)) {
                // item不需要换行
                this.__update(this.items[index]);
            } else if (!this.__in_right_bounds(item_bounds) && this.__in_bottom_bounds(item_bounds)) {
                this.__bp_wrap();
                // 换行后检查是否越界
                if (!this.__in_right_bounds(item_bounds) || !this.__in_bottom_bounds(item_bounds)) {
                    this.drop_queue.push(this.items[index]);
                } else {
                    this.__update(this.items[index]);
                }
            } else {
                // item的y坐标越界则直接放入drop queue
                this.drop_queue.push(this.items[index]);
            }
        }
        return this.drop_queue;
    };

    this.__update = function (item) {
        // 设置item的坐标
        item.setX(this.candidate_position.x);
        item.setY(this.candidate_position.y);
        var item_bounds = item.bounds();
        // 更新这一行最大y，用于候选坐标换行间隔
        if (item_bounds.y + item_bounds.height > this.max_bottom_right.y) {
            this.max_bottom_right.y = item_bounds.y + item_bounds.height;
        }
        // 更新候选坐标
        if (this.candidate_position.x + item_bounds.width + this.h_interval >= this.canvas_right) {
            this.__bp_wrap();
        }
        else {
            this.candidate_position.x += (item_bounds.width + this.h_interval);
        }
    };

    this.__bp_wrap = function () {
        // 候选坐标换行
        this.candidate_position.x = this.candidate_left_bound;
        this.candidate_position.y = this.max_bottom_right.y + this.v_interval;
        // 初始化一行的最大y
        this.max_bottom_right.y = this.candidate_position.y;
    };

    this.__in_right_bounds = function (item_bounds) {
        // 检查item是否在右边界内
        return this.candidate_position.x + item_bounds.width <= this.canvas_right
    };

    this.__in_bottom_bounds = function (item_bounds) {
        // 检查item是否在下边界内
        return this.candidate_position.y + item_bounds.height <= this.canvas_bottom
    };

}
