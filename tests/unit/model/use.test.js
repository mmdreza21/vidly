require("dotenv").config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../../../model/user');

describe('user.generatAauthTokens', () => {
    it('should return a valid token', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(payload)
        const token = user.generatAauthTokens()
        const decoded = jwt.verify(token, process.env.JWT_PRI)
        expect(decoded).toMatchObject(payload);
    });
});