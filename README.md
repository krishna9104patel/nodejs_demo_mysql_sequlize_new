1. create user migration 
=> npx sequelize-cli model:generate --name User --attributes "name:string,email:string,contact:string,password:string,status:string"

2. create table final migration command
=> npx sequelize-cli db:migrate

3. add verification field in user table
=> npx sequelize migration:generate --name add-verification-field

4. create above migration command
=> npx sequelize-cli db:migrate

5. create category table migration
=> npx sequelize-cli model:generate --name Category --attributes name:string,status:string

6. create product table migration
=> npx sequelize-cli model:generate --name Product --attributes name:string,desc:string,price:float,categoryId:integer,status:string

7. create product images table migration
=> npx sequelize-cli model:generate --name ProductImages --attributes imageSrc:string,productId:integer

8. defined relation between table in generated modal

9. create table using migration command
=> npx sequelize-cli db:migrate

10. create migration for change type of category table status field string to integer
=> npx sequelize-cli migration:generate --name changeStatusColumnType

11. Write below code in above created migration file
=> 'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('yourTableName', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false, // Change as needed based on your requirements
      defaultValue: 0 // Change as needed based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('yourTableName', 'status', {
      type: Sequelize.STRING,
      allowNull: false // Change as needed based on your requirements
    });
  }
};

12. create table using migration command
=> npx sequelize-cli db:migrate

Let's started create APIs for product and productimages tables

13. create migration file for add slug column in product table
=> npx sequelize-cli migration:generate --name add-slug-to-product

14. create migration file for update name of imageSrc to imageName and add status column with defautl value 1
=> npx sequelize-cli migration:generate --name update-productimages-table

15. Now run the migration for udpate mysql database
=> npx sequelize-cli db:migrate
