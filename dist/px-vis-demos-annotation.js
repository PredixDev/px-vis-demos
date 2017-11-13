'use strict';(function(){Polymer({is:'px-vis-demos-annotation',properties:{currentChart:{type:Object},isRadarParallel:{type:Boolean,value:false},currentDimension:{type:String},mousePos:{type:Array},allCharts:{type:Array},dropdownSeries:{type:Array},dropdownDisplayValue:{type:String},dropdownSelected:{type:String},annotationText:{type:String,value:''},_lockTooltip:{type:Boolean,value:false},_currentDataEdit:{type:Object},_editAction:{type:String,value:'cancel'},editMode:{type:Boolean,value:false}},attached:function attached(){this.allCharts=[];this.allCharts.push(this.$.timeseries);this.allCharts.push(this.$.xy);this.allCharts.push(this.$.polar);this.allCharts.push(this.$.radar);this.allCharts.push(this.$.para);this.allCharts.forEach(function(element){element.addEventListener('px-vis-annotation-creation',this.createAnnotation.bind(this));element.addEventListener('px-vis-annotation-enter',this.showAnnotation.bind(this));element.addEventListener('px-vis-annotation-leave',this.hideAnnotation.bind(this));element.addEventListener('px-vis-annotation-click',this.editAnnotation.bind(this))},this);this.$.modal.addEventListener('btnModalPositiveClicked',this.modalClose.bind(this));this.$.tooltip.addEventListener('px-tooltip-hide',this._tooltipHide.bind(this));this.$.ttContent.addEventListener('tooltip-content-save',this._saveEdit.bind(this));this.$.ttContent.addEventListener('tooltip-content-delete',this._deleteEdit.bind(this));this.$.ttContent.addEventListener('tooltip-content-cancel',this._cancelEdit.bind(this))},createAnnotation:function createAnnotation(evt){this.currentChart=evt.detail.data.chart;this.isRadarParallel=this.currentChart.nodeName==='PX-VIS-PARALLEL-COORDINATES'||this.currentChart.nodeName==='PX-VIS-RADAR';if(this.isRadarParallel){var axis=evt.detail.data.clickTarget.parentElement;this.set('currentDimension',axis.getAttribute('dimension'))}else{var keys=Object.keys(this.currentChart.completeSeriesConfig);this.set('dropdownSeries',keys);this.set('dropdownDisplayValue',keys[0])}this.mousePos=evt.detail.data.mouseCoords;this.$.modal.modalButtonClicked()},showAnnotation:function showAnnotation(evt){if(!this._lockTooltip){this.$.ttContent.annotationMessage=evt.detail.data.annotationData.data.message;this.set('_ttTarget',evt.detail.data.icon);this.$.tooltip.set('opened',true)}},hideAnnotation:function hideAnnotation(evt){if(!this._lockTooltip){this.$.tooltip.set('opened',false)}},editAnnotation:function editAnnotation(evt){this._lockTooltip=true;this.set('editMode',true);this.$.ttContent.forceTemplateRender();this.$.tooltip.setPosition();this._currentDataEdit=evt.detail.data.annotationData;this.currentChart=Polymer.dom(evt).localTarget},modalClose:function modalClose(evt){var seriesFound,val,newData;if(this.isRadarParallel){seriesFound=this.currentDimension}else{seriesFound=this.dropdownSelected?this.dropdownSelected:this.dropdownDisplayValue}val=this.currentChart.getDataFromPixel(this.mousePos,seriesFound);newData={x:val[0],y:val[1],data:{message:this.$.modalText.value.trim()},series:seriesFound};this.currentChart.push('annotationData',newData);this.$.modalText.value=''},_saveEdit:function _saveEdit(evt){this._editAction='save';this._closeEdit()},_cancelEdit:function _cancelEdit(evt){this._editAction='cancel';this._closeEdit()},_deleteEdit:function _deleteEdit(evt){this._editAction='delete';this._closeEdit()},_closeEdit:function _closeEdit(){this.$.tooltip.set('opened',false);this.set('editMode',false);this._lockTooltip=false},_tooltipHide:function _tooltipHide(){var index;if(this._editAction==='save'){index=this.currentChart.annotationData.indexOf(this._currentDataEdit);this.currentChart.annotationData[index].data.message=this.$.ttContent.annotationMessage}else if(this._editAction==='delete'){index=this.currentChart.annotationData.indexOf(this._currentDataEdit);this.currentChart.splice('annotationData',index,1)}this._editAction='none'},_hideStyle:function _hideStyle(bool){if(bool){return'display:none'}else{return'display:block'}},_showStyle:function _showStyle(bool){if(!bool){return'display:none'}else{return'display:block'}}})})();
//# sourceMappingURL=px-vis-demos-annotation.js.map
