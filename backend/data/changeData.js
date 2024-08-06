const fs = require('fs');

// Read the JSON file
fs.readFile('backend/data/appData.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Add a new field to each JSON object
    const updatedData = jsonData.map(obj => {
       const randomQuantities = Math.floor(Math.random() * 100)
       const randomDiscount = Math.floor(Math.random() * 70)
       const randomRating = Math.round(Math.random() * 50)/10

      return { ...obj, quantitiesLeft: randomQuantities, discount: randomDiscount, averageRating: randomRating }; // Add your new field and value here
    });

    // Convert the updated data back to JSON string
    const updatedJson = JSON.stringify(updatedData, null, 2);

    // Write the updated JSON to a new file
    fs.writeFile('backend/data/newAppData.json', updatedJson, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Changes saved to output.json');
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
