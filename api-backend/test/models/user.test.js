const { expect } = require('chai');
const User = require('../../models/user');
const { Sequelize } = require('sequelize');

require('../setup');
describe('User Model', () => {

    it('should create user with hashed password', async () => {
        const user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'Password123*',
        });

        expect(user).to.have.property('id');
        expect(user.firstName).to.equal('John');
        expect(user.lastName).to.equal('Doe');
        expect(user.email).to.equal('john.doe@example.com');
        expect(user.password).to.not.equal('Password123*');
    });

    it('should not create user with an invalid email', async () => {
        try {
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                password: 'Password123*',
            });
        } catch (error) {
            expect(error).to.exist;
            expect(error.errors[0].message).to.equal('L\'email doit être valide');
        }
    });

    it('should not create user with a low password', async () => {
        try {
            await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password',
            });
        } catch (error) {
            expect(error).to.exist;
            expect(error).to.be.instanceOf(Sequelize.ValidationError);
        }
    });

    it('should hash password before creation', async () => {
        const user = User.build({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'Password123*',
        });
    

        expect(user.password).to.equal('Password123*');
    
        await user.save();
    
        expect(user.password).to.not.equal('Password123*');
        expect(user.password).to.match(/^\$2[ayb]\$.{56}$/);
    });

    it('should hash password after update', async () => {
        const user = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'Password123*',
        });

        const oldPasswordHash = user.password;

        user.password = 'NewPassword123*';
        await user.save();

        expect(user.password).to.not.equal('NewPassword123*');
        expect(user.password).to.not.equal(oldPasswordHash);
    });
});