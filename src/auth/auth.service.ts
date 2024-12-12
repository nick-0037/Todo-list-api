import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/auth.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './auth.dto';
import { LoginDto } from './auth.dto';
import { RefreshTokenDto } from './refreshToken.dto';
import { UserDocument } from '../userdocument/userDocument.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword });
    await user.save();
    return { message: 'User created successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({ id: user._id });
    const refreshToken = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });

    await user.setRefreshToken(refreshToken);
    await user.save();

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    let payload;
    try {
      payload = this.jwtService.verify(refreshToken)
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.userModel.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    const isTokenValid = await user.isRefreshTokenValid(refreshToken);
    if(!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.jwtService.sign({ id: user._id });
    const newRefreshToken = this.jwtService.sign({ id: user._id }, { expiresIn: '7d' });
    
    await user.setRefreshToken(newRefreshToken);
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}