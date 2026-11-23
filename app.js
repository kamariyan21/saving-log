document.getElementById("saveButton").addEventListener("click", saveLog);
document.getElementById("exportButton").addEventListener("click", exportJson);

function saveLog() {
    const plannedAmount =
        Number(document.getElementById("plannedAmount").value);

    const actualAmount =
        Number(document.getElementById("actualAmount").value);

    let subject =
        document.getElementById("subject").value.trim();

    if (subject === "") {
        subject = "未入力";
    }

    const log = {
        timestamp: new Date().toISOString(),
        plannedAmount: plannedAmount,
        actualAmount: actualAmount,
        savedAmount: plannedAmount - actualAmount,
        subject: subject
    };

    let logs = JSON.parse(localStorage.getItem("savingLogs")) || [];

    logs.push(log);

    localStorage.setItem(
        "savingLogs",
        JSON.stringify(logs)
    );

    updateTotalSaved();
    updateLogList();

    document.getElementById("plannedAmount").value = "";
    document.getElementById("actualAmount").value = "";
    document.getElementById("subject").value = "";
}

function updateTotalSaved() {

    const logs =
        JSON.parse(localStorage.getItem("savingLogs")) || [];

    let totalSaved = 0;

    for (const log of logs) {
        totalSaved += log.savedAmount;
    }

    document.getElementById("totalSaved").textContent =
        "累計: " + totalSaved + "円";
}

function updateLogList() {

    const logs =
        JSON.parse(localStorage.getItem("savingLogs")) || [];

    const logList =
        document.getElementById("logList");

    logList.innerHTML = "";

    logs.reverse(); // Reverse the logs to show the most recent first
    for (const log of logs) {

        const date =
            new Date(log.timestamp);

        const line =
            document.createElement("div");

        const dateText =
            date.toLocaleDateString("ja-JP") +
            "　" +
            date.toLocaleTimeString("ja-JP", {
                hour: "2-digit",
                minute: "2-digit"
            });

        line.textContent =
            dateText +
            "　" +
            log.savedAmount +
            "円";

        logList.appendChild(line);
    }
}

function exportJson() {

    const logs =
        JSON.parse(localStorage.getItem("savingLogs")) || [];

    const jsonText =
        JSON.stringify(logs, null, 2);

    const blob =
        new Blob(
            [jsonText],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "saving-log-" +
        new Date().toISOString().slice(0, 10) +
        ".json";

    link.click();

    URL.revokeObjectURL(url);
}

updateTotalSaved();
updateLogList();