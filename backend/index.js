const path = require("path");
require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FLUX LMS Server running on port ${PORT} (0.0.0.0)`);
});