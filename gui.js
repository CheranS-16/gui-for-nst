document.getElementById("scan-button").addEventListener("click", function() {
    var ipRange = document.getElementById("ip-range").value;

    if (ipRange === "") {
        alert("Please enter an IP range.");
        return;
    }

    // Show scanning message
    document.getElementById("results").style.display = "none";
    document.getElementById("results").innerHTML = "<p>Scanning network, please wait...</p>";

    // Make the API request to the backend
    fetch("http://127.0.0.1:5000/scan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "ip_range": ipRange })
    })
    .then(response => response.json())
    .then(data => {
        // Display the results
        var resultsDiv = document.getElementById("results");
        if (data.devices.length > 0) {
            var table = "<table><thead><tr><th>IP Address</th><th>MAC Address</th></tr></thead><tbody>";
            data.devices.forEach(device => {
                table += `<tr><td>${device.ip}</td><td>${device.mac}</td></tr>`;
            });
            table += "</tbody></table>";
            resultsDiv.innerHTML = table;
        } else {
            resultsDiv.innerHTML = "<p>No devices found in this range.</p>";
        }
        resultsDiv.style.display = "block";
    })
    .catch(error => {
        document.getElementById("results").innerHTML = "<p>Error occurred while scanning the network.</p>";
        document.getElementById("results").style.display = "block";
    });
});
