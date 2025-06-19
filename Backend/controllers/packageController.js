const Package = require('../models/packageModel');
const upload = require('../middleware/imageUpload'); // Assuming multer setup is in 'middleware/upload.js'

const createPackage = async (req, res) => {
  try {
    const { name, price, days } = req.body;

    // Validate input
    if (!name || !days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ error: 'Please provide a package name and at least one day with details.' });
    }

    if (price === undefined || isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Please provide a valid price.' });
    }

    // Process days to include image paths
    const processedDays = days.map((day, index) => {
      const imagePath = req.files && req.files[index] ? `/uploads/${req.files[index].filename}` : null;
      return {
        dayNumber: index + 1,
        title: day.title,
        description: day.description,
        activities: day.activities,
        image: imagePath,
      };
    });

    // Create the package
    const newPackage = new Package({
      name,
      days: processedDays,
      price
    });

    // Save the package to the database
    const savedPackage = await newPackage.save();

    // Send a success response
    res.status(201).json({ message: 'Package created successfully', package: savedPackage });
  } catch (err) {
    // Handle errors
    console.error('Error creating package:', err);
    res.status(500).json({ error: 'An error occurred while creating the package' });
  }
};

const getAllPackages = async (req, res) => {
  try {
      // Fetch all packages from the database
      const packages = await Package.find();

      // Check if any packages are found
      if (!packages || packages.length === 0) {
          return res.status(404).json({ message: 'No packages found' });
      }

      // Send the packages as a response
      res.status(200).json(packages);
  } catch (err) {
      // Handle errors
      console.error('Error fetching packages:', err);
      res.status(500).json({ error: 'An error occurred while fetching packages' });
  }
};

// Get a package by ID
const getPackageById = async (req, res) => {
  try {
      const { id } = req.params;
      const package = await Package.findById(id);

      if (!package) {
          return res.status(404).json({ error: 'Package not found' });
      }

      res.status(200).json(package);
  } catch (err) {
      console.error('Error fetching package:', err);
      res.status(500).json({ error: 'An error occurred while fetching the package' });
  }
};

// Update a package

// const updatePackage = async (req, res) => {
//   try {
//     const { name, price, days } = req.body;
//     const packageId = req.params.id;

//     // Find the existing package
//     const existingPackage = await Package.findById(packageId);

//     if (!existingPackage) {
//       return res.status(404).json({ error: 'Package not found' });
//     }
// console.log(req.files);
//     // Process days to handle image updates correctly
//     const processedDays = days.map((day, index) => {
//       console.log(index);
//       // Use the new image if provided; otherwise, keep the existing one
//       const imagePath = req.files && req.files[index] 
//         ? `/uploads/${req.files[index].filename}` 
//         : existingPackage.days[index]?.image; // Keep the existing image if no new image is provided
        
// //         console.log(`/uploads/${req.files[index].filename}`)
// // console.log(existingPackage.days[index]?.image)
//       return {
//         dayNumber: day.dayNumber || index + 1,
//         title: day.title,
//         description: day.description,
//         activities: day.activities,
//         image: imagePath,
//       };
//     });
// console.log(processedDays);
//     // Update package data
//     existingPackage.name = name;
//     existingPackage.price = price; // Update the price field
//     existingPackage.days = processedDays;

//     // Save updated package
//     const updatedPackage = await existingPackage.save();

//     res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
//   } catch (err) {
//     console.error('Error updating package:', err);
//     res.status(500).json({ error: 'An error occurred while updating the package' });
//   }
// };

const updatePackage = async (req, res) => {
  try {
    const { name, price, days } = req.body;
    const packageId = req.params.id;

    // Find the existing package
    const existingPackage = await Package.findById(packageId);

    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Create a map of files based on the day index
    const filesMap = {};
    if (req.files) {
      req.files.forEach((file) => {
        console.log(file);  
        const match = file.fieldname.match(/days\[(\d+)\]\[image\]/);
        console.log(match);
        if (match) {
          const dayIndex = parseInt(match[1], 10); // Extract day index from fieldname
          filesMap[dayIndex] = `/uploads/${file.filename}`;
        }
      });
    }

    // Process days to handle image updates correctly
    const processedDays = days.map((day, index) => {
      const imagePath = filesMap[index] // Use the new image if provided
        ? filesMap[index]
        : existingPackage.days[index]?.image; // Keep the existing image if no new image is provided

      return {
        dayNumber: day.dayNumber || index + 1,
        title: day.title,
        description: day.description,
        activities: day.activities,
        image: imagePath,
      };
    });

    // Update package data
    existingPackage.name = name;
    existingPackage.price = price; // Update the price field
    existingPackage.days = processedDays;

    // Save updated package
    const updatedPackage = await existingPackage.save();

    res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ error: 'An error occurred while updating the package' });
  }
};



const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    // Find the package by ID and delete it
    const deletedPackage = await Package.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully', package: deletedPackage });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ error: 'An error occurred while deleting the package' });
  }
};
  

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage
};
