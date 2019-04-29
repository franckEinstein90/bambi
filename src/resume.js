const professionalExperience = (function() {

    return {

        DEVELOPER: {
            company: "Parks Canada",
            language: "javascript", 
            tasks: ["Gathering user requirements",
                "developing and implementing plugins"
            ]
        }

    };
})()

const education = (function() {
    let specialization = {
        csi: {
            machineLearning: 1,
            proofCarryingCode: 2
        },
        math: 3
    }

    let Degree = function(completion, institution, specialization) {}

    return {
        PhD: new Degree(2008, csi.machineLearning),
        Masters: new Degree(2002, specialization.csi.proofCarryingCode),
        Honors: new Degree(2000, specialization.csi)
    };
})()
