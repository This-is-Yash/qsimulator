function CreateToolBox() {
  // ✅ Handle both stringified and object gateJson
  var mydataExtended;
  try {
    if (typeof gateJson === "string") {
      console.log("📜 Parsing gateJson string...");
      mydataExtended = JSON.parse(gateJson);
    } else if (typeof gateJson === "object") {
      console.log("🧩 gateJson is object — using directly...");
      mydataExtended = gateJson;
    } else {
      throw new Error("❌ gateJson invalid type: " + typeof gateJson);
    }
  } catch (err) {
    console.error("🚨 Error loading gateJson:", err);
    return;
  }

  var mydata = mydataExtended.instructions || [];
  var $table = $("<table border='1px'/>");

  console.log("✅ Loading", mydata.length, "gates into toolbox.js");

  for (var i = 0; i < mydata.length; i++) {
    var gateObj = mydata[i];
    var $row = $("<tr/>");

    var gate1 = gateObj.name + ".png";
    var rowStr =
      '<td><img src="../../images/' +
      gate1 +
      '" id="' +
      gateObj.name +
      '" class="cloneAble" gate="' +
      gateObj.name +
      '" num_bits=' +
      gateObj.num_bits +
      " ctl_enabled=" +
      gateObj.ctl_enabled +
      " ctl_bits=" +
      gateObj.ctl_bits +
      " tgt_bits=" +
      gateObj.tgt_bits +
      " arg_enabled=" +
      gateObj.arg_enabled +
      " arg_value=" +
      gateObj.arg_value +
      " /></td>";

    $row.append(rowStr);
    $table.append($row);
  }

  // Append test div for visual verification
  var $testRow = $("<tr/>").append('<td><div id="testDiv"/></td>');
  $table.append($testRow);

  $("#toolboxDiv").append($table);

  // Draw a CNOT in testDiv for quick check
  cnot("testDiv");
  console.log("✅ Toolbox.js initialized completely.");
}
