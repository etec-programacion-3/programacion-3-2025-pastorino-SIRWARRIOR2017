const { sequelize } = require('../src/config/database');
const { User } = require('../src/models');

const resetUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Drop Users table and recreate it
    await User.sync({ force: true });
    console.log('Users table reset successfully');

    // Create a test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',  // will be hashed by model hooks
      role: 'customer'
    });

    console.log('Test user created:', testUser.toPublicJSON());
    console.log('\nYou can now login with:');
    console.log('email: test@example.com');
    console.log('password: test123');

    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetUsers();