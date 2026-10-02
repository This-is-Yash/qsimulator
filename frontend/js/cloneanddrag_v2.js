
/// ==========================================================
// ✅ BarcQ Drag & Drop Logic (Final Revision with Visibility Fallback)
//// ==========================================================
// ==========================================================
// ==========================================================
function MakeCloneAble(){
$(".cloneAble").click(function(){
  	var posx="150px";
  	var posy="1px";
  	/*var idOfDroppable=$(this).attr("id");
    var newid=idOfDroppable+dropableCounter;
    dropableCounter++;*/
    
  	//var numOfBits=$(this).attr("num_bits");
  	/*$(this).clone().attr("id",newid)
                 .addClass("draggableComp")
                 .appendTo("body")
                 .addClass("circuit");
      $("#"+newid).css("position","fixed");
                 */
    CloneIt($(this).attr("id"),"clonedElement");
  	//$("#"+newid).css("left",posx);
  	//$("#"+newid).css("top",posy);

  	/*AttachDraggableEvents();
    AttachDroppableEvents();*/
  });
}

/*
** Function just to create the clone based on the ID of the object to be
** cloned.
** 
** Created as a separate function because it is required while creating
** a new circuit and also to load the previously stored circuit
*/
function CloneIt(objId,parent="body"){
  console.log("ObjID from CloneIt : "+objId+" : TagName : "+$("#"+objId).prop("tagName"));
  dropableCounter++;
  var idOfDroppable=objId;
  var newid=idOfDroppable+dropableCounter;
  console.log("CloneIt called and created new id is "+newid);
   $("#"+objId).children().clone().attr("id",newid)
               .addClass("draggableComp")
               .appendTo($("#"+parent))
               .addClass("circuit");
  
  //$("#"+newid).css("position","fixed");
  AttachDraggableEvents();
  AttachDroppableEvents();
}


/*function ModifyParentDiv(divId){
  $("#"+divId).attr("gate",$("#"+divId).children().attr("gate"));
}*/ 

//Basically modify parameters of divs
function ModifyParentDiv(obj,cellTobeMerged=1){
  console.log("ModifyParentDiv called.............");
  console.log("SVG ARG_VALUE  "+obj.children().attr("arg_value"));
  obj.attr("name",obj.children().attr("gate"));	
  obj.attr("gate",obj.children().attr("gate"));
  obj.attr("num_bits",obj.children().attr("num_bits"));
  obj.attr("ctl_enabled",obj.children().attr("ctl_enabled"));
  obj.attr("ctl_bits",obj.children().attr("ctl_bits"));
  obj.attr("tgt_bits",obj.children().attr("tgt_bits"));
  obj.attr("arg_enabled",obj.children().attr("arg_enabled"));
  obj.attr("arg_value",obj.children().attr("arg_value"));
  
  var numOfBits=parseInt(obj.children().attr("num_bits"));
  console.log("Num of bits from ModifyParentDiv : "+numOfBits);
  if(cellTobeMerged>1){
      console.log("Num of bits : "+obj.attr("num_bits"));
      Merge(obj,cellTobeMerged);
  }
  //InsertConnector(obj.attr("id"),5);
}


function MouseEnterLeave(){
  $(".dropzone").on('mouseenter',function(){
    $(this).css('background', 'orange');
  });

  $(".dropzone").on('mouseleave',function(){
    $(this).css('background', 'white');
  });
}


function InputArg() {
  var txt;
  var argVal = prompt("Please enter your value :", 1.57);
  console.log("Entered value : "+argVal);
  
}

function Attach(obj){
	obj.on('mousedown',function(event){
		if(event.which == 2){
			
			if(obj.attr("arg_enabled")==1){
				var argVal = prompt("Please enter your value :", 1.57);
				console.log("Need to set arg_val of "+obj.attr("id")+ " to "+argVal);
			    obj.attr("arg_value",argVal);
			    ModifyParentDiv(obj.parent());
          GenerateCode();
			}

		}  
	});
}


function MakeDraggable(obj){
	obj.draggable();
}

/*
 * Ideally this should be called only for the toolbox 
 * and hence can be called only once, when the toolbox
 * is ready. 
 * 
 * But it should not attach anything else.
 */
  
function AttachDraggableEvents(){
 // AttachSelectAndDelete();
	
/*
	$('.draggableComp').on('mouseup',function(event){
		//alert("Mouse up called.........");
	    //$(".dropzone").css('background', 'transparent');
	});

	$(".draggableComp").draggable({ appendTo: "body"});
    $('.draggableComp').on('mousedown',function(event){
    	$(this).draggable( 'option', 'revert', false );
    });
*/
	 $(".toolbox .cloneAble").draggable({

        helper: 'clone',

        appendTo: 'body' // this makes the cloned object to be moved with cursor otherwise the object with move with some offset with cursor


    });

  
  $(".dropzone").on('mouseenter',function(){
    //$(this).css('background', 'orange');
  });

  $(".dropzone").on('mouseleave',function(){
   // $(this).css('background', 'transparent');
  });
  
  $(".dropzone").on('mouseup',function(){
    $(this).css('background', 'transparent');
  });
  

  /*$(".dropzone").on('mouseout',function(){
    $(".dropzone").css('background', 'white');
  });*/

	$( ".nondropzone" ).droppable({ 
        drop :function(event,ui) {   
            ui.draggable.draggable( 'option', 'revert', true ); 
            ui.draggable.css("position","relative");
        }
    });
}
function SetControlAndTargetBitsForUserDefinedGate(objid, rowid) {
    var ctlbits = []; //to set in html
    var tgtbits = [];
    var cbits = [];// to get the bit detail of item to be dragged
    var tbits = [];

    cbits = $("#" + objid).attr("ctl_bits").split(",");
    tbits = $("#" + objid).attr("tgt_bits").split(",");
    var cellBetweenControlAndTarget;




    if (cbits[0] < tbits[0]) {
        cellBetweenControlAndTarget = tbits[0] - cbits[cbits.length - 1];

        for (var bitnum = 0; bitnum < cbits.length; bitnum++) {
            ctlbits.push(rowid);
            if (bitnum == cbits.length - 1)
                break;
            rowid = rowid + parseInt(cbits[bitnum + 1] - cbits[bitnum]);

        }

        rowid = rowid + cellBetweenControlAndTarget;
       // alert(cellBetweenControlAndTarget + " " + rowid);
        for (var bitnum = 0; bitnum < tbits.length; bitnum++) {
            tgtbits.push(rowid);
            if (bitnum == tbits.length - 1)
                break;
            rowid = rowid + parseInt(tbits[bitnum + 1] - tbits[bitnum]);
        }

    }
    if (cbits[0] > tbits[0]) {
        cellBetweenControlAndTarget = cbits[0] - tbits[tbits.length - 1];
        for (var bitnum = 0; bitnum < tbits.length; bitnum++) {
            tgtbits.push(rowid);
            if (bitnum == tbits.length - 1)
                break;
            rowid = rowid + parseInt(tbits[bitnum + 1] - tbits[bitnum]);
        }
        rowid = rowid + cellBetweenControlAndTarget;
        for (var bitnum = 0; bitnum < cbits.length; bitnum++) {
            ctlbits.push(rowid);
            if (bitnum == cbits.length - 1)
                break;
            rowid = rowid + parseInt(cbits[bitnum + 1] - cbits[bitnum]);
        }




    }
    $("#" + objid).attr("ctl_bits", ctlbits);
    $("#" + objid).attr("tgt_bits", tgtbits);
}
/*
** Function to set the control and target bits.
**
** WARNING
** -------
** This needs to be modified whenever a new gate is 
** introduced in the framework
*/
function SetControlAndTargetBits(objid,rowid,numofbits){
  ctlbits=[];
  tgtbits=[];
  if(parseInt($("#"+objid).attr("ctl_enabled"))!=0){
    /*
    ** This block is for control enabled gates
    ** Useful for CNOT, CCNOT.
    ** This needs to be modified whenever a new gate is 
    ** introduced in the framework
    */
    if(numofbits==2){
    for(var bitnum=0;bitnum<numofbits-1;bitnum++){
        ctlbits.push(rowid);
        rowid++;
    }
    tgtbits.push(rowid);
  }else{
    if(numofbits==3){
      if($("#"+objid).attr("gate")=="CCNOT"){
        ctlbits.push(rowid);
        rowid++;
        ctlbits.push(rowid);
        rowid++;
        tgtbits.push(rowid);
      }
      
      if($("#"+objid).attr("gate")=="CSWAP"){
        ctlbits.push(rowid);
        rowid++;
        tgtbits.push(rowid);
        rowid++;
        tgtbits.push(rowid);
      }
    }
  }
  }else{
    /*
    ** This block is for gates without control bits
    ** Useful for all single bit gate and SWAP gate
    */
    if(numofbits==1){
      ctlbits.push("None");
      tgtbits.push(rowid);
    }else{
        //For SWAP gate
        ctlbits.push("None");
        for(var bitnum=0;bitnum<numofbits;bitnum++){
          tgtbits.push(rowid);
          rowid++;
        }
      }
  }

  $("#"+objid).attr("ctl_bits",ctlbits);
  $("#"+objid).attr("tgt_bits",tgtbits);
}

function JsonToCode(){
  var input_lines=5;
  var code = "qutip_circuit=QubitCircuit("+input_lines+",reverse_states=False) <br/>";
  $("#qutipCode").append(code);

  gatesList=circuitJsonObj["instructions"]
  for(var index=0;index<gatesList.length;index++){
    var gatename=gatesList[index]["name"];
    if(gatename=="CCNOT")
      gatename="TOFFOLI";
    code="qutip_circuit.add_gate(Gate('"+gatename+"',controls=["+gatesList[index]["ctl_bits"]+"],targets=["+gatesList[index]["tgt_bits"]+"],arg_value="+gatesList[index]["arg_value"]+")) <br/>";
    $("#qutipCode").append(code);
  }

}

function GenerateCode(){
  $("#qutipCode").empty();
  $("#qutipCode").append(imports)
	GridToJson();
  JsonToCode();

}

function AttachDroppableEvents(){

$(".dropzone").droppable({
            drop: function(event, ui) {
			var itemToBeDropped = ui.draggable;
            var prevParentId = itemToBeDropped.parent().attr("id");
			var userDefined=itemToBeDropped.attr("user_defined");
            
			var noOfCellRequired;
			if(userDefined==="Y")
				noOfCellRequired=itemToBeDropped.attr("row_merged");
			else 
				noOfCellRequired=itemToBeDropped.attr("num_bits");
			
            /*
             * check whether div is empty before dropping to avoid overlapping
             */
            val = checkDivForEmpty($(this).attr('rowid'), $(this).attr('columnid'), noOfCellRequired);
            if (val == 0) { // which implies cells are not empty
                $(itemToBeDropped).removeAttr('style'); //this will revert item back 
                $(".dropzone").css('background', 'white');
                $(itemToBeDropped).attr("style", "position:relative"); //this is added to again make item draggable
                return;
            }

			
            if (ui.draggable.hasClass("cloneAble")) {
                dropableCounter++;
                var idOfDroppable = ui.draggable.attr('id');
                var newid = idOfDroppable + dropableCounter;
                itemToBeDropped = $(ui.helper).clone().attr('id', newid);
                console.log("CloneIt called and created new id is " + itemToBeDropped.attr('id'));
            }

            var colid = parseInt($(this).attr("columnid"))
            colIds.push(colid);
            var rowid = parseInt($(this).attr("rowid"));
            rowIds.push(rowid);
            //alert("me"+itemToBeDropped.attr("id"));
            //alert("$this"+$(this).attr("id"));
            //Attach(itemToBeDropped);
            $(this).append(itemToBeDropped);


			/* 
			 * Placement coordinate calculation
			 */ 
            var pos = $(this).position();
            posx = pos.left;
            posy = pos.top;
            var width = $(this).width();
            var height = $(this).height();
            var winWidth = ui.draggable.width();
            var winHeight = ui.draggable.height();
            var coords = "X coords: " + posx + ", Y coords: " + posy + ", Width : " + width + " , Height : " + height + ", WinstonWidth : " + winWidth + " , WinstonHeight : " + winHeight;
            //alert(coords);
            posx = posx + parseInt(width / 2) - parseInt(winWidth / 2);
            posy = posy + parseInt(height / 2) - parseInt(winHeight / 2);
            itemToBeDropped.css('left', posx);
            itemToBeDropped.css('top', posy);
            $(".dropzone").css('background', 'transparent');
            $(this).css("background", "yellow");
            var idOfDroppable = $(this).attr("id");
            $("#" + itemToBeDropped.attr("id")).attr("style", "position:relative;");


			/*
			 * Once the item is dropped in dropzone then it should be uncloneable
			 * Below logic did that.
			 */ 
            if (itemToBeDropped.hasClass("cloneAble")) {
                $(".dropzone .cloneAble").addClass("draggableComp");
                $(".dropzone  .draggableComp").removeClass("cloneAble ");
                //Removing the cloning functionality
                $(ui.helper).remove();

            }

            
            /*
             * Confining the dragging region for the draggable component
             * So that user will only be able to drag it within dropzone
             * 
             * Below logic did that.
             */
            $(".draggableComp").draggable({
                containment: "#dropzonetable"

            });
            
           if(userDefined==="Y")
				SetControlAndTargetBitsForUserDefinedGate(itemToBeDropped.attr("id"), rowid);
			else
				SetControlAndTargetBits(itemToBeDropped.attr("id"), rowid, itemToBeDropped.attr("num_bits"));
            var numOfBits = parseInt(itemToBeDropped.attr("num_bits"));
            console.log("Deleting SVG of div : " + $(this).attr("id"));
            $("#svg-" + $(this).attr("id")).remove();
            ModifyParentDiv($(this),noOfCellRequired);
            //if (prevParentId != "body") {
            if (prevParentId != itemToBeDropped.attr("gate")) {
				/*
				 * Merging cell occupied by the gate if the gate is dragged
				 * from one position in dropzone to other position within
				 * dropzone.
				 */ 
                console.log("Previous Parent ID for Drag : " + prevParentId)
                UnMergeCellsOnDrag(prevParentId);
            }
            else{
				/*
				 * Attaching select and delete event only if the item is dragged
				 * from toolbox and dropped in dropzone.
				 * 
				 * But if the item is already in the dropzone and its not required
				 * and the above "IF" block will execute
				 */
				AttachSelectAndDelete_v2(itemToBeDropped);	
				if(parseInt(itemToBeDropped.attr("num_bits")) > 1)
					AttachGenericControlPopup(itemToBeDropped);
				if(parseInt(itemToBeDropped.attr("arg_enabled")) == 1)
					AttachPhasePopupMiddleButton(itemToBeDropped);
					//AttachPhasePopup(itemToBeDropped);
				/*if(itemToBeDropped.attr("gate")=="QFT")
					AttachQFT(itemToBeDropped);*/
			}
			
            console.log("Previous Parent Div : " + prevParentId);
            //InsertConnector(prevParentId);
			//AttachSelectAndDelete();
			
			GenerateCode()
            },
            over: function(event, ui) {
                //event.preventDefault();
                $(this).css('background', 'orange');
            },
            out: function(event, ui) {
                //event.preventDefault();
                $(this).css('background', 'cyan');
            }

            
        });
}

// ==========================================================
// QSVM Algorithm Gate Configuration Popup
// Add this to your cloneanddrag_v2.js or create new file
// ==========================================================

// Store QSVM gate configurations globally
window.qsvmGateConfigs = {};

function openQSVMConfigPopup(gateId, row, col) {
  console.log(`⚙️ Opening QSVM config for gate at row ${row}, col ${col}`);
  
  // Remove existing popup
  $("#qsvmGateConfigPopup").remove();
  
  const popup = $(`
    <div id="qsvmGateConfigPopup" style="position:fixed;top:50%;left:50%;
      transform:translate(-50%,-50%);background:#fff;border:3px solid #6a0dad;
      padding:25px;z-index:10000;border-radius:12px;width:450px;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);">
      
      <h3 style="color:#6a0dad;margin-top:0;text-align:center;">
        ⚙️ Configure QSVM Gate
      </h3>
      
      <div style="background:#f5f0ff;padding:15px;border-radius:8px;margin-bottom:15px;">
        <label style="font-weight:600;display:block;margin-bottom:8px;">Dataset Source:</label>
        <select id="qsvmDatasetType" style="width:100%;padding:8px;border-radius:4px;">
          <option value="iris">🌸 Iris Dataset</option>
          <option value="wine">🍷 Wine Dataset</option>
          <option value="breast_cancer">🎗️ Breast Cancer Dataset</option>
          <option value="csv">📄 Upload CSV (Not supported in grid yet)</option>
        </select>
      </div>
      
      <div style="background:#f5f0ff;padding:15px;border-radius:8px;margin-bottom:15px;">
        <label style="font-weight:600;display:block;margin-bottom:8px;">Quantum Kernel:</label>
        <select id="qsvmKernelType" style="width:100%;padding:8px;border-radius:4px;">
          <option value="amplitude">Amplitude Encoding (RY)</option>
          <option value="angle">Angle Encoding (RX-RZ)</option>
          <option value="iqp">IQP Encoding</option>
          <option value="pauli">Pauli Feature Map</option>
          <option value="zz">ZZ Feature Map</option>
          <option value="polynomial">Polynomial Encoding</option>
        </select>
      </div>
      
      <div style="background:#f5f0ff;padding:15px;border-radius:8px;margin-bottom:15px;">
        <label style="font-weight:600;display:block;margin-bottom:8px;">Train/Test Split (%):</label>
        <input id="qsvmSplitRatio" type="number" min="10" max="90" value="70" 
               style="width:100%;padding:8px;border-radius:4px;border:1px solid #ccc;">
        <small style="color:#666;display:block;margin-top:5px;">
          Percentage of data used for training
        </small>
      </div>
      
      <div style="background:#fff3cd;padding:12px;border-radius:6px;margin-bottom:15px;border:1px solid #ffc107;">
        <p style="margin:0;font-size:13px;color:#856404;">
          💡 <strong>Note:</strong> This gate will run QSVM classification when the circuit executes.
        </p>
      </div>
      
      <div style="text-align:center;">
        <button id="confirmQSVMGate" style="background:#6a0dad;color:white;border:none;
                padding:12px 24px;border-radius:6px;cursor:pointer;font-weight:bold;
                margin-right:10px;">
          ✅ Confirm
        </button>
        <button id="cancelQSVMGate" style="background:#999;color:white;border:none;
                padding:12px 24px;border-radius:6px;cursor:pointer;">
          ❌ Cancel
        </button>
      </div>
    </div>
  `);
  
  $("body").append(popup);
  
  // Cancel handler
  $("#cancelQSVMGate").click(() => {
    popup.remove();
    console.log("❌ QSVM configuration cancelled");
  });
  
  // Confirm handler
  $("#confirmQSVMGate").click(() => {
    const config = {
      dataset: $("#qsvmDatasetType").val(),
      kernel_type: $("#qsvmKernelType").val(),
      split: parseFloat($("#qsvmSplitRatio").val()) / 100,
      row: row,
      col: col
    };
    
    console.log("✅ QSVM gate configured:", config);
    
    // Store configuration globally
    window.qsvmGateConfigs[gateId] = config;
    
    // Mark the gate as configured
    $(`#${gateId}`).attr("qsvm-configured", "true");
    $(`#${gateId}`).attr("qsvm-config", JSON.stringify(config));
    
    popup.remove();
    
    // Show confirmation
    const toast = $(`
      <div style="position:fixed;top:20px;right:20px;background:#4CAF50;color:white;
                  padding:15px 20px;border-radius:8px;z-index:10001;
                  box-shadow:0 4px 12px rgba(0,0,0,0.3);">
        ✅ QSVM gate configured with ${config.kernel_type} kernel on ${config.dataset}
      </div>
    `);
    $("body").append(toast);
    setTimeout(() => toast.fadeOut(300, () => toast.remove()), 3000);
  });
}

// Attach QSVM configuration to dropped gates
function AttachQSVMConfigPopup(gateObj) {
  if (!gateObj || gateObj.attr("gate") !== "QSVM") return;
  
  // Right-click to configure
  gateObj.on("contextmenu", function(event) {
    event.preventDefault();
    const parentDiv = $(this).parent();
    const row = parseInt(parentDiv.attr("rowid")) || 0;
    const col = parseInt(parentDiv.attr("columnid")) || 0;
    openQSVMConfigPopup($(this).attr("id"), row, col);
  });
  
  // Double-click alternative
  gateObj.on("dblclick", function(event) {
    event.preventDefault();
    const parentDiv = $(this).parent();
    const row = parseInt(parentDiv.attr("rowid")) || 0;
    const col = parseInt(parentDiv.attr("columnid")) || 0;
    openQSVMConfigPopup($(this).attr("id"), row, col);
  });
  
  console.log("🔗 QSVM configuration popup attached to gate");
}

// Modify AttachDroppableEvents to handle QSVM
const originalAttachDroppableEvents = window.AttachDroppableEvents;
window.AttachDroppableEvents = function() {
  if (originalAttachDroppableEvents) {
    originalAttachDroppableEvents();
  }
  
  // Add QSVM-specific handling
  $(".dropzone").on('drop', function(event, ui) {
    const itemToBeDropped = ui.draggable;
    const gateName = itemToBeDropped.attr("gate");
    
    if (gateName === "QSVM") {
      console.log("🔮 QSVM gate dropped - attaching config popup");
      
      setTimeout(() => {
        const droppedGate = $(this).find('[gate="QSVM"]');
        if (droppedGate.length) {
          AttachQSVMConfigPopup(droppedGate);
          
          // Auto-open config popup on first drop
          const row = parseInt($(this).attr("rowid")) || 0;
          const col = parseInt($(this).attr("columnid")) || 0;
          openQSVMConfigPopup(droppedGate.attr("id"), row, col);
        }
      }, 100);
    }
  });
};

console.log("✅ QSVM drag & drop configuration loaded");
