const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const {
        firstName,
        surname,
        email,
        password,
        country,
        gender,
        dob,
        receiveEmails,
        profilePic,
        memberSince,
        preferences,
    } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            surname,
            email,
            password: hashedPassword,
            country,
            gender,
            role: "user", // Default role is 'user'
            dob,
            receiveEmails,
            profilePic,
            memberSince,
            preferences: JSON.stringify(preferences), // Store preferences as a JSON string
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                surname: user.surname,
                email: user.email,
                country: user.country,
                gender: user.gender,
                dob: user.dob,
                role: user.role,
                receiveEmails: user.receiveEmails,
                profilePic: user.profilePic,
                memberSince: user.memberSince,
                preferences: JSON.parse(user.preferences), // Parse preferences back to JSON
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token , user: {
            id: user.id,
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
            country: user.country,
            gender: user.gender,
            dob: user.dob,
            receiveEmails: user.receiveEmails,
            profilePic: user.profilePic,
            memberSince: user.memberSince,
            preferences: JSON.parse(user.preferences), // Parse preferences back to JSON
        }});
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            id: user.id,
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
            country: user.country,
            gender: user.gender,
            dob: user.dob,
            receiveEmails: user.receiveEmails,
            profilePic: user.profilePic,
            memberSince: user.memberSince,
            preferences: JSON.parse(user.preferences), // Parse preferences back to JSON
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

exports.editProfile = async (req, res) => {
    const {
        firstName,
        surname,
        email,
        country,
        gender,
        dob,
        receiveEmails,
        profilePic,
        preferences,
    } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.firstName = firstName || user.firstName;
        user.surname = surname || user.surname;
        user.email = email || user.email;
        user.country = country || user.country;
        user.gender = gender || user.gender;
        user.dob = dob || user.dob;
        user.receiveEmails = receiveEmails !== undefined ? receiveEmails : user.receiveEmails;
        user.profilePic = profilePic || user.profilePic;
        user.preferences = preferences ? JSON.stringify(preferences) : user.preferences;

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                surname: user.surname,
                email: user.email,
                country: user.country,
                gender: user.gender,
                dob: user.dob,
                receiveEmails: user.receiveEmails,
                profilePic: user.profilePic,
                preferences: JSON.parse(user.preferences),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
};


