import { Body, Controller, Headers, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
    constructor(private webhookService: WebhookService) {}

    @Post('cloudinary')
    async handle(
        @Headers('x-cld-signature') signature: string,
        @Headers('x-cld-timestamp') timestamp: string,
        @Body() body: any,
    ) {
        console.log('webhook');

        await this.webhookService.process(signature, timestamp, body);
    }
}
