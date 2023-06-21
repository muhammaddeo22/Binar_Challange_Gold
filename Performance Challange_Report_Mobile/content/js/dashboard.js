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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03666666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST - Create Product for Delete"], "isController": false}, {"data": [0.0, 500, 1500, "POST - Create Product"], "isController": false}, {"data": [0.02, 500, 1500, "POST - Sign In Seller"], "isController": false}, {"data": [0.085, 500, 1500, "GET - See Order Product"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE - List Product By ID"], "isController": false}, {"data": [0.03, 500, 1500, "GET - Product List"], "isController": false}, {"data": [0.0325, 500, 1500, "POST - Sign In Buyer"], "isController": false}, {"data": [0.005, 500, 1500, "POST - Buy Product"], "isController": false}, {"data": [0.0125, 500, 1500, "GET - List Product By ID"], "isController": false}, {"data": [0.0075, 500, 1500, "POST - Sign Up Seller"], "isController": false}, {"data": [0.0225, 500, 1500, "GET - List Product"], "isController": false}, {"data": [0.1925, 500, 1500, "GET - Product List By ID"], "isController": false}, {"data": [0.115, 500, 1500, "GET - See Order Product by ID"], "isController": false}, {"data": [0.0225, 500, 1500, "PUT - Changes Order"], "isController": false}, {"data": [0.005, 500, 1500, "POST - Sign Up Buyer"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3000, 0, 0.0, 4416.362999999999, 247, 15803, 3725.0, 8492.7, 9987.9, 12719.98, 4.498277159847778, 3.105744093762089, 62.668615107913666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST - Create Product for Delete", 200, 0, 0.0, 6678.709999999998, 2471, 12460, 6722.5, 9466.3, 10442.75, 11275.58, 0.3200071681605668, 0.20969219710521517, 32.3911755623326], "isController": false}, {"data": ["POST - Create Product", 200, 0, 0.0, 8899.835000000006, 3223, 15803, 8880.5, 12485.6, 13422.849999999999, 15676.680000000006, 0.3180793098951292, 0.20998204442295643, 32.197652693972714], "isController": false}, {"data": ["POST - Sign In Seller", 200, 0, 0.0, 3118.235000000002, 977, 8743, 2770.0, 4734.8, 5503.7, 8022.0400000000045, 0.32127791503484254, 0.15656023398670552, 0.08973191767574705], "isController": false}, {"data": ["GET - See Order Product", 200, 0, 0.0, 2356.3550000000005, 247, 6758, 2038.0, 3518.0, 4499.95, 6479.480000000004, 0.3314265260534392, 0.38709582535147785, 0.10745469399388849], "isController": false}, {"data": ["DELETE - List Product By ID", 200, 0, 0.0, 5150.689999999997, 2231, 13484, 4581.0, 8014.7, 9714.549999999997, 13243.610000000006, 0.31989149280564033, 0.09746693921421853, 0.13307985931172148], "isController": false}, {"data": ["GET - Product List", 200, 0, 0.0, 3340.750000000001, 786, 7223, 3245.0, 5228.0, 5691.499999999998, 6990.510000000002, 0.32220283635156843, 0.22969538138344234, 0.12397257570558394], "isController": false}, {"data": ["POST - Sign In Buyer", 200, 0, 0.0, 2958.2950000000005, 764, 6445, 2800.0, 4280.2, 4936.449999999998, 5785.570000000001, 0.3205364498023893, 0.15525984287303232, 0.08921180487664156], "isController": false}, {"data": ["POST - Buy Product", 200, 0, 0.0, 6538.244999999997, 389, 12785, 5994.5, 10252.8, 11241.9, 12719.98, 0.32667781726949613, 0.21374427497125234, 0.14005035330205937], "isController": false}, {"data": ["GET - List Product By ID", 200, 0, 0.0, 4330.130000000001, 1059, 9907, 3949.5, 7014.200000000001, 8242.699999999999, 9522.370000000004, 0.31910853838716163, 0.22686622650962274, 0.10595400688636226], "isController": false}, {"data": ["POST - Sign Up Seller", 200, 0, 0.0, 4910.279999999999, 794, 10794, 4463.0, 9072.0, 9347.85, 10770.11000000001, 0.3171175285128298, 0.17837860978846673, 0.42793523984391474], "isController": false}, {"data": ["GET - List Product", 200, 0, 0.0, 3001.870000000001, 1009, 9264, 2530.0, 5242.3, 5919.549999999998, 7743.810000000002, 0.31949800473496043, 0.2277671322817589, 0.10421126326316092], "isController": false}, {"data": ["GET - Product List By ID", 200, 0, 0.0, 2103.629999999998, 251, 5472, 2001.5, 3485.8, 3762.2999999999997, 4749.450000000003, 0.32403829484568486, 0.2806855151641821, 0.10695795279086082], "isController": false}, {"data": ["GET - See Order Product by ID", 200, 0, 0.0, 2382.824999999999, 247, 11022, 2014.5, 4245.900000000001, 4961.849999999998, 7264.140000000003, 0.33237719493590107, 0.3882061768977907, 0.10808750577505376], "isController": false}, {"data": ["PUT - Changes Order", 200, 0, 0.0, 5983.025, 253, 14783, 4937.5, 10764.7, 12709.199999999995, 14014.91, 0.333078528259215, 0.21598060816808476, 0.13498788010505297], "isController": false}, {"data": ["POST - Sign Up Buyer", 200, 0, 0.0, 4492.57, 1191, 11528, 4441.5, 6025.7, 8006.099999999999, 11260.150000000014, 0.32003225925173256, 0.17939308282274852, 0.4321935651113632], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
