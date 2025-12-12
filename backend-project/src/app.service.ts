import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getPrediction(): [number, string] {
    return [0.0, 'test'];
  }
}
