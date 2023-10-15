# Mobile App Backend

This project is the backend system for a mobile application, responsible for user authentication, CRUD operations,
real-time stock updates, and stories. It's built with TypeScript, utilizing the NestJS framework and TypeORM for
efficient API development. The system is hosted on DigitalOcean for reliable and scalable performance.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Database Setup](#database-setup)
4. [Contact Information](#contact-information)

## Installation

To set up this backend system, follow these steps:

1. **Prerequisites:** 
   - Ensure you have Node.js installed. If not, you can download it from [nodejs.org](https://nodejs.org/).

2. **Clone the Repository:**
  ```
    git clone https://github.com/mamoussa405/Bhira_app_v1.git
    cd your-repo
  ```

3. **Install Dependencies:**
  ```
    npm install

  ```

4. **Configuration:**
   - Configure your environment variables and settings as needed. Refer to the [Configuration](#configuration) section for details.

6. **Start the Server:**
```
  npm run start

```
## Configuration

To ensure the correct functioning of the project, you may need to adjust various configuration settings. Here are the key aspects to consider:

**Environment Variables:**

   - Create a `.env` file or use your server's environment settings to manage sensitive information like database connection details, API keys, and other configuration variables.
	
   - Here is the `.env` file needed for this project to work, you can adjust it depends on the features you will add:
		
  ```plaintext
  # DATABASE configuration
  DATABASE_URL=your-database-connection-url

  # JWT AUTH configuration
  JWT_SECRET=your-jwt-secret

  # Cloudinary configuration for image and video storage
  CLOUDINARY_CLOUD_NAME=your-cloudinary-name
  CLOUDINARY_API_KEY=your-cloudinary-api-key
  CLOUDINARY_API_SECRET=your-cloudinary-api-secret

  # Default data configuration
  USER_DEFAULT_AVATAR=link-to-your-default-user-avatar
  ```

## Database Setup

Follow these steps to set up and configure the database:

1. **Database Creation:**
   - Create a new database instance or use an existing one that will store your project's data. The project uses `Postgres` as a DBMS

2. **Migrations for Schema and Tables:**
   - The project uses `TypeORM` migrations to handle schema and table creation. Any changes to the database schema can be managed through migration files.
     To create a new migration, run the following command from your project's root directory:
   ```shell
     npm run typeorm migration:generate -n src/migrations/MyMigration

   
   ```
   - Write your Schema and start the server
   ```shell
     npm run start
     
   ```
   
3. **Database Linking**
   - Link your database instance with the server as mentioned in the [Configuration](#configuration) section.

## Contact Information

If you have any questions, need support, or want to get in touch regarding this project, you can reach out in the following ways:

- **Email:** [mohamed.amoussaoui.se@gmail.com](mailto:mohamed.amoussaoui.se@gmail.com)
- **LinkedIn:** [https://www.linkedin.com/in/mohamed-amoussaoui/](https://www.linkedin.com/in/mohamed-amoussaoui/)

Feel free to contact me with any inquiries, feedback, or collaboration opportunities. We look forward to hearing from you.

### - Observations : 

[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)
