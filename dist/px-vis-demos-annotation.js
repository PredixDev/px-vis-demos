'use strict';(function(){Polymer({is:'px-vis-demos-annotation',properties:{currentChart:{type:Object},isRadarParallel:{type:Boolean,value:false},_seriesFound:{type:String},annotationValue:{type:Array},allCharts:{type:Array},annotationText:{type:String,value:''},_lockTooltip:{type:Boolean,value:false},_currentDataEdit:{type:Object},_editAction:{type:String,value:'cancel'},editMode:{type:Boolean,value:false},_readableValues:{type:String,computed:'_computeReadableValue(annotationValue, currentChart)'}},attached:function attached(){this.allCharts=[];this.allCharts.push(this.$.timeseries);this.allCharts.push(this.$.xy);this.allCharts.push(this.$.polar);this.allCharts.push(this.$.radar);this.allCharts.push(this.$.para);this.allCharts.forEach(function(element){element.addEventListener('px-vis-annotation-creation',this.createAnnotation.bind(this));element.addEventListener('px-vis-annotation-enter',this.showAnnotation.bind(this));element.addEventListener('px-vis-annotation-leave',this.hideAnnotation.bind(this));element.addEventListener('px-vis-annotation-click',this.editAnnotation.bind(this));var old=JSON.parse(JSON.stringify(element.toolbarConfig));old.config.customAnnotations={'tooltipLabel':'Annotations','icon':'px-vis:comment','cursorIcon':'px-vis:comment','buttonGroup':1,'onClick':function onClick(){this.set('_internalShowTooltip',false);this.set('showStrongIcon',true);this.set('interactionSpaceConfig.searchType','closestPoint');this.set('interactionSpaceConfig.searchFor','point')},'onDeselect':function onDeselect(){this.set('showStrongIcon',false);this.set('interactionSpaceConfig.searchFor','timestamp')},'actionConfig':{'mouseout':'resetTooltip','mousemove':'calcTooltipData','mousedown':'null','click':function click(evt){this.fire('px-vis-event-request',{'eventName':'px-vis-annotation-creation','data':{'mouseCoords':evt.mouseCoords,'clickTarget':evt.target,'chart':this}})},'mouseup':'null'},'subConfig':{'hideAnnotations':{'tooltipLabel':'Hide Annotations','icon':'px-vis:hide','buttonGroup':1,'toggle':true,'onClick':'function(button) {this.$$("px-vis-annotations").set("hide", button.selected);}'}}};element.set('toolbarConfig',old)},this);this.$.modal.addEventListener('px-modal-accepted',this.modalClose.bind(this));this.$.tooltip.addEventListener('px-tooltip-hide',this._tooltipHide.bind(this));this.$.ttContent.addEventListener('tooltip-content-save',this._saveEdit.bind(this));this.$.ttContent.addEventListener('tooltip-content-delete',this._deleteEdit.bind(this));this.$.ttContent.addEventListener('tooltip-content-cancel',this._cancelEdit.bind(this))},createAnnotation:function createAnnotation(evt){this.currentChart=evt.detail.data.chart;this.isRadarParallel=this.currentChart.nodeName==='PX-VIS-PARALLEL-COORDINATES'||this.currentChart.nodeName==='PX-VIS-RADAR';var mousePos=evt.detail.data.mouseCoords;if(this.isRadarParallel){this.set('_seriesFound',this.currentChart.tooltipData.series[0].name);this.annotationValue=[this._seriesFound,this.currentChart.tooltipData.series[0].value[this._seriesFound]]}else{var val;this.currentChart.tooltipData.series.forEach(function(elem){if(Object.keys(elem.value).length>0){val=elem}});this.set('_seriesFound',val.name);this.annotationValue=[val.value[this.currentChart.completeSeriesConfig[this._seriesFound].x],val.value[this.currentChart.completeSeriesConfig[this._seriesFound].y]]}this.$.modal.set('opened',true)},showAnnotation:function showAnnotation(evt){if(!this._lockTooltip){this.$.ttContent.annotationMessage=evt.detail.data.annotationData.data.message;this.set('_ttTarget',evt.detail.data.icon);this.$.tooltip.set('opened',true)}},hideAnnotation:function hideAnnotation(evt){if(!this._lockTooltip){this.$.tooltip.set('opened',false)}},editAnnotation:function editAnnotation(evt){this._lockTooltip=true;this.set('editMode',true);this.$.ttContent.forceTemplateRender();this.$.tooltip.setPosition();this._currentDataEdit=evt.detail.data.annotationData;this.currentChart=Polymer.dom(evt).localTarget},modalClose:function modalClose(evt){var newData;newData={x:this.annotationValue[0],y:this.annotationValue[1],data:{message:this.$.modalText.value.trim()},series:this._seriesFound};this.currentChart.push('annotationData',newData);this.$.modalText.value=''},_saveEdit:function _saveEdit(evt){this._editAction='save';this._closeEdit()},_cancelEdit:function _cancelEdit(evt){this._editAction='cancel';this._closeEdit()},_deleteEdit:function _deleteEdit(evt){this._editAction='delete';this._closeEdit()},_closeEdit:function _closeEdit(){this.$.tooltip.set('opened',false);this.set('editMode',false);this._lockTooltip=false},_tooltipHide:function _tooltipHide(){var index;if(this._editAction==='save'){index=this.currentChart.annotationData.indexOf(this._currentDataEdit);this.currentChart.annotationData[index].data.message=this.$.ttContent.annotationMessage}else if(this._editAction==='delete'){index=this.currentChart.annotationData.indexOf(this._currentDataEdit);this.currentChart.splice('annotationData',index,1)}this._editAction='none'},_computeReadableValue:function _computeReadableValue(annotationValue,currentChart){if(annotationValue===undefined||currentChart===undefined||annotationValue.length===0){return}if(currentChart.nodeName==='PX-VIS-TIMESERIES'){return'['+Px.moment(annotationValue[0]).format()+', '+annotationValue[1].toFixed(2)+']'}else if(this.isRadarParallel){return'['+annotationValue[1].toFixed(2)+']'}else{return'['+annotationValue[0].toFixed(2)+', '+annotationValue[1].toFixed(2)+']'}}})})();
//# sourceMappingURL=px-vis-demos-annotation.js.map