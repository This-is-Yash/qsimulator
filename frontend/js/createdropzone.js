function CreateDropzone(){
    // Set reasonable defaults if not defined
    if (typeof numOfRowsInInterface === 'undefined' || numOfRowsInInterface < 2) {
        numOfRowsInInterface = 5; // Default to 5 qubits for multi-qubit operations
        console.log("⚙️ Initializing grid with default 5 qubits");
    }
    
    if (typeof numOfColsInInterface === 'undefined' || numOfColsInInterface < 10) {
        numOfColsInInterface = 20; // Default to 20 time steps
        console.log("⚙️ Initializing grid with default 20 columns");
    }

    var table = $('<table>').attr("id", "dropzonetable")
                            .attr("border", 0)
                            .attr("cellpadding", 1)
                            .attr("cellspacing", 0)
                            .attr("border-spacing", 0)
                            .css("vertical-align", "middle");

    console.log(`🔧 Creating grid: ${numOfRowsInInterface} qubits × ${numOfColsInInterface} columns`);

    for(var rowIndex = 0; rowIndex < numOfRowsInInterface; rowIndex++){
        var rowId = "row" + rowIndex;
        var row = $('<tr>').attr("id", rowId);
        
        for (var colIndex = 0; colIndex < numOfColsInInterface; colIndex++){
            var colId = rowId + "col" + colIndex;
            var col = $('<td>').attr("id", colId)
                             .css("max-height", 36)
                             .css("max-width", 36)
                             .css("padding", 0);
            
            var divId = colId + "div";
            var div = $('<div>').addClass("dropzone")
                              .attr("width", 36)
                              .attr("height", 36)
                              .attr("id", divId)
                              .attr("name", "")
                              .attr("rowId", rowIndex)
                              .attr("columnId", colIndex)
                              .attr("gate", "")
                              .attr("num_bits", "")
                              .attr("ctl_enabled", "")
                              .attr("ctl_bits", "")
                              .attr("tgt_bits", "")
                              .attr("arg_enabled", 0)
                              .attr("arg_value", 0);
            
            col.append(div);
            row.append(col);
        }
        
        table.append(row);
    }
    
    $('#dropzoneDiv').append(table);
    
    // Update global num_qubits if header exists
    if (typeof header !== 'undefined') {
        header.num_qubits = numOfRowsInInterface;
    }
    
    console.log(`✅ Grid created successfully: ${numOfRowsInInterface} qubits ready`);
}

// Helper function to add more qubits dynamically
function AddQubitRow() {
    var table = $('#dropzonetable');
    if (!table.length) {
        console.error("❌ Dropzone table not found");
        return;
    }
    
    var currentRows = table.find('tr').length;
    var rowIndex = currentRows;
    var rowId = "row" + rowIndex;
    var row = $('<tr>').attr("id", rowId);
    
    var numCols = numOfColsInInterface || 20;
    
    for (var colIndex = 0; colIndex < numCols; colIndex++){
        var colId = rowId + "col" + colIndex;
        var col = $('<td>').attr("id", colId)
                         .css("max-height", 36)
                         .css("max-width", 36)
                         .css("padding", 0);
        
        var divId = colId + "div";
        var div = $('<div>').addClass("dropzone")
                          .attr("width", 36)
                          .attr("height", 36)
                          .attr("id", divId)
                          .attr("name", "")
                          .attr("rowId", rowIndex)
                          .attr("columnId", colIndex)
                          .attr("gate", "")
                          .attr("num_bits", "")
                          .attr("ctl_enabled", "")
                          .attr("ctl_bits", "")
                          .attr("tgt_bits", "")
                          .attr("arg_enabled", 0)
                          .attr("arg_value", 0);
        
        col.append(div);
        row.append(col);
    }
    
    table.append(row);
    numOfRowsInInterface = currentRows + 1;
    
    // Update header
    if (typeof header !== 'undefined') {
        header.num_qubits = numOfRowsInInterface;
    }
    
    // Re-attach droppable events to new cells
    if (typeof AttachDroppableEvents === 'function') {
        AttachDroppableEvents();
    }
    
    // Update input lines if function exists
    if (typeof AddInputLinesToGrid === 'function') {
        AddInputLinesToGrid();
    }
    
    console.log(`➕ Added qubit row ${rowIndex}. Total qubits: ${numOfRowsInInterface}`);
    return rowIndex;
}

// Helper function to remove the last qubit row
function RemoveQubitRow() {
    var table = $('#dropzonetable');
    if (!table.length) {
        console.error("❌ Dropzone table not found");
        return;
    }
    
    var currentRows = table.find('tr').length;
    
    if (currentRows <= 1) {
        alert("⚠️ Cannot remove the last qubit. At least 1 qubit is required.");
        return;
    }
    
    // Remove last row
    table.find('tr:last').remove();
    numOfRowsInInterface = currentRows - 1;
    
    // Update header
    if (typeof header !== 'undefined') {
        header.num_qubits = numOfRowsInInterface;
    }
    
    // Update input lines if function exists
    if (typeof AddInputLinesToGrid === 'function') {
        AddInputLinesToGrid();
    }
    
    console.log(`➖ Removed qubit row. Total qubits: ${numOfRowsInInterface}`);
}