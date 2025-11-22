import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  root() {
    return {
      message: '🚀 Sherketi-G Backend is LIVE & Healthy!',
      status: 'Blueprint 2 Fully Running',
      timestamp: new Date().toISOString(),
      docs: '/docs' // Swagger will be here soon
    };
  }

  @Get('health')
  health() {
    return { status: 'ok', platform: 'Sherketi-G' };
  }
}
