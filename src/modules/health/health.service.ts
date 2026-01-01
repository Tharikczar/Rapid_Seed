import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthCheck() {
    return {
      status: 'ok',
      service: 'RapidSeed Backend',
      timestamp: new Date().toISOString(),
    };
  }
}
