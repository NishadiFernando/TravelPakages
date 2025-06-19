const express = require('express');
const router = express.Router();
const { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage } = require('../controllers/packageController');
const upload = require('../middleware/imageUpload');

router.post('/create-package', upload.array('images', 10), createPackage); // Assuming max 10 images
router.get('/get-allpackages', getAllPackages);
router.get('/get-package/:id', getPackageById);
router.put('/edit-package/:id', upload.any(), updatePackage);
router.delete('/delete-package/:id', deletePackage);    

module.exports = router;