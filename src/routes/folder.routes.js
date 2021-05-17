//PROJECT SUB-ROUTING ROUTES
var router = require('express').Router();
const { check, validationResult } = require('express-validator');
const validator = require('../utils/validator');
module.exports = function (app, addon) {
    const folder = require('../controllers/folder.ctrl');

    //Folder Creation
    router.post('/',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('folder_name').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder created");
            folder.createFolder(req, res);
        }
    )

    //Folder Update
    router.put('/',
        addon.checkValidToken(),
        [
            check('folder_id').not().isEmpty(),
            check('folder_name').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder updated");
            folder.renameFolder(req, res);
        }
    )

    //Folder Delete
    router.delete('/',
        addon.checkValidToken(),
        [
            check('folder_id').not().isEmpty(),
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder updated");
            folder.deleteFolder(req, res);
        }
    )

    //List All Folders
    router.get('/list',
       // addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder list returned");
            folder.listFolders(req, res);
        }
    )

    //List All Folders
    router.get('/',
        addon.checkValidToken(),
        [
            check('folder_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder list returned");
            folder.folderDetail(req, res);
        }
    )

    //subFolderList All Folders
    router.get('/subFolder/list',
        addon.checkValidToken(),
        [
            check('parent_folder_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            console.log("folder list returned");
            folder.subFolder(req, res);
        }
    )
    //Get test flag
    router.get('/testFlag',
        addon.checkValidToken(),
        [
            check('acct_id').not().isEmpty(),
            check('project_id').not().isEmpty(),
            check('domain_id').not().isEmpty()
        ],
        (req, res, next) => {
            validator(req, res, next)
        },
        (req, res, next) => {
            folder.testFlag(req, res);
        }
    )

    return router;
}