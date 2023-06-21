/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.0952380952381, "KoPercent": 9.904761904761905};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.05880952380952381, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0425, 500, 1500, "PUT - Change Data Product By ID"], "isController": false}, {"data": [0.015, 500, 1500, "POST - Create Product"], "isController": false}, {"data": [0.0, 500, 1500, "PUT - Accepted Offers Product"], "isController": false}, {"data": [0.0825, 500, 1500, "GET - Offers Product"], "isController": false}, {"data": [0.155, 500, 1500, "GET - List Category"], "isController": false}, {"data": [0.085, 500, 1500, "DELETE - Product By ID"], "isController": false}, {"data": [0.0, 500, 1500, "PUT - Accepted Offers Product-1"], "isController": false}, {"data": [0.11, 500, 1500, "PUT - Accepted Offers Product-0"], "isController": false}, {"data": [0.0325, 500, 1500, "POST - Sign Up"], "isController": false}, {"data": [0.09, 500, 1500, "GET - Profile"], "isController": false}, {"data": [0.055, 500, 1500, "POST - Sign In Buyer"], "isController": false}, {"data": [0.0525, 500, 1500, "GET - List Product By ID"], "isController": false}, {"data": [0.0525, 500, 1500, "POST - Create Product Delete"], "isController": false}, {"data": [0.045, 500, 1500, "POST - Offers Product"], "isController": false}, {"data": [0.05, 500, 1500, "GET - List Product"], "isController": false}, {"data": [0.1, 500, 1500, "POST - Sign In"], "isController": false}, {"data": [0.1625, 500, 1500, "GET - List Category By ID"], "isController": false}, {"data": [0.0025, 500, 1500, "PUT - Profile"], "isController": false}, {"data": [0.01, 500, 1500, "POST - Sign Up Buyer"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4200, 416, 9.904761904761905, 3563.529761904765, 30, 22732, 3491.5, 5761.9, 6491.0, 7735.99, 5.932857009670556, 11.845134973379835, 303.4491995697443], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT - Change Data Product By ID", 200, 0, 0.0, 4007.980000000002, 516, 7736, 4034.0, 5757.7, 6245.95, 6962.280000000004, 0.2887402838894471, 0.5227369326072959, 61.19967053831295], "isController": false}, {"data": ["POST - Create Product", 200, 0, 0.0, 3676.88, 721, 5763, 3685.5, 4981.900000000001, 5217.549999999998, 5725.93, 0.2890566059551442, 0.5238445278332606, 61.26415598271297], "isController": false}, {"data": ["PUT - Accepted Offers Product", 200, 200, 100.0, 5080.680000000003, 243, 9008, 5477.0, 7232.8, 7512.75, 8255.450000000003, 0.2912636912138851, 0.4533075631714538, 0.5386415670787562], "isController": false}, {"data": ["GET - Offers Product", 200, 0, 0.0, 2799.624999999999, 36, 5701, 2996.0, 4027.8, 4422.799999999999, 5261.88, 0.29095352744782843, 0.35460245292008236, 0.25417802446191784], "isController": false}, {"data": ["GET - List Category", 200, 0, 0.0, 2379.8150000000014, 130, 5674, 2278.0, 3776.3, 4263.15, 5274.88, 0.2944332968726768, 0.30765979263062904, 0.25515347979672326], "isController": false}, {"data": ["DELETE - Product By ID", 200, 0, 0.0, 2991.695, 303, 6663, 3013.0, 4292.0, 4713.45, 5469.330000000003, 0.2897005654955038, 0.2826843799249096, 0.27222517103197136], "isController": false}, {"data": ["PUT - Accepted Offers Product-1", 200, 200, 100.0, 2508.1449999999995, 30, 5502, 2707.5, 3782.0, 4288.9, 5212.430000000004, 0.2918941008202224, 0.10575460098076418, 0.25760224503050294], "isController": false}, {"data": ["PUT - Accepted Offers Product-0", 200, 0, 0.0, 2572.335000000001, 38, 5020, 2723.0, 3759.7, 4256.0, 4928.350000000001, 0.29135916135178996, 0.3478953579930016, 0.28168797200184137], "isController": false}, {"data": ["POST - Sign Up", 200, 8, 4.0, 4374.529999999999, 777, 7771, 4519.0, 6243.7, 6777.95, 7755.840000000003, 0.2964460564522225, 0.49379546509792355, 0.218269988987029], "isController": false}, {"data": ["GET - Profile", 400, 0, 0.0, 2799.604999999999, 83, 5711, 2762.0, 4220.6, 4748.95, 5515.89, 0.5697153559652759, 0.7035317010988384, 0.49251169251750093], "isController": false}, {"data": ["POST - Sign In Buyer", 200, 0, 0.0, 3216.4149999999986, 232, 6512, 3260.0, 4645.200000000001, 5392.299999999998, 6470.780000000004, 0.2888470381624707, 0.4971257801577971, 0.22020637579288513], "isController": false}, {"data": ["GET - List Product By ID", 200, 0, 0.0, 3116.1599999999994, 541, 6209, 3245.5, 4269.8, 4816.149999999999, 5527.4800000000005, 0.2887298628966246, 0.5045356980188801, 0.2504872542006586], "isController": false}, {"data": ["POST - Create Product Delete", 200, 0, 0.0, 3520.834999999999, 453, 5781, 3701.0, 5001.2, 5228.0, 5745.79, 0.28988364070662037, 0.5252159361357351, 61.43947315641252], "isController": false}, {"data": ["POST - Offers Product", 200, 0, 0.0, 3425.5650000000014, 241, 7483, 3580.0, 4747.0, 5250.8, 5936.240000000002, 0.2899815716711203, 0.7703060275207011, 0.291088825523888], "isController": false}, {"data": ["GET - List Product", 200, 0, 0.0, 4040.6649999999986, 544, 8234, 4212.0, 5500.4, 5960.199999999997, 7677.160000000002, 0.2889121302647013, 3.705553408025546, 0.24975099385772812], "isController": false}, {"data": ["POST - Sign In", 200, 0, 0.0, 2581.4049999999993, 166, 6995, 2516.5, 3989.9, 4234.0, 5910.460000000006, 0.2954663641091098, 0.508324776350429, 0.22348683364948235], "isController": false}, {"data": ["GET - List Category By ID", 200, 0, 0.0, 2304.7049999999995, 104, 5262, 2440.5, 3741.8, 4223.549999999997, 5195.8, 0.2934410066200291, 0.20890477912695432, 0.2548666961697145], "isController": false}, {"data": ["PUT - Profile", 400, 0, 0.0, 5754.175000000002, 1280, 22732, 5767.5, 7255.7, 7765.2, 8617.1, 0.5687958591661453, 0.8405041975356919, 120.44216906968104], "isController": false}, {"data": ["POST - Sign Up Buyer", 200, 8, 4.0, 5129.130000000001, 1037, 8968, 5269.5, 6931.300000000001, 7641.049999999998, 8886.680000000004, 0.2884966296381243, 0.4807934383064382, 0.22550068590073696], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 400, 96.15384615384616, 9.523809523809524], "isController": false}, {"data": ["401/Unauthorized", 16, 3.8461538461538463, 0.38095238095238093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4200, 416, "406/Not Acceptable", 400, "401/Unauthorized", 16, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT - Accepted Offers Product", 200, 200, "406/Not Acceptable", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT - Accepted Offers Product-1", 200, 200, "406/Not Acceptable", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST - Sign Up", 200, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST - Sign Up Buyer", 200, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
