const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes (User must be logged in)

// Get own profile (full data)
router.get('/', auth, profileController.getPublicProfile);

// Get someone else's profile by ID
router.get('/:id', auth, profileController.getPublicProfile);

// Update profile. Expects multipart/form-data with a 'profilePicture' file field
router.put('/', auth, upload.single('profilePicture'), profileController.updateProfile);

// Add a certificate. Expects a 'certificateImage' file field
router.post('/certificates', auth, upload.single('certificateImage'), profileController.addCertificate);

// Set certificate as featured
router.put('/certificates/:certId/feature', auth, profileController.featureCertificate);

module.exports = router;
