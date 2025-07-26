const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const dataDir = path.join(__dirname, '../public/data');
const outputFile = path.join(dataDir, 'images.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Allowed image extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

// Function to get a list of image files
function getImageFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return allowedExtensions.includes(ext);
        }).map(file => {
            // Assume the text for the image is the filename without extension
            // or you can implement a more sophisticated logic if text is in metadata/another file
            const basename = path.basename(file, path.extname(file));
            return {
                filename: path.join('images', file).replace(/\\/g, '/'), // Use forward slashes for web paths
                text: basename.replace(/_/g, ' ') // Replace underscores with spaces for readability
            };
        });
    } catch (error) {
        console.error(`Error reading image directory ${dir}:`, error);
        return [];
    }
}

// Generate the image list
const imageList = getImageFiles(imagesDir);

// Write the list to a JSON file
try {
    fs.writeFileSync(outputFile, JSON.stringify(imageList, null, 2), 'utf8');
    console.log(`Successfully generated ${imageList.length} images to ${outputFile}`);
} catch (error) {
    console.error(`Error writing image list to ${outputFile}:`, error);
}
