var readlines = require('n-readlines');
var fs = require('fs')
var liner = new readlines('base2.json');
var outputFileName = "createdFiles/awards.txt";
var outputFileNameSuppliers = "createdFiles/awardsSuppliers.txt";
var outputFileNameDocuments = "createdFiles/awardsDocuments.txt";

var i = 0;
var contractLine;

var optionsInitial = {
    enconding: "utf-8",
    flag: "w",
};
fs.writeFileSync(outputFileName, "", optionsInitial);
fs.writeFileSync(outputFileNameSuppliers, "", optionsInitial);
fs.writeFileSync(outputFileNameDocuments, "", optionsInitial);
var optionsAfter = {
    enconding: "utf-8",
    flag: "a",
};
var sep = "|";


// for each contract
while (contractLine = liner.next()) {

    i++;
    var contractObject = JSON.parse(contractLine.toString('utf-8'));

    contractObject.records.forEach(function (record) {
        var ocid = record.compiledRelease.ocid;
        ocid = ocid.replace(sep, " ");
        ocid = ocid.replace(/\r?\n|\r/g, " ");

        var tenderId = record.compiledRelease.tender.id;
        tenderId = tenderId.replace(sep, " ");
        tenderId = tenderId.replace(/\r?\n|\r/g, " ");

        record.compiledRelease.awards.forEach(function (award) {
            var valueAmount = award.value.amount;
            var valueCurrency = award.value.currency;
            var awardDate = "";
            var awardStartDate = "";
            var awardEndDate = "";
            var awardDurationInDays = "";
            var awardMaxEntentDate = "";

            if (award.date != null) {
                awardDate = award.date;
                awardDate = awardDate.replace(sep, " ");
                awardDate = awardDate.replace(/\r?\n|\r/g, " ");
            }
            if (award.contractPeriod.startDate != null) {
                awardStartDate = award.contractPeriod.startDate;
                awardStartDate = awardStartDate.replace(sep, " ");
                awardStartDate = awardStartDate.replace(/\r?\n|\r/g, " ");
            }
            if (award.contractPeriod.endDate != null) {
                awardEndDate = award.contractPeriod.endDate;
                awardEndDate = awardEndDate.replace(sep, " ");
                awardEndDate = awardEndDate.replace(/\r?\n|\r/g, " ");
            }
            if (award.contractPeriod.durationInDays != null) { awardDurationInDays = award.contractPeriod.durationInDays; }
            if (award.contractPeriod.maxExtentDate != null) {
                awardMaxEntentDate = award.contractPeriod.maxExtentDate;
                awardMaxEntentDate = awardMaxEntentDate.replace(sep, " ");
                awardMaxEntentDate = awardMaxEntentDate.replace(/\r?\n|\r/g, " ");
            }


            var outputLineAward = ocid + sep + tenderId + sep + award.id + sep + awardDate + sep + valueAmount + sep + valueCurrency + sep + awardStartDate + sep + awardEndDate + sep + awardDurationInDays + sep + awardMaxEntentDate + "\r\n";
            fs.writeFileSync(outputFileName, outputLineAward, optionsAfter);

            award.suppliers.forEach(function (supplier) {
                let supplierId = supplier.id;
                supplierId = supplierId.replace(sep, " ");
                supplierId = supplierId.replace(/\r?\n|\r/g, " ");
                var outputLineSupplier = ocid + sep + tenderId + sep + valueAmount + sep + valueCurrency + sep + supplierId + "\r\n";
                fs.writeFileSync(outputFileNameSuppliers, outputLineSupplier, optionsAfter);
            });

            award.documents.forEach(function (document) {
                var docType = "";
                var docDescription = "";
                var docUrl = "";
                var docDate = "";
                if (document.documentType != null) {
                    docType = document.documentType;
                    docType = docType.replace(sep, " ");
                    docType = docType.replace(/\r?\n|\r/g, " ");
                }
                if (document.description != null) {
                    docDescription = document.description;
                    docDescription = docDescription.replace(sep, " ");
                    docDescription = docDescription.replace(/\r?\n|\r/g, " ");
                }
                if (document.url != null) {
                    docUrl = document.url;
                    docUrl = docUrl.replace(sep, " ");
                    docUrl = docUrl.replace(/\r?\n|\r/g, " ");
                }
                if (document.datePublished != null) {
                    docDate = document.datePublished;
                    docDate = docDate.replace(sep, " ");
                    docDate = docDate.replace(/\r?\n|\r/g, " ");
                }

                var outputLineDocument = ocid + sep + tenderId + sep + document.id + sep + docType + sep + docDescription + sep + docUrl + sep + docDate + "\r\n";
                fs.writeFileSync(outputFileNameDocuments, outputLineDocument, optionsAfter);
            });
        });



    });
    // JSON file is too large, limit tests to first 100 lines (for testing purposes)
    /*if(i>=100){

        break;
    }*/
}


console.log("Finished: " + i + " awards");
