const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

const geoip = require('geoip-lite');

// Trust the first proxy
app.set('trust proxy', true);

app.use((req, res, next) => {
  try{
    if (!req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico)$/)) { // Adjust the regex as needed
      let ip = req.ip;
      try{
        const location = geoip.lookup(ip);
        const country = JSON.stringify(location.country)
        const city = JSON.stringify(location.city)
        const region = JSON.stringify(location.region)
        console.log(`Time: ${new Date().toLocaleTimeString()} IP: ${ip}, Country: ${country}, Region: ${region} City: ${city} URL: ${req.url}`);
      }catch(e){
        console.log(e)
      }
    }
    next();
  }catch(e){
    console.log(e)
  }
  
});


//initalize the postgres table
//create it in database/postgres then querytool

// CREATE TABLE recipes (
//     id SERIAL PRIMARY KEY,
//     title TEXT,
//     cuisine TEXT,
//     prepTime TEXT,
// 	rating TEXT,
// 	ingredients TEXT[],
// 	spices TEXT[],
// 	steps TEXT[],
// 	thumbnailUrl TEXT,
// );


const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT, 
});


app.get('/api/authenticate', (req, res) => {
  console.log(`${new Date().toLocaleTimeString()} - authenticate`);
  const userPassword = req.query.password;
  if (userPassword === process.env.ADMIN_PASSWORD) {
    // User is authenticated, create a token.
    const token = jwt.sign({ admin: true }, (process.env.JWT_SECRET), { expiresIn: '1h' });
    res.json({ message: "Authenticated", token });
  } else {
    res.json({ message: "Unauthenticated"})
  }
});



app.post('/api/recipe', authenticateToken, async (req, res) => {
  // post to the database with the new information
  // Only proceed if token is verified, indicating request is authenticated
  console.log(`${new Date().toLocaleDateString()} - add recipe`);

  let recipe = {
    title: req.body.title,
    cuisine: (req.body.cuisine == "") ? null: req.body.cuisine,
    prepTime: req.body.prepTime,
    rating: req.body.rating,
    ingredients: req.body.ingredients,
    spices: req.body.spices,
    steps: req.body.steps,
    thumbnailUrl: req.body.thumbnailUrl,
  }
  const query = `
  INSERT INTO recipes (title, cuisine, prepTime, rating, ingredients, spices, steps, thumbnailUrl)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  const values = [
    recipe.title,
    recipe.cuisine,
    recipe.prepTime,
    recipe.rating,
    recipe.ingredients,
    recipe.spices,
    recipe.steps,
    recipe.thumbnailUrl
  ];
  function status(code){ 
    res.send(code)
  }
  pool.query(query, values, (err, res) => {
    if (err) {
      console.error('Error executing query', err.stack);
      status("Error!");
    } else {
      console.log('Recipe inserted successfully');
      status("Success!");
    }
  });
});


app.get('/api/all',authenticateToken,async(req,res)=>{
  console.log(`${new Date().toLocaleTimeString()} - all recipe titles`);
  let sql = "SELECT title FROM recipes;"
  const { rows } = await pool.query(sql);
  res.json(rows)
})
app.delete("/api/delete", authenticateToken , async (req, res) => {
  console.log("delete " + req.query.title)
  try {
    // delete a specific recipe by its title
    const title = req.query.title;
    const sql = "DELETE FROM recipes WHERE title ILIKE $1";
    const result = await pool.query(sql, [title]);
    res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting recipe." });
  }
});

// what to get all recipes and return back 8 random recipes
app.get('/random', async (req, res) => {
  console.log(`${new Date().toLocaleTimeString()} - random recipe`);
    try {
        const { rows } = await pool.query('SELECT * FROM recipes ORDER BY RANDOM() LIMIT 8');
        res.json(rows);
      } catch (error) {
        console.error('Error fetching random recipes', error);
        res.status(500).send('Server error');
      }
});

app.get('/search', async (req, res) => {
    console.log(`${new Date().toLocaleTimeString} - search for recipe`);
    // search for a specific recipe by its name or ingredient
    //set default values to keep fomatting consistant
    const cuisine = req.query.cuisine || 'nothing';
    const prepTime = req.query.prepTime || 'nothing';
    const ingredient = req.query.ingredient || 'nothing';

    let queryParams = [];
    let conditions = [];

    //start the sql query
    let sql = `SELECT * FROM recipes`;

    if (cuisine != 'nothing') {
      queryParams.push(cuisine);
      conditions.push(`cuisine ILIKE $${queryParams.length}`);
    }
  
    if (prepTime != 'nothing') {
        queryParams.push(prepTime);
        conditions.push(`CAST(preptime AS INTEGER) <= $${queryParams.length}`); // Cast preptime to INTEGER for comparison
    }

    if (ingredient != 'nothing') {
        let ingredientPattern = `%${ingredient}%`; 
        queryParams.push(ingredientPattern);
        // Use unnest to flatten the array and then check each element for the pattern
        conditions.push(`EXISTS (SELECT 1 FROM unnest(ingredients) AS ingredient WHERE ingredient ILIKE $${queryParams.length})`);
    }
    if (conditions.length) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    try {
      const { rows } = await pool.query(sql, queryParams);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });




// After all other server routes
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));