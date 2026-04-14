"const mongoose = require('mongoose');" 
const bcrypt = require('bcrypt');

class User {
  constructor(id, email, passwordHash, createdAt) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date();
  }

  static async create(db, email, password) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // For now, store in memory (we'll add PostgreSQL later)
    if (!global.users) global.users = [];
    const id = global.users.length + 1;
    const user = { id, email, password_hash: passwordHash, created_at: new Date() };
    global.users.push(user);
    
    return new User(id, email, passwordHash, new Date());
  }

  static async findByEmail(db, email) {
    if (!global.users) return null;
    const user = global.users.find(u => u.email === email);
    if (!user) return null;
    return new User(user.id, user.email, user.password_hash, user.created_at);
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

module.exports = User;