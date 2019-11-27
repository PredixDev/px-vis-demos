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
/**
benchmarking chart drawings

### Usage

    <px-vis-demos-dynamic-add></px-vis-demos-dynamic-add>

@element px-vis-demos-dynamic-add
@blurb demonstrating dynamically adding/removing charts
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { Base } from '@polymer/polymer/polymer-legacy.js';

import './px-vis-behavior-chart-generator.js';
import 'px-vis-timeseries/px-vis-timeseries.js';
import 'px-vis-xy-chart/px-vis-xy-chart.js';
import 'px-vis-polar/px-vis-polar.js';
import 'px-vis-radar/px-vis-radar.js';
import 'px-vis-parallel-coordinates/px-vis-parallel-coordinates.js';
import '@polymer/iron-ajax/iron-ajax.js';
import './css/px-vis-benchmark-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { resolveUrl } from '@polymer/polymer/lib/utils/resolve-url.js';
import { importHref as importHref$0 } from '@polymer/polymer/lib/utils/import-href.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="px-vis-benchmark-styles"></style>

    <template is="dom-if" if="[[!hideUi]]">
      <template is="dom-if" if="[[!isRunning]]">
        <span class="inline--flex flex--col flex--middle">TS - all data
          <button on-click="_startFullTS" class\$="[[_buttonClass(_dataReady)]]">[[_buttonText(_dataReady)]]</button>
        </span>
        <span class="inline--flex flex--col flex--middle">All charts - medium data
          <button on-click="_startAllCharts" class\$="[[_buttonClass(_dataReady)]]">[[_buttonText(_dataReady)]]</button>
        </span>
        <div id="warmupDiv">
          <input id="warmup" type="checkbox" checked="{{_buildWarmup::change}}">
          <label for="warmup" class="label--inline">Include benchmark warmup</label>
          <px-tooltip for="warmupDiv" delay="50" tooltip-message="If checked the benchmark will run a first loop with one chart of each type to 'warmup' the polymer stamping of those elements" orientation="auto"></px-tooltip>
        </div>
      </template>
    </template>
    <template is="dom-if" if="[[isRunning]]">
      <span>[[_status]]</span>
    </template>
    <iron-ajax url="[[importPath]][[dataRootPath]]4x1k.json" handle-as="json" auto="" last-response="{{data4x1k}}">
    </iron-ajax>
    <iron-ajax url="[[importPath]][[dataRootPath]]4x10k.json" handle-as="json" auto="" last-response="{{data4x10k}}">
    </iron-ajax>
    <iron-ajax url="[[importPath]][[dataRootPath]]40x1k.json" handle-as="json" auto="" last-response="{{data40x1k}}">
    </iron-ajax>
    <iron-ajax url="[[importPath]][[dataRootPath]]40x10k.json" handle-as="json" auto="" last-response="{{data40x10k}}">
    </iron-ajax>
    <div id="chartHolder"></div>

    <template is="dom-if" if="[[hasResults]]">
      <template is="dom-repeat" items="[[reportData]]">
      <span class="heading--page">[[item.title]]</span><br>
      <span class="heading--section">Total time: [[item.total]]ms</span><br>
      <span class="heading--section">Average per chart: [[item.average]]ms</span><br>
      <span class="value">[[item.description]]</span><br>

        <template is="dom-if" if="[[_isPolymer1]]" restamp="">
          <px-data-table table-data="[[item.tableData]]"></px-data-table>
        </template>

        <template is="dom-if" if="[[!_isPolymer1]]" restamp="">
          <px-data-grid table-data="[[item.tableData]]"></px-data-grid>
        </template>
      </template>
      <br><br>
    </template>
`,

  is:'px-vis-benchmark',
  behaviors:[PxVisBehaviorDemo.chartGenerator,PxVisBehaviorDemo.timings,PxVisBehaviorDemo.propertyWatch],
  properties:{_drawingListener:{type:Function},perfResult:{type:Array,notify:true},dataRootPath:{type:String,value:'benchmark_data/'},data4x1k:{type:Object},data4x10k:{type:Object},data40x1k:{type:Object},data40x10k:{type:Object},_dataReady:{type:Boolean,computed:'_computeDataReady(data4x1k, data4x10k, data40x1k, data40x10k)'},_currentPerfMeasure:{type:Object},_currentBenchIndex:{type:Number,value:0},_isPolymer1:{type:Boolean},reportData:{type:Array,value:function value(){return[]},notify:true},hasResults:{type:Boolean,value:false,notify:true},contexts:{type:Array},_status:{type:String,computed:'_computeStatus(_currentBenchIndex, contexts, _cleaningUp, buildingReport, buildingDt)'},isRunning:{type:Boolean,value:false,notify:true},buildingReport:{type:Boolean,value:false,notify:true},buildingDt:{type:Boolean,value:false,notify:true},_cleaningUp:{type:Boolean,value:false,notify:true},_buildWarmup:{type:Boolean,value:true},hideUi:{type:Boolean,value:false}},
  ready:function ready(){this._drawingListener=this._drawingListen.bind(this);this._renderingStarted=this._renderingStarted.bind(this);this.set('_isPolymer1',!PolymerElement);if(this._isPolymer1){Base.importHref(resolveUrl('bower_components/chimera-table/px-data-table.html',''))}else{importHref$0(resolveUrl('bower_components/chimera-table/px-data-grid.html',''))}},
  _startFullTS:function _startFullTS(){this.contexts=[];this._buildContexts('fullTS');this._start()},
  _startAllCharts:function _startAllCharts(){this.contexts=[];this._buildContexts('allCharts');this._start()},
  _start:function _start(){this.set('hasResults',false);this.set('isRunning',true);this.perfResult=[];this._currentBenchIndex=0;this._scheduleNextLoop()},
  _scheduleNextLoop:function _scheduleNextLoop(){var ctx;if(this._currentBenchIndex<this.contexts.length){var timeout;ctx=this.contexts[this._currentBenchIndex];if(this._currentBenchIndex===0||ctx.disableMeasures){timeout=0}else{timeout=ctx.cleaningTimeout||ctx.cleaningTimeout===0?ctx.cleaningTimeout:1000}this._currentBenchIndex++;if(timeout){this._cleaningUp=true}window.setTimeout(function(){this._cleaningUp=false;this._runOneBenchmark(ctx)}.bind(this),timeout)}else{window.requestAnimationFrame(function(){this._buildReportData();this.set('buildingDt',true);window.requestAnimationFrame(function(){this.set('buildingDt',false);this.set('isRunning',false);this.set('hasResults',true)}.bind(this))}.bind(this))}},
  _drawingListen:function _drawingListen(e){this._drawingCounter++;var target=dom(e).localTarget,perf=this._currentPerfMeasure[target.benchmarkId];if(perf){perf.counter++;if(perf.counter%this._drawingMultiplier===0){window.performance.mark('endDrawing_'+perf.index);console.log('chart '+perf.index+' finished drawing');this._removeTimingListeners(target)}}if(this._drawingCounter%(this._drawingMultiplier*Number(this._drawingNumberOfCharts))===0){window.performance.mark('endLoop');this._removeCharts();this._processPerfTimings();console.log('End loop');this._scheduleNextLoop()}},
  _runOneBenchmark:function _runOneBenchmark(ctx){window.performance.clearMarks();this._chartOptions=ctx.options;this._currentPerfMeasure={};this._currentPerfMeasure.loopInfo={};this._currentPerfMeasure.loopInfo.ctx=ctx;this._currentPerfMeasure.loopInfo.options=this._chartOptions;this._currentPerfMeasure.loopInfo.numberOfCharts=ctx.numberOfCharts;var result={context:ctx},currentChart,newDiv,fragment=document.createElement('div'),extents;this._initializeDrawingMeasures(ctx.chartType,ctx.numberOfCharts,ctx.data.data);window.performance.mark('startLoop');for(var i=0;i<ctx.numberOfCharts;i++){newDiv=document.createElement('div');newDiv.style['height']='500px';currentChart=this._createNewChart(ctx,i);dom(newDiv).appendChild(currentChart);dom(fragment).appendChild(newDiv)}window.performance.mark('before_append');this.$.chartHolder.appendChild(fragment);window.performance.mark('after_append')},
  _createNewChart:function _createNewChart(ctx,index){var currentChart,extents;if(ctx.chartType==='px-vis-xy-chart'){extents={x:[0,ctx.data.data.length-1],y:ctx.data.extents.y}}else{extents=ctx.data.extents}window.performance.mark('creation_'+index);currentChart=document.createElement(ctx.chartType);this._addTimingEventListener(currentChart);currentChart.benchmarkId=index;this._currentPerfMeasure[index]={renderType:this._chartOptions.canvas?'canvas':'svg',chartType:ctx.chartType,counter:0,index:index};this._processChartCreation(currentChart,extents,ctx.data.data);window.performance.mark('creationEnd_'+index);return currentChart},
  _addTimingEventListener:function _addTimingEventListener(chart){this._propertiesTimed=[];if(chart.nodeName==='PX-VIS-PARALLEL-COORDINATES'||chart.nodeName==='PX-VIS-RADAR'){this._addPropertyWatcher(chart,'dimensions')}else{}this._addPropertyWatcher(chart,'x');this._addPropertyWatcher(chart,'y');this._addPropertyWatcher(chart,'domainChanged');chart.addEventListener('px-vis-scatter-rendering-ended',this._drawingListener);chart.addEventListener('px-vis-line-svg-rendering-ended',this._drawingListener);chart.addEventListener('px-vis-chart-canvas-rendering-ended',this._drawingListener);chart.addEventListener('px-vis-chart-canvas-rendering-started',this._renderingStarted)},
  _removeTimingListeners:function _removeTimingListeners(chart){chart.removeEventListener('px-vis-scatter-rendering-ended',this._drawingListener);chart.removeEventListener('px-vis-line-svg-rendering-ended',this._drawingListener);chart.removeEventListener('px-vis-chart-canvas-rendering-ended',this._drawingListener);chart.removeEventListener('px-vis-chart-canvas-rendering-started',this._renderingStarted)},
  _removeCharts:function _removeCharts(){var myNode=this.$.chartHolder;while(myNode.firstChild){myNode.removeChild(myNode.firstChild)};if(!this._currentPerfMeasure.loopInfo.ctx.disableMeasures){this.perfResult.push(this._currentPerfMeasure)}},
  _processPerfTimings:function _processPerfTimings(){var perf;for(var i=0;i<this._currentPerfMeasure.loopInfo.numberOfCharts;i++){perf=this._currentPerfMeasure[i];perf.timings={};perf.timings['creation']=this._measureTiming('creation','creation_'+perf.index,'creationEnd_'+perf.index);if(perf.renderType==='canvas'){perf.timings['drawing']=this._measureTiming('drawing','startDrawing_'+perf.index,'endDrawing_'+perf.index)}perf.timings['total']=this._measureTiming('total','before_append','endDrawing_'+perf.index);this._processPropertiesTiming(perf.index,perf)}this._currentPerfMeasure.total=this._measureTiming('total','startLoop','endLoop')},
  _buildReportData:function _buildReportData(){var tableData,reportData=[],currentReportData,current,keys1,keys2,pair,average,min,max,val;this.set('buildingReport',true);for(var p=0;p<this.perfResult.length;p++){tableData=[];keys1=Object.keys(this.perfResult[p]);average={'name':'Average'};min={'name':'min'};max={'name':'max'};for(var i=0;i<keys1.length;i++){pair=[keys1[i],this.perfResult[p][keys1[i]]];current={'name':'Chart'+i};if(pair[0]!=='loopInfo'&&pair[0]!=='total'){keys2=Object.keys(pair[1].timings);for(var j=0;j<keys2.length;j++){val=parseFloat(pair[1].timings[keys2[j]]).toFixed(1);current[keys2[j]]=val;this._buildStats(average,min,max,keys2[j],val)}keys2=Object.keys(pair[1].properties);for(var j=0;j<keys2.length;j++){val=parseFloat(pair[1].properties[keys2[j]].duration).toFixed(1);current[keys2[j]]=val;this._buildStats(average,min,max,keys2[j],val);val=pair[1].properties[keys2[j]].count;current[keys2[j]+' (count)']=val;this._buildStats(average,min,max,keys2[j]+' (count)',val)}tableData.push(current)}}keys2=Object.keys(average);for(var j=0;j<keys2.length;j++){if(keys2[j]!=='name'){average[keys2[j]]=(average[keys2[j]]/tableData.length).toFixed(1)}}tableData.unshift(max);tableData.unshift(min);tableData.unshift(average);currentReportData={'tableData':tableData,'title':this.perfResult[p].loopInfo.ctx.title,'description':this.perfResult[p].loopInfo.ctx.description,'total':this.perfResult[p].total.toFixed(1),'average':(this.perfResult[p].total/this.perfResult[p].loopInfo.numberOfCharts).toFixed(1)};reportData.push(currentReportData)}this.set('buildingReport',false);this.set('reportData',reportData)},
  _buildStats:function _buildStats(average,min,max,key,value){if(!average[key]&&average[key]!==0){average[key]=parseFloat(value)}else{average[key]+=parseFloat(value)}if(!min[key]&&min[key]!==0){min[key]=value}else{min[key]=Math.min(min[key],value)}if(!max[key]&&max[key]!==0){max[key]=value}else{max[key]=Math.max(max[key],value)}},
  _renderingStarted:function _renderingStarted(e){var target=dom(e).localTarget,perf=this._currentPerfMeasure[target.benchmarkId];if(window.performance.getEntriesByName('startDrawing_'+perf.index,'mark').length===0){window.performance.mark('startDrawing_'+perf.index)}},
  _computeDataReady:function _computeDataReady(){if(this.data40x10k&&this.data40x1k&&this.data4x10k&&this.data4x1k){return true}else{return false}},
  _buttonClass:function _buttonClass(){if(!this._dataReady){return'btn btn--disabled'}else{return'btn'}},
  _buttonText:function _buttonText(){if(this._dataReady){return'Start benchmark'}else{return'Loading data...'}},
  _buildContexts:function _buildContexts(type){if(this._buildWarmup){this.contexts=this.buildWarmupContext()}if(type==='fullTS'){this._buildFullTSContext()}else if(type==='allCharts'){this._buildAllChartsContext()}},
  buildWarmupContext:function buildWarmupContext(){var ctx,result=[];ctx=this.createContext(1,'px-vis-timeseries','small','','');ctx.options.canvas=true;ctx.disableMeasures=true;result.push(ctx);ctx=this.createContext(1,'px-vis-xy-chart','small','','');ctx.options.canvas=true;ctx.disableMeasures=true;result.push(ctx);ctx=this.createContext(1,'px-vis-parallel-coordinates','small','','');ctx.options.canvas=true;ctx.disableMeasures=true;result.push(ctx);ctx=this.createContext(1,'px-vis-radar','small','','');ctx.options.canvas=true;ctx.disableMeasures=true;result.push(ctx);ctx=this.createContext(1,'px-vis-polar','small','','');ctx.options.canvas=true;ctx.disableMeasures=true;result.push(ctx);return result},
  _buildAllChartsContext:function _buildAllChartsContext(){var ctx;ctx=this.createContext(10,'px-vis-timeseries','large','10 TS canvas 4x10k','10 timeseries chart rendering on canvas. 4 series, 10000 points per series');ctx.options.canvas=true;ctx.options.disableNav=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-xy-chart','large','10 XY canvas 4x10k','10 XY chart rendering on canvas. 4 series, 10000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-parallel-coordinates','large','10 // canvas 4x10k','10 parallel coordinates chart rendering on canvas. 4 series, 10000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-radar','large','10 radar canvas 4x10k','10 radar chart rendering on canvas. 4 series, 10000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-polar','medium','10 polar canvas 4x10k','10 polar chart rendering on canvas. 4 series, 10000 points per series');ctx.options.canvas=true;this.contexts.push(ctx)},
  _buildFullTSContext:function _buildFullTSContext(){var ctx;ctx=this.createContext(10,'px-vis-timeseries','small','10 TS canvas 4x1k','10 timeseries chart rendering on canvas. 4 series, 1000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-timeseries','small','10 SVG canvas 4x1k','10 timeseries chart rendering on svg. 4 series, 1000 points per series');this.contexts.push(ctx);ctx=this.createContext(1,'px-vis-timeseries','mediumSeries','10 TS SVG 40x1k','10 timeseries chart rendering on svg. 40 series, 1000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(10,'px-vis-timeseries','mediumSeries','10 TS canvas 40x1k','10 timeseries chart rendering on canvas. 40 series, 1000 points per series');ctx.options.canvas=true;this.contexts.push(ctx);ctx=this.createContext(5,'px-vis-timeseries','large','5 TS canvas 40x10k','5 timeseries chart rendering on canvas. 40 series, 10000 points per series');ctx.options.canvas=true;this.contexts.push(ctx)},
  createContext:function createContext(number,type,size,title,description){var data,ctx;if(size==='small'){data=this.data4x1k}else if(size==='medium'){data=this.data4x10k}else if(size==='mediumSeries'){data=this.data40x1k}else{data=this.data40x10k}ctx={numberOfCharts:number,chartType:type,'data':data,title:title,description:description,options:this._chartOptions};if(type==='px-vis-radar'||type==='px-vis-polar'){ctx.options.preventResize=true}return ctx},
  _computeStatus:function _computeStatus(){if(this.buildingReport){return'Building report from results...'}if(this.buildingDt){return'Building data table...'}if(this._cleaningUp){return'Cleaning up before loop '+this._currentBenchIndex+' of '+this.contexts.length+'...'}if(this.contexts&&this.contexts.length){return'Running loop '+this._currentBenchIndex+' of '+this.contexts.length}return'invalid state'},
  getDatasetSize:function getDatasetSize(dataset){var numberOfSeries=Object.keys(dataset[0]).length;if(dataset.length===1000){if(numberOfSeries===6){return'small'}else if(numberOfSeries===42){return'mediumSeries'}else{return'unknown'}}else if(dataset.length===10000){if(numberOfSeries===6){return'medium'}else if(numberOfSeries===42){return'large'}else{return'unknown'}}else{return'unknown'}}
})
