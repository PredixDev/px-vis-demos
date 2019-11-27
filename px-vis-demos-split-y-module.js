/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'px-vis/px-vis-data-converter.js';
import 'px-vis-timeseries/px-vis-timeseries.js';
import '@polymer/iron-ajax/iron-ajax.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <px-vis-timeseries id="timeseries0" series-config="[[seriesConfig]]" dynamic-menu-config="[[menuConfig]]" disable-navigator="" height="600" width="1000" default-series-config="{
        &quot;type&quot;: &quot;line&quot;,
        &quot;x&quot;: &quot;timeStamp&quot;,
        &quot;axis&quot;: {
          &quot;id&quot;: &quot;axis1&quot;,
          &quot;side&quot;: &quot;left&quot;,
          &quot;number&quot;: &quot;1&quot;
        }
      }" cursor-config="{
        &quot;horizontalLine&quot;: &quot;none&quot;
      }" chart-data="[[chartData]]" render-to-canvas="">
    </px-vis-timeseries>

    <iron-ajax id="randomData" url="[[importPath]]../px-demo-data/demo-data/random/d4x1000.json" handle-as="json" last-response="{{chartData}}" auto="">
    </iron-ajax>
`,

  is: 'px-vis-demos-split-y-module',

  properties: {
    seriesConfig: {
      tyhpe: Object,
      value: function() {
        return {
          "y2":{"y":"y2"},
          "y3":{"y":"y3"}
        }
      }
    },
    axisCount: {
      type: Number,
      value: 1
    },
    menuConfig: Array
  },

  attached: function() {
    var menu = [{
      "name": "Delete",
      "action": this._deleteSeries,
      "actionContext": this,
      "eventName": "delete",
      "icon": "px-vis:trash-series"
    },{
      "name": "Split Y",
      "action": this._splitY,
      "actionContext": this,
      "eventName": "split-y",
      "icon": "px-vis:expand-radius"
    }];

    this.set('menuConfig', menu);
  },

  _deleteSeries: function(data) {
    var conf = this.seriesConfig;
    this.set("seriesConfig", undefined);
    delete conf[data.additionalDetail];
    this.set("seriesConfig", conf);
  },

  _splitY: function(data) {
    var conf = this.seriesConfig;
        this.set("seriesConfig", undefined),
        name = data.additionalDetail,
        series = Object.keys(conf),
        extents = {};

    this.axisCount += 1;

    // define an additional axis for the selected series
    conf[name]['axis'] = {
      "id": "axis" + name,
      "side": "left",
      "number": this.axisCount
    };

    // if you have min and max extents for series, use them for efficiency,
    // we dont in this example, so we need to calculate
    series.forEach(function(s) {
      extents[s] = Px.d3.extent(this.chartData, function(d) {
        return d[conf[s]['y']];
      });
    }.bind(this));

    // now, we need to adjust the min and max so the series dont overlap
    series.forEach(function(s) {
      var delta = (extents[s][1] - extents[s][0]) * 1.1; //add 10% buffer

      // if this series is the one being put on a new axis, add to the min
      // if not, add to the max
      conf[s]['yMin'] = name === s ? extents[s][0] - delta : extents[s][0];
      conf[s]['yMax'] = name === s ? extents[s][1] : extents[s][1] + delta;
    });

    this.set("seriesConfig", conf);
  }
});
