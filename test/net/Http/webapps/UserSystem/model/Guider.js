line.module([
    './BaseModel'
], function (BaseModel) {

    return line.define("Guider", BaseModel, {
        table: 't_guider',
        properties: {
            userId: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            years: {
                value: null,
                type: ['int', 3],
                default: 0
            },
            realName: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            guiderSerialNumber: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            idCard: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            education: {
                value: null,
                type: ['bigint', 20],
                default: 0
            },
            certificateImg: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            state: {
                value: null,
                type: ['bigint', 20],
                default: 12
            },
            applyState: {
                value: null,
                type: ['bigint', 20],
                default: 15
            },
            verifyTime: {
                value: null,
                type: ['datetime'],
                default: null
            },
            rejectNote: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})