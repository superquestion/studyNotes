/**
 * Created by Administrator on 2014/10/9.
 */

<div class="tag-panel">\
    <div class="tag-panel-header">\
        <li data-tag="tag-list" class="selected">标签列表</li>\
        <li data-tag="customer-tag">自定义标签</li>\
    </div>\
    <div class="tag-panel-tab">\
        <div class="tag-list">\
            <div class="tag-search-box">\
                <input type="search" class="tag-search" name="tagName">\
                    <a href="javascript:;" id="search-tag-btn">搜索</a>\
                </div>\
                <div id="tag-list"></div>\
        </div>\
        <div class="customer-tag" id="customer-tag">\
                <label class="form-label" for="name">\
                    <span class="form-required">*</span>名称:\
                </label>\
                <div class="form-field">                        \
                    <input name="name" type="text" id="tag-name" required=""  class="form-control">\
                </div>\
                <div class="form-tip"></div>\
                    <label class="form-label" for="name">描述:</label>\
                    <div class="form-field">                        \
                        <input name="desc" type="text" id="tag-desc" required=""  class="form-control">                    </div>\
                        <div class="form-tip clear-fix"></div>\
                        <label class="form-label" for="name">颜色:</label>\
                        <div class="form-field">                        \
                            <input name="color" type="color" id="tag-color" required=""  >\
                        </div>\
                            <div class="form-tip"></div>\
                        </div>\
                 </div>\
                 <div class="tagPanel-btnWrap">\
                        <a href="javascript:;" class="btn btn-default" id="tagPanel-cancel"><span>取消</span></a>\
                        <a href="javascript:;" class="btn btn-default"  data-current = "tag-list" id="tagPanel-ok"><span>确定</span></a>\
                 </div>\
        </div>\
    </div>\
</div>\
