import chalk from "chalk";
import fs from "fs";
import { getAbsPath } from "./modules/api/api-utils.js";
import path from "path";

/** @implements {import('@playwright/test/reporter').Reporter} */
export default class CustomReporter {
    testExecutionTimeResults = getAbsPath(
        new URL(import.meta.url).pathname,
        `testExecutionTimeResults.json`
    );
    failedTestsResults = getAbsPath(
        new URL(import.meta.url).pathname,
        "failedTestsResults.json"
    );
    respPath = getAbsPath(new URL(import.meta.url).pathname, "responses.json");
    reportPassed = {
        slow: [],
        normal: [],
        fast: [],
        skipped: [],
    };
    reportFailed = [];
    testNum = 0;
    testCounter = 0;
    testsFailed = [];
    respJsonReceived = [];

    onBegin() {
        console.log("--------------------------------------------------------");
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const destinationPath = ["custom-report"];
        try {
            if (!fs.existsSync(path.join(__dirname, ...destinationPath))) {
                fs.mkdirSync(path.join(__dirname, ...destinationPath));
            }
        } catch (err) {
            console.error(err);
        }
        try {
            fs.unlinkSync(this.failedTestsResults);
            fs.unlinkSync(this.testExecutionTimeResults);
            fs.unlinkSync(this.respPath);
        } catch (error) {
            console.error(error);
        }
    }

    onTestEnd(test, result) {
        if (result.status === "failed") {
            this.handleFail(test, result);
        } else if (result.status === "skipped") {
            this.reportPassed["skipped"].push({
                name: test.title,
            });
        } else {
            this.classifyByExecutionTime(test, result);
        }
        this.testCounter++;
    }

    onEnd(result) {
        console.log(
            chalk.bgYellowBright(`Status of the run: ${result.status}`)
        );
        console.log(chalk.bgMagentaBright(`Tests run : ${this.testCounter}`));
        console.log(
            chalk.bgCyanBright(`Finished the run in: ${result.duration}`)
        );
        for (let i = 0; i < this.testNum; i++) {
            this.reportFailed[i]["resp"] = this.respJsonReceived[i];
        }
        try {
            fs.writeFileSync(
                this.testExecutionTimeResults,
                JSON.stringify(this.reportPassed)
            );
            fs.writeFileSync(
                this.failedTestsResults,
                JSON.stringify(this.reportFailed)
            );
        } catch (err) {
            console.error(err);
        }
    }

    handleFail(test, result) {
        console.log(
            `Finished test - ${test.title} - with status - ${chalk.bgRedBright(
                result.status
            )}`
        );
        this.testNum++;
        fs.readFile(this.respPath, "utf8", (err, data) => {
            if (err) {
                return console.error("Error reading file: ", err);
            }
            this.respJsonReceived.push(data);
        });
        this.reportFailed.push({
            name: test.title,
        });
    }

    classifyByExecutionTime(test, result) {
        console.log(
            `Finished test - ${test.title
            } - with status - ${chalk.bgGreenBright(result.status)}`
        );
        if (result.duration < 100) {
            this.reportPassed["fast"].push({
                name: test.title,
                duration: result.duration,
            });
        } else if (result.duration > 100 && result.duration < 460) {
            this.reportPassed["normal"].push({
                name: test.title,
                duration: result.duration,
            });
        } else
            this.reportPassed["slow"].push({
                name: test.title,
                duration: result.duration,
            });
    }
}
