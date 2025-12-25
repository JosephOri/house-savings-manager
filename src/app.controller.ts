import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({ status: 200, description: 'Return Hello World string.' })
  @Get()
  getHello(): string {
    return 'hello world';
  }
}
