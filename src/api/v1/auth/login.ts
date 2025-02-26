// src/routes/login.ts

import {AuthService} from '@/services/AuthService';
import {UserService} from '@/services/UserService';
import {TwoFactorAuthService} from '@/services/TwoFactorAuthService';
import {Router} from 'express';
import {AuthController} from '@/controllers/AuthController';
import {Container} from 'inversify';
import {DeviceService} from "@/services/DeviceService";

const twoFactorAuthService = new TwoFactorAuthService();
const authService = new AuthService();
const userService = new UserService();
const deviceService = new DeviceService();

const authController = new AuthController(authService, userService, twoFactorAuthService, deviceService);

export default (router: Router, container: Container) => {
    router.post('/login', (req, res) => authController.login(req, res));
};



