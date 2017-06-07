'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}(function(){'use strict';var pxVisDemosDynamicAdd=function(){function pxVisDemosDynamicAdd(){_classCallCheck(this,pxVisDemosDynamicAdd)}_createClass(pxVisDemosDynamicAdd,[{key:'attached',value:function attached(){this._generateListener=this._generateDataSet.bind(this);this._createListener=this._createChart.bind(this);this._removeListener=this._removeChart.bind(this);this._drawingListener=this._drawingListen.bind(this);this._moveListener=this._moveChart.bind(this);this.$.generate.addEventListener('click',this._generateListener);this.$.btnCreate.addEventListener('click',this._createListener);this.$.btnRemove.addEventListener('click',this._removeListener);this.$.btnMove.addEventListener('click',this._moveListener);this.addEventListener('px-vis-scatter-rendering-ended',this._drawingListener);this.addEventListener('px-vis-line-svg-rendering-ended',this._drawingListener);this.addEventListener('px-vis-line-canvas-rendering-ended',this._drawingListener);this.addEventListener('px-vis-scatter-canvas-rendering-ended',this._drawingListener)}},{key:'detached',value:function detached(){this.$.generate.removeEventListener('click',this._generateListener);this.$.btnCreate.removeEventListener('click',this._createListener);this.$.btnRemove.removeEventListener('click',this._removeListener);this.$.btnMove.removeEventListener('click',this._moveListener);this.removeEventListener('px-vis-scatter-rendering-ended',this._drawingListener);this.removeEventListener('px-vis-line-svg-rendering-ended',this._drawingListener);this.removeEventListener('px-vis-line-canvas-rendering-ended',this._drawingListener);this.removeEventListener('px-vis-scatter-canvas-rendering-ended',this._drawingListener)}},{key:'_generateDataSet',value:function _generateDataSet(){var dataSet=this._generateData(this.$.pointsPerSeries.value,this.$.seriesNumber.value,this.selectedChartType);if(this.dataSets[this.selectedChartType][0].key==='dummy'){this.dataSets[this.selectedChartType][0]=dataSet}else{this.dataSets[this.selectedChartType].push(dataSet)}this._computeCurrentDataSets()}},{key:'_generateData',value:function _generateData(pointsNumber,seriesNumber,chartType,seriesNames){console.time('generating '+pointsNumber*seriesNumber+' total ('+seriesNumber+' series each '+pointsNumber+' points) for '+chartType);var result=[],step=Math.floor((this._generateOptions.endTime-this._generateOptions.startTime)/pointsNumber),isPolar=chartType==='px-vis-polar',extents={},yMins={},yMaxs={};if(chartType==='px-vis-timeseries'){extents.x=[this._generateOptions.startTime,this._generateOptions.startTime+pointsNumber*step]}else if(chartType==='px-vis-xy-chart'){extents.x=[0,pointsNumber]}this._generateOptions.counter++;for(var i=0;i<pointsNumber;i++){var newData={};newData.timeStamp=this._generateOptions.startTime+i*step;for(var j=0;j<seriesNumber;j++){var name=seriesNames?seriesNames[j]:'y'+j,axisName='axis'+j;if(result.length===0||this._generateOptions.randomise){newData[name]=Math.random()*(this._generateOptions.dataMax-this._generateOptions.dataMin)+this._generateOptions.dataMin;newData['x']=isPolar?Math.random()*360:Math.random()*(this._generateOptions.dataMax-this._generateOptions.dataMin)+this._generateOptions.dataMin}else{newData[name]=result[i-1][name]+(Math.random()*2-1)*this._generateOptions.variance;newData['x']=isPolar?i%360:i}if(!extents[axisName]){extents[axisName]=[Number.MAX_VALUE,Number.MIN_VALUE]}if(newData[name]<extents[axisName][0]){extents[axisName][0]=newData[name]}if(newData[name]>extents[axisName][1]){extents[axisName][1]=newData[name]}}var extKeys=Object.keys(extents),min=Number.MAX_VALUE,max=Number.MIN_VALUE;for(var k=0;k<extKeys.length;k++){if(extKeys[k]!=='x'){if(extents[extKeys[k]][1]>max){max=extents[extKeys[k]][1]}if(extents[extKeys[k]][0]<min){min=extents[extKeys[k]][0]}}}extents.y=[min,max];result.push(newData)}console.timeEnd('generating '+pointsNumber*seriesNumber+' total ('+seriesNumber+' series each '+pointsNumber+' points) for '+chartType);return{'val':'[Gen]['+this._generateOptions.counter+'] '+pointsNumber*seriesNumber+' total ('+seriesNumber+' series each '+pointsNumber+' points)','key':{'data':result,'extents':extents}}}},{key:'_computeCurrentDataSets',value:function _computeCurrentDataSets(){this.set('_currentDataSets',[{'key':'1','val':'dummy'}]);this.set('_currentDataSets',this.dataSets[this.selectedChartType]);if(this.dataSets[this.selectedChartType]&&this.dataSets[this.selectedChartType][0]){this.$.dataSetDropdown.set('displayValue',this.dataSets[this.selectedChartType][0].val);this.$.dataSetDropdown.set('selectedKey',this.dataSets[this.selectedChartType][0].key)}}},{key:'_canScatter',value:function _canScatter(selectedChartType){return selectedChartType!=='px-vis-parallel-coordinates'&&selectedChartType!=='px-vis-radar'&&selectedChartType!=='px-vis-pie-chart'&&selectedChartType!=='px-vis-polar'}},{key:'_canCanvas',value:function _canCanvas(selectedChartType){return selectedChartType==='px-vis-timeseries'||selectedChartType==='px-vis-xy-chart'||selectedChartType==='px-vis-polar'}},{key:'_canSvg',value:function _canSvg(selectedChartType){return selectedChartType==='px-vis-parallel-coordinates'||selectedChartType==='px-vis-radar'}},{key:'_canProgRender',value:function _canProgRender(selectedChartType,canvas,svg){return this._canCanvas(selectedChartType)&&canvas||this._canSvg(selectedChartType)&&!svg}},{key:'_isTimeseries',value:function _isTimeseries(selectedChartType){return selectedChartType==='px-vis-timeseries'}},{key:'_canMultiY',value:function _canMultiY(selectedChartType){return selectedChartType==='px-vis-timeseries'||selectedChartType==='px-vis-xy-chart'}},{key:'_canChartExtents',value:function _canChartExtents(selectedChartType){return selectedChartType!=='px-vis-parallel-coordinates'&&selectedChartType!=='px-vis-polar'}},{key:'_createChart',value:function _createChart(){var data=this.$.dataSetDropdown.selectedKey.data,extents=this.$.dataSetDropdown.selectedKey.extents;if(this.$.dataSetDropdown.selectedKey==='dummy'){console.log('No data selected, please generate data for '+this.selectedChartType);return}if(data){this._drawingCounter=0;this._drawingsPerChart=this._getNumberOfDrawingPerCharts(data);this._drawingNumberOfCharts=this.$.chartNumber.value;this._drawingTimerName='draw '+this._drawingNumberOfCharts+' '+this.selectedChartType;var newDiv=document.createElement('div'),newChart;newDiv.classList.add('divwrapper');Polymer.dom(this.$.chartHolder).appendChild(newDiv);for(var i=0;i<this._drawingNumberOfCharts;i++){if(this.$.reuse.checked){if(this.chartPool[this.selectedChartType].length){newChart=this.chartPool[this.selectedChartType].pop()}else{console.log('failed to reuse '+this.selectedChartType+' from chartPool, none available');newChart=document.createElement(this.selectedChartType)}}else{newChart=document.createElement(this.selectedChartType)}newChart.preventResize=this._chartOptions.preventResize;if(!newChart.preventResize){newChart.height=this._chartOptions.height}if(newChart.preventResize){newChart.height=this._chartOptions.height;newChart.width=this._chartOptions.width}newChart.debounceResizeTiming=this._chartOptions.resizeDebounce;this._processOptions(newChart,extents,data);newChart.chartData=data;if(this._chartOptions.customToolbar){var newConf={};newConf.config={};if(newChart.toolbarConfig){var keys=Object.keys(newChart.toolbarConfig.config);for(var j=0;j<keys.length;j++){newConf.config[keys[j]]=newChart.toolbarConfig.config[keys[j]]}}newConf.config.addSerie={'tooltipLabel':'Add a serie to the chart','title':'+1','onClick':this._addSerie,'onClickContext':this,'chart':newChart};newConf.config.removeSerie={'tooltipLabel':'Remove a serie from the chart','title':'-1','onClick':this._removeSerie,'onClickContext':this,'chart':newChart};newConf.config.modifyData={'tooltipLabel':'Changes the data for the current series','title':'~','onClick':this._changeData,'onClickContext':this,'chart':newChart};newConf.config.modifyDataAndSeries={'tooltipLabel':'Changes the data and the series','title':'~~','onClick':this._changeDataAndSeries,'onClickContext':this,'chart':newChart};newConf.config.addAndModify={'tooltipLabel':'Changes the data for the current series and add 1 series','title':'+1/~','onClick':this._addSerieAndModifyData,'onClickContext':this,'chart':newChart};newConf.config.removeAndModify={'tooltipLabel':'Changes the data for the current series and remove 1 series','title':'-1/~','onClick':this._removeSerieAndModifyData,'onClickContext':this,'chart':newChart};newChart.set('toolbarConfig',newConf)}Polymer.dom(newDiv).appendChild(newChart)}this._startPerfMeasure()}else{console.log('please select data')}}},{key:'_generateSeriesName',value:function _generateSeriesName(){return'y'+Math.floor(Math.random()*1000)}},{key:'_addSerieAndModifyData',value:function _addSerieAndModifyData(info){var numberOfSeries=Object.keys(info.chart.chartData[0]).length-2,seriesNames=Object.keys(info.chart.chartData[0]).filter(function(d,i){return d[0]==='y'}),data,seriesName=this._generateSeriesName();seriesNames.push(seriesName);data=this._generateData(info.chart.chartData.length,numberOfSeries+1,info.chart.nodeName.toLowerCase(),seriesNames);info.chart.set('chartData',data.key.data);this._addOneSerieFromConfig(info.chart,numberOfSeries,seriesName)}},{key:'_removeSerieAndModifyData',value:function _removeSerieAndModifyData(info){var data,seriesNames=Object.keys(info.chart.chartData[0]).filter(function(d,i){return d[0]==='y'});data=this._generateData(info.chart.chartData.length,Object.keys(info.chart.chartData[0]).length-3,info.chart.nodeName.toLowerCase(),seriesNames);var missing,keys=Object.keys(data.key.data[0]);for(var i=0;i<seriesNames.length;i++){if(!data.key.data[0][seriesNames[i]]){missing=seriesNames[i];break}}info.chart.set('chartData',data.key.data);this._deleteOneSerieFromConfig(info.chart,missing)}},{key:'_changeData',value:function _changeData(info){var data,seriesNames=Object.keys(info.chart.chartData[0]).filter(function(d,i){return d[0]==='y'});data=this._generateData(info.chart.chartData.length,Object.keys(info.chart.chartData[0]).length-2,info.chart.nodeName.toLowerCase(),seriesNames);info.chart.set('chartData',data.key.data)}},{key:'_changeDataAndSeries',value:function _changeDataAndSeries(info){var numberOfSeries=Object.keys(info.chart.chartData[0]).length-2,seriesNames=[],currentNames=Object.keys(info.chart.chartData[0]).filter(function(d,i){return d[0]==='y'}),data;for(var i=0;i<currentNames.length;i++){seriesNames.push(this._generateSeriesName())}data=this._generateData(info.chart.chartData.length,numberOfSeries,info.chart.nodeName.toLowerCase(),seriesNames);info.chart.set('chartData',data.key.data);if(info.chart.nodeName.toLowerCase()==='px-vis-timeseries'||info.chart.nodeName.toLowerCase()==='px-vis-xy-chart'){var newConf={};for(var i=0;i<numberOfSeries;i++){newConf[seriesNames[i]]=this._generateSeriesConfigXYTS(seriesNames[i].slice(1),false,info.chart.nodeName.toLowerCase()==='px-vis-timeseries',info.chart)}info.chart.set('seriesConfig',newConf)}else if(info.chart.nodeName.toLowerCase()==='px-vis-parallel-coordinates'||info.chart.nodeName.toLowerCase()==='px-vis-radar'){info.chart._computeAxes()}}},{key:'_removeSerie',value:function _removeSerie(info){var currentNames=Object.keys(info.chart.chartData[0]).filter(function(d,i){return d[0]==='y'}),seriesName=currentNames[currentNames.length-1];this._deleteOneSeriesData(info.chart.chartData,seriesName);this._deleteOneSerieFromConfig(info.chart,seriesName)}},{key:'_deleteOneSerieFromConfig',value:function _deleteOneSerieFromConfig(chart,seriesName){if(chart.nodeName.toLowerCase()==='px-vis-timeseries'||chart.nodeName.toLowerCase()==='px-vis-xy-chart'||chart.nodeName.toLowerCase()==='px-vis-polar'){var newConf={},confKeys=Object.keys(chart.seriesConfig);for(var i=0;i<confKeys.length;i++){if(seriesName!==confKeys[i]){newConf[confKeys[i]]=chart.seriesConfig[confKeys[i]]}}chart.set('seriesConfig',newConf)}else if(chart.nodeName.toLowerCase()==='px-vis-parallel-coordinates'||chart.nodeName.toLowerCase()==='px-vis-radar'){chart._computeAxes()}}},{key:'_addOneSerieFromConfig',value:function _addOneSerieFromConfig(chart,numberOfSeries,seriesName){if(chart.nodeName.toLowerCase()==='px-vis-timeseries'||chart.nodeName.toLowerCase()==='px-vis-xy-chart'||chart.nodeName.toLowerCase()==='px-vis-polar'){var newConf={},confKeys=Object.keys(chart.seriesConfig),isTS=chart.nodeName.toLowerCase()==='px-vis-timeseries';for(var i=0;i<confKeys.length;i++){newConf[confKeys[i]]=chart.seriesConfig[confKeys[i]]}if(chart.nodeName.toLowerCase()==='px-vis-polar'){newConf[seriesName]={'x':'x','y':seriesName,'yAxisUnit':'someUnit'}}else{newConf[seriesName]=this._generateSeriesConfigXYTS(seriesName.slice(1),false,isTS,chart)}chart.set('seriesConfig',newConf)}else if(chart.nodeName.toLowerCase()==='px-vis-parallel-coordinates'||chart.nodeName.toLowerCase()==='px-vis-radar'){chart._computeAxes()}}},{key:'_addSerie',value:function _addSerie(info){var numberOfSeries=Object.keys(info.chart.chartData[0]).length-2,seriesName=this._generateSeriesName();this._addOneSeriesData(info.chart.chartData,seriesName);this._addOneSerieFromConfig(info.chart,numberOfSeries,seriesName)}},{key:'_addOneSeriesData',value:function _addOneSeriesData(data,seriesName){var number=Object.keys(data[0]).length-2;for(var i=0;i<data.length;i++){if(i===0){data[i][seriesName]=Math.random()*(this._generateOptions.dataMax-this._generateOptions.dataMin)+this._generateOptions.dataMin}else{data[i][seriesName]=data[i-1][seriesName]+(Math.random()*2-1)*this._generateOptions.variance}}}},{key:'_deleteOneSeriesData',value:function _deleteOneSeriesData(data,seriesName){var number=Object.keys(data[0]).length-3;for(var i=0;i<data.length;i++){delete data[i][seriesName]}}},{key:'_generateSeriesConfigXYTS',value:function _generateSeriesConfigXYTS(numberId,useGenerationConfig,isTS,chart){var result={},seriesNumber,isMultiAxis=useGenerationConfig?this._chartOptions.multiAxis:Object.keys(chart.y).length>1,type;if(useGenerationConfig){seriesNumber=this._chartOptions.disableNav||!isTS?this._drawingsPerChart:this._drawingsPerChart/2;type=this._chartOptions.scatter?'scatter':'line'}else{var configKey=Object.keys(chart.seriesConfig);seriesNumber=Object.keys(chart.chartData[0]).length-2;type=chart.seriesConfig[configKey[0]].type}result={'x':isTS?'timeStamp':'x','y':'y'+numberId,'type':type,'yAxisUnit':'units','xAxisUnit':'units','markerSize':this._chartOptions.markerSize,'markerSymbol':this._chartOptions.markerSymbol,'markerScale':this._chartOptions.markerScale,'markerFillOpacity':this._chartOptions.markerFillOpacity,'markerStrokeOpacity':this._chartOptions.markerStrokeOpacity};if(isMultiAxis){var side;if(useGenerationConfig){side=numberId<seriesNumber/2?'left':'right'}else{side=chart.numLeftAxes===chart.numRightAxes?'left':'right'}result.axis={'id':'axis'+numberId,'number':numberId,'side':side}}return result}},{key:'_removeChart',value:function _removeChart(){var wrappers=Polymer.dom(this.root).querySelectorAll('.divwrapper'),lastWrap=wrappers[wrappers.length-1];if(lastWrap){if(this.$.reuse.checked){for(var i=0;i<lastWrap.children.length;i++){this.chartPool[lastWrap.children[i].nodeName.toLowerCase()].push(lastWrap.children[i])}}Polymer.dom(this.$.chartHolder).removeChild(lastWrap)}}},{key:'_moveChart',value:function _moveChart(){var wrappers=Polymer.dom(this.root).querySelectorAll('.divwrapper'),lastWrap=wrappers[wrappers.length-1];if(lastWrap){Polymer.dom(this.$.chartHolder).removeChild(lastWrap);setTimeout(function(){this._startPerfMeasure();Polymer.dom(this.$.chartHolder).appendChild(lastWrap)}.bind(this),500)}}},{key:'_startPerfMeasure',value:function _startPerfMeasure(){window.performance.clearMarks();window.performance.mark('start')}},{key:'_drawingListen',value:function _drawingListen(){this._drawingCounter++;if(this._drawingCounter%(this._drawingsPerChart*Number(this._drawingNumberOfCharts))===0){window.performance.mark('end');performance.clearMeasures();window.performance.measure('lastMeasure','start','end');var duration=window.performance.getEntriesByName('lastMeasure')[0].duration;console.log(this._drawingTimerName+': '+duration+' (average per chart: '+duration/Number(this._drawingNumberOfCharts)+')')}}},{key:'_getNumberOfDrawingPerCharts',value:function _getNumberOfDrawingPerCharts(data){switch(this.selectedChartType){case'px-vis-timeseries':var multiplier=this._chartOptions.disableNav?1:2;return multiplier*(Object.keys(data[0]).length-2);case'px-vis-xy-chart':return Object.keys(data[0]).length-2;case'px-vis-polar':return Object.keys(data[0]).length-2;case'px-vis-parallel-coordinates':return 1;case'px-vis-radar':return 1;case'px-vis-pie-chart':}}},{key:'_processOptions',value:function _processOptions(chart,extents,data){switch(this.selectedChartType){case'px-vis-timeseries':this._processOptionsTS(chart,extents,data);break;case'px-vis-xy-chart':this._processOptionsXY(chart,extents);break;case'px-vis-polar':this._processOptionsPolar(chart);break;case'px-vis-parallel-coordinates':this._processOptionsParallel(chart);break;case'px-vis-radar':this._processOptionsRadar(chart,extents);break;case'px-vis-pie-chart':}}},{key:'_processOptionsTS',value:function _processOptionsTS(chart,extents,data){var seriesConfig={},seriesNumber=this._chartOptions.disableNav?this._drawingsPerChart:this._drawingsPerChart/2;for(var i=0;i<seriesNumber;i++){seriesConfig['y'+i]=this._generateSeriesConfigXYTS(i,true,true)}chart.set('seriesConfig',seriesConfig);chart.set('renderToCanvas',this._chartOptions.canvas);if(chart.renderToCanvas){chart.noCanvasProgressiveRendering=this._chartOptions.noProgressiveRendering;chart.progressiveRenderingPointsPerFrame=this._chartOptions.pointsPerFrame;chart.progressiveRenderingMinimumFrames=this._chartOptions.minFrames}chart.toolbarConfig={'config':{'advancedZoom':true,'pan':true}};chart.hideRegister=this._chartOptions.hideRegister;if(this._chartOptions.includeChartExtents){chart.chartExtents=extents}else{chart.chartExtents={'x':['dynamic','dynamic'],'y':['dynamic','dynamic']}}chart.xAxisConfig={'title':'X','labelPosition':'center','orientation':'bottom'};chart.yAxisConfig={'title':'An Axis'};if(!this._chartOptions.multiAxis){chart.yAxisConfig.preventSeriesBar=true}if(this._chartOptions.addEvents){var step=(data[data.length-1].timeStamp-data[0].timeStamp)/this._chartOptions.eventsNumber,eventData=[];for(var i=0;i<this._chartOptions.eventsNumber;i++){eventData.push({'id':i,'time':data[0].timeStamp+step*(i+0.5),'label':this._chartOptions.eventsType})}chart.eventData=eventData;chart.eventConfig={'fa':{'color':'blue','icon':'fa-camera','type':'fa','offset':[0,0],'lineColor':'red','lineWeight':this._chartOptions.eventsNoLine?0:1,'enableTooltip':this._chartOptions.eventsNoTooltip?false:true},'unicode':{'color':'green','icon':'\uF015','type':'unicode','offset':[1,0],'lineWeight':this._chartOptions.eventsNoLine?0:1,'enableTooltip':this._chartOptions.eventsNoTooltip?false:true},'default':{'lineWeight':this._chartOptions.eventsNoLine?0:1,'enableTooltip':this._chartOptions.eventsNoTooltip?false:true}}}else{chart.eventData=[];chart.eventConfig={}}if(this._chartOptions.addThresholds){chart.thresholdData=[{'for':'series0','type':'max','value':8.4784},{'for':'series0','type':'min','value':-9.6531},{'for':'series0','type':'mean','value':0.330657585139331},{'for':'series1','type':'mean','value':2},{'for':'series1','type':'quartile','value':-3}];chart.thresholdConfig={'max':{'color':'red','dashPattern':'5,0','title':'MAX','showThresholdBox':true,'displayTitle':true}}}else{chart.thresholdData=[];chart.thresholdConfig={}}if(this._chartOptions.addDynamicMenus){chart.dynamicMenuConfig=[{'name':'Delete','action':'function(data) {var conf = this.seriesConfig;delete conf[data.additionalDetail.name];this.set("seriesConfig", {}); this.set("seriesConfig", conf);}','eventName':'delete','icon':'fa-trash'},{'name':'Bring To Front','action':'function(data) { this.set("serieToRedrawOnTop", data.additionalDetail.name);}','eventName':'bring-to-front','icon':'fa-arrow-up'}]}else{chart.dynamicMenuConfig=[]}chart.disableNavigator=this._chartOptions.disableNav}},{key:'_processOptionsXY',value:function _processOptionsXY(chart,extents){var seriesConfig={};for(var i=0;i<this._drawingsPerChart;i++){seriesConfig['y'+i]=this._generateSeriesConfigXYTS(i,true,false)}chart.hideRegister=this._chartOptions.hideRegister;chart.registerConfig={'forceDateTimeDisplay':'true'};chart.toolbarConfig={'config':{'advancedZoom':true,'pan':true}};chart.xAxisConfig={'title':'X','labelPosition':'center','orientation':'bottom'};chart.yAxisConfig={'title':'An Axis'};if(!this._chartOptions.multiAxis){chart.yAxisConfig.preventSeriesBar=true}chart.seriesConfig=seriesConfig;chart.margin={'top':'30','bottom':'60','left':'80','right':'100'};chart.timeData='timeStamp';if(this._chartOptions.includeChartExtents){chart.chartExtents=extents}else{chart.chartExtents={'x':['dynamic','dynamic'],'y':['dynamic','dynamic']}}chart.renderToCanvas=this._chartOptions.canvas;if(chart.renderToCanvas){chart.noCanvasProgressiveRendering=this._chartOptions.noProgressiveRendering;chart.progressiveRenderingPointsPerFrame=this._chartOptions.pointsPerFrame;chart.progressiveRenderingMinimumFrames=this._chartOptions.minFrames}if(this._chartOptions.addDynamicMenus){chart.dynamicMenuConfig=[{'name':'Delete','action':'function(data) { var conf = this.seriesConfig;  delete conf[data.additionalDetail.name]; this.set("seriesConfig", {}); this.set("seriesConfig", conf);}','eventName':'delete','icon':'fa-trash'},{'name':'Bring To Front','action':'function(data) { this.set("serieToRedrawOnTop", data.additionalDetail.name);}','eventName':'bring-to-front','icon':'fa-arrow-up'}]}else{chart.dynamicMenuConfig=[]}}},{key:'_processOptionsPolar',value:function _processOptionsPolar(chart){var seriesConfig={};for(var i=0;i<this._drawingsPerChart;i++){seriesConfig['y'+i]={'x':'x','y':'y'+i,'yAxisUnit':'someUnit'}}chart.hideRegister=this._chartOptions.hideRegister;chart.registerConfig={'forceDateTimeDisplay':'true'};chart.toolbarConfig={'config':{'crosshairWithOptions':true}};chart.height=800;chart.seriesConfig=seriesConfig;chart.useDegrees=true;chart.margin={'top':'0','bottom':'0','left':'10','right':'10'};chart.timeData='timeStamp';chart.renderToCanvas=this._chartOptions.canvas;if(chart.renderToCanvas){chart.noCanvasProgressiveRendering=this._chartOptions.noProgressiveRendering;chart.progressiveRenderingPointsPerFrame=this._chartOptions.pointsPerFrame;chart.progressiveRenderingMinimumFrames=this._chartOptions.minFrames}if(this._chartOptions.addDynamicMenus){chart.dynamicMenuConfig=[{'name':'Dummy','action':'function(data) { console.log("dummy")}','eventName':'delete','icon':'fa-trash'}]}else{chart.dynamicMenuConfig=[]}}},{key:'_processOptionsParallel',value:function _processOptionsParallel(chart){chart.generateAxesFromData=true;chart.matchTicks=true;chart.seriesKey='timeStamp';chart.skipKeys={'x':true,'timeStamp':true};chart.renderToSvg=this._chartOptions.rendToSvg;chart.noCanvasProgressiveRendering=this._chartOptions.noProgressiveRendering;chart.progressiveRenderingPointsPerFrame=this._chartOptions.pointsPerFrame;chart.progressiveRenderingMinimumFrames=this._chartOptions.minFrames;chart.hideAxisRegister=this._chartOptions.hideRegister;if(this._chartOptions.addDynamicMenus){chart.dynamicMenuConfig=[{'name':'Dummy','action':'function(data) { console.log("dummy")}','eventName':'delete','icon':'fa-trash'}]}else{chart.dynamicMenuConfig=[]}}},{key:'_processOptionsRadar',value:function _processOptionsRadar(chart,extents){chart.generateAxesFromData=true;chart.matchTicks=true;chart.seriesKey='timeStamp';chart.skipKeys={'x':true,'timeStamp':true};chart.renderToSvg=this._chartOptions.rendToSvg;chart.noCanvasProgressiveRendering=this._chartOptions.noProgressiveRendering;chart.progressiveRenderingPointsPerFrame=this._chartOptions.pointsPerFrame;chart.progressiveRenderingMinimumFrames=this._chartOptions.minFrames;chart.hideAxisRegister=this._chartOptions.hideRegister;if(this._chartOptions.includeChartExtents){chart.chartExtents=extents}if(this._chartOptions.addDynamicMenus){chart.dynamicMenuConfig=[{'name':'Dummy','action':'function(data) { console.log("dummy")}','eventName':'delete','icon':'fa-trash'}]}else{chart.dynamicMenuConfig=[]}}},{key:'_processOptionsPie',value:function _processOptionsPie(chart){}},{key:'is',get:function get(){return'px-vis-demos-dynamic-add'}},{key:'properties',get:function get(){return{chartTypes:{type:Array,value:function value(){return[{'key':'px-vis-timeseries','val':'px-vis-timeseries'},{'key':'px-vis-xy-chart','val':'px-vis-xy-chart'},{'key':'px-vis-polar','val':'px-vis-polar'},{'key':'px-vis-radar','val':'px-vis-radar'},{'key':'px-vis-parallel-coordinates','val':'px-vis-parallel-coordinates'}]},readOnly:true},selectedChartType:{type:String},dataSets:{type:Object,value:function value(){return{'px-vis-timeseries':[{'key':'dummy','val':'PLEASE GENERATE DATA'}],'px-vis-xy-chart':[{'key':'dummy','val':'PLEASE GENERATE DATA'}],'px-vis-polar':[{'key':'dummy','val':'PLEASE GENERATE DATA'}],'px-vis-radar':[{'key':'dummy','val':'PLEASE GENERATE DATA'}],'px-vis-parallel-coordinates':[{'key':'dummy','val':'PLEASE GENERATE DATA'}]}}},chartPool:{type:Object,value:function value(){return{'px-vis-timeseries':[],'px-vis-xy-chart':[],'px-vis-polar':[],'px-vis-radar':[],'px-vis-parallel-coordinates':[],'px-vis-pie-chart':[]}}},_currentDataSets:{type:Array},_generateListener:{type:Function},_createListener:{type:Function},_removeListener:{type:Function},_drawingListener:{type:Function},_moveListener:{type:Function},_generateOptions:{type:Object,value:function value(){return{'startTime':571474800000,'endTime':Math.floor(Date.now()),'dataMin':-10,'dataMax':10,'variance':0.7,'counter':0,'randomise':false}}},_chartOptions:{type:Object,value:function value(){return{'scatter':false,'disableNav':false,'canvas':false,'progressiveRendering':false,'pointsPerFrame':16000,'minFrames':1,'addDynamicMenus':false,'addThresholds':false,'multiAxis':false,'rendToSvg':false,'resizeDebounce':250,'noProgressiveRendering':false,'width':800,'height':500,'preventResize':false,'customToolbar':false,'hideRegister':false,'includeChartExtents':false,'addEvents':false,'eventsNumber':4,'eventsType':'unicode','eventsNoLine':false,'eventsNoTooltip':false,'markerSize':64,'markerSymbol':'circle','markerScale':1,'markerFillOpacity':0.6,'markerStrokeOpacity':1}}},_drawingCounter:{type:Number,value:0},_drawingsPerChart:{type:Number,value:0},_drawingNumberOfCharts:{type:Number,value:0},_drawingTimerName:{type:String}}}},{key:'observers',get:function get(){return['_computeCurrentDataSets(selectedChartType, dataSets.*)']}}]);return pxVisDemosDynamicAdd}();Polymer(pxVisDemosDynamicAdd)})();
//# sourceMappingURL=px-vis-demos-dynamic-add.js.map
