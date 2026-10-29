import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/authGuard';

export const getRefreshCookieName = (role: string) => {
  return `refresh_token_${role.toLowerCase()}`;
};

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(1, 'Full name is required'),
  role: z.enum(['TRAVELLER', 'AGENCY', 'ADMIN']).optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  operatingRegion: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.string().optional(),
  portal: z.string().optional(),
  portalRole: z.string().optional(),
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const { user, tokens } = await AuthService.register(validated);

      const cookieName = getRefreshCookieName(user.role);
      res.cookie(cookieName, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const { user, tokens } = await AuthService.login(validated);

      const cookieName = getRefreshCookieName(user.role);
      res.cookie(cookieName, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const roleParam = (req.query.role as string) || req.body?.role || req.body?.portal;
      let token: string | undefined;

      if (roleParam) {
        const cookieName = getRefreshCookieName(roleParam);
        token = req.cookies?.[cookieName];
      }

      if (!token && req.cookies) {
        token =
          req.cookies.refresh_token_traveller ||
          req.cookies.refresh_token_agency ||
          req.cookies.refresh_token_admin ||
          req.cookies.refreshToken;
      }

      if (!token) {
        return sendError(res, 'Refresh token required in cookie', 401, 'REFRESH_TOKEN_REQUIRED');
      }

      const { user, tokens } = await AuthService.refreshToken(token, roleParam);

      const cookieName = getRefreshCookieName(user.role);
      res.cookie(cookieName, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return sendSuccess(res, { user, accessToken: tokens.accessToken }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    const roleParam = (req.query.role as string) || req.body?.role || req.body?.portal;
    if (roleParam) {
      res.clearCookie(getRefreshCookieName(roleParam), { path: '/' });
    } else {
      res.clearCookie('refresh_token_traveller', { path: '/' });
      res.clearCookie('refresh_token_agency', { path: '/' });
      res.clearCookie('refresh_token_admin', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
    }
    return sendSuccess(res, null, 'Logged out successfully');
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
      const user = await AuthService.getCurrentUser(req.user.id);
      return sendSuccess(res, { ...user, user }, 'User profile fetched');
    } catch (error) {
      next(error);
    }
  }
}
