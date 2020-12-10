const { assert } = require('chai');

const { fetchEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = fetchEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.deepEqual(user.id, expectedOutput);
  });
  it('should return undefined a user with invalid email', function() {
    const user = fetchEmail(testUsers, "user@aaa.com");
    console.log("user.id", user.id);
    const expectedOutput = false;
    assert.deepEqual(user, expectedOutput);
  });

});